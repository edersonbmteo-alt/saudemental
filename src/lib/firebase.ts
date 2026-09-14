import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocFromServer,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  runTransaction,
} from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged, User } from "firebase/auth";
import firebaseConfig from "../../firebase-applet-config.json";
import { SharedMessage, StudentDataRecord } from "../types";
import { BASE_EXISTING_STUDENTS, BASE_EXISTING_MESSAGES } from "../data/persistedBaseData";

// Initialize Firebase App singleton
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with custom provisioned database ID
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Firebase Auth
export const auth = getAuth(app);

let currentUser: User | null = null;
let authReadyPromise: Promise<User | null> | null = null;

// Ensure anonymous authentication for every student workstation
export function ensureAuth(): Promise<User | null> {
  if (currentUser) return Promise.resolve(currentUser);
  if (authReadyPromise) return authReadyPromise;

  authReadyPromise = new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        currentUser = user;
        resolve(user);
      } else {
        try {
          const cred = await signInAnonymously(auth);
          currentUser = cred.user;
          resolve(cred.user);
        } catch (err) {
          console.warn("[Firebase] Anonymous auth notice:", err);
          resolve(null);
        }
      }
    });
  });

  return authReadyPromise;
}

// Connection test as required by Firebase skill
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.warn("Firestore client offline, operating with cached state.");
    }
    return false;
  }
}

// Immediately trigger auth & connection test
ensureAuth().catch(() => {});
testConnection().catch(() => {});

let hasSeeded = false;
export async function seedInitialDataIfEmpty() {
  if (hasSeeded) return;
  hasSeeded = true;
  try {
    await ensureAuth();
    // 1. Seed Mural Messages if empty
    const muralSnap = await getDocs(collection(db, "mural_messages"));
    if (muralSnap.empty) {
      for (const msg of BASE_EXISTING_MESSAGES) {
        await publishMessageToCloud(msg);
      }
    }

    // 2. Seed Student Progress if empty
    const studentSnap = await getDocs(collection(db, "student_progress"));
    if (studentSnap.empty) {
      for (const st of BASE_EXISTING_STUDENTS) {
        await saveProgressToCloud({
          ...st,
          studentId: st.id,
        });
      }
    }
  } catch (err) {
    console.warn("[Firestore] Initial seeding skipped:", err);
  }
}

// Cloud Real-Time Listener for Mural Messages across all computers
export function subscribeToMuralMessages(
  callback: (messages: SharedMessage[]) => void,
  onError?: (error: Error) => void
): () => void {
  const messagesCol = collection(db, "mural_messages");

  // Attempt seeding if collection is newly created
  seedInitialDataIfEmpty();

  // Real-time Firestore snapshot listener
  const unsubscribe = onSnapshot(
    messagesCol,
    (snapshot) => {
      if (snapshot.empty) {
        // Fallback to initial messages while first writes complete
        callback(BASE_EXISTING_MESSAGES);
        seedInitialDataIfEmpty();
        return;
      }

      const messages: SharedMessage[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as any;
        messages.push({
          id: docSnap.id,
          author: data.author || "Anônimo",
          studentClass: data.studentClass || "",
          message: data.message || "",
          timestamp: data.createdAt || data.timestamp || new Date().toISOString(),
          likes: Number(data.likes || 0),
          likedBy: Array.isArray(data.likedBy) ? data.likedBy : [],
          editedAt: data.editedAt,
        });
      });

      // Sort newest first
      messages.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      callback(messages);
    },
    (err) => {
      console.error("[Firestore] Mural sync error:", err);
      if (onError) onError(err);
    }
  );

  return unsubscribe;
}

// Publish message to cloud Firestore (instant sync to all computers)
export async function publishMessageToCloud(msg: SharedMessage): Promise<void> {
  await ensureAuth();
  const safeId = msg.id.replace(/[^a-zA-Z0-9_\-]/g, "_");
  const docRef = doc(db, "mural_messages", safeId);
  
  await setDoc(docRef, {
    id: safeId,
    author: msg.author || "Estudante Guardião",
    studentClass: msg.studentClass || "",
    message: msg.message,
    likes: Number(msg.likes || 0),
    likedBy: Array.isArray(msg.likedBy) ? msg.likedBy : [],
    createdAt: msg.timestamp || new Date().toISOString(),
    isOfficial: false,
  });
}

// Like message with transaction in Cloud Firestore (no double likes, sync in milliseconds)
export async function likeMessageInCloud(
  messageId: string,
  studentKey: string
): Promise<{ success: boolean; likes: number; alreadyLiked?: boolean }> {
  await ensureAuth();
  const safeId = messageId.replace(/[^a-zA-Z0-9_\-]/g, "_");
  const docRef = doc(db, "mural_messages", safeId);

  try {
    const result = await runTransaction(db, async (transaction) => {
      const docSnap = await transaction.get(docRef);
      if (!docSnap.exists()) {
        throw new Error("Message not found");
      }
      const data = docSnap.data();
      const likedBy: string[] = Array.isArray(data.likedBy) ? [...data.likedBy] : [];
      const currentLikes = Number(data.likes || 0);

      if (studentKey && likedBy.includes(studentKey)) {
        return { success: true, likes: currentLikes, alreadyLiked: true };
      }

      const nextLikedBy = studentKey ? [...likedBy, studentKey] : likedBy;
      const nextLikes = currentLikes + 1;

      transaction.update(docRef, {
        likes: nextLikes,
        likedBy: nextLikedBy,
      });

      return { success: true, likes: nextLikes, alreadyLiked: false };
    });

    return result;
  } catch (err) {
    console.error("[Firestore] Error liking message:", err);
    throw err;
  }
}

// Real-Time Listener for Student Progress across school lab computers
export function subscribeToStudentsProgress(
  callback: (students: StudentDataRecord[]) => void
): () => void {
  const progressCol = collection(db, "student_progress");

  return onSnapshot(
    progressCol,
    (snapshot) => {
      const students: StudentDataRecord[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as any;
        students.push({
          id: docSnap.id,
          studentName: data.studentName || "Aluno",
          studentClass: data.studentClass || "",
          currentStep: Number(data.currentStep || data.currentChallenge || 1),
          quizScore: data.quizScore || "Não realizado",
          quizDetails: data.quizDetails || "",
          wordSearchFound: data.wordSearchFound || [],
          sevenErrorsMarked: Number(data.sevenErrorsMarked || 0),
          wordsGoodSelected: data.wordsGoodSelected || [],
          wordsGoodReflection: data.wordsGoodReflection || "",
          crosswordResult: data.crosswordResult || "Pendente",
          qualitiesSelected: data.qualitiesSelected || [],
          qualityRecognizedOwn: data.qualityRecognizedOwn || "",
          qualityToDevelop: data.qualityToDevelop || "",
          finalMessage: data.finalMessage || "",
          completed: Boolean(data.completed),
          startedAt: data.startedAt || data.updatedAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString(),
          lastUpdated: data.updatedAt || new Date().toISOString(),
        });
      });

      students.sort(
        (a, b) =>
          new Date(b.updatedAt || b.lastUpdated || 0).getTime() -
          new Date(a.updatedAt || a.lastUpdated || 0).getTime()
      );

      callback(students);
    },
    (err) => {
      console.error("[Firestore] Progress sync error:", err);
    }
  );
}

// Save Student Progress directly to Cloud Firestore
export async function saveProgressToCloud(
  record: Partial<StudentDataRecord> & { studentId: string }
): Promise<void> {
  await ensureAuth();
  const safeId = (record.studentId || `std_${Date.now()}`).replace(/[^a-zA-Z0-9_\-]/g, "_");
  const docRef = doc(db, "student_progress", safeId);

  const docSnap = await getDoc(docRef);
  const existing = docSnap.exists() ? docSnap.data() : {};

  const payload = {
    ...existing,
    ...record,
    studentName: record.studentName || existing.studentName || "Aluno(a)",
    studentClass: record.studentClass || existing.studentClass || "",
    completedChallenges: record.completed ? [1, 2, 3, 4, 5, 6, 7, 8] : [record.currentStep || 1],
    currentChallenge: Number(record.currentStep || existing.currentStep || 1),
    score: Number(record.completed ? 100 : (record.currentStep || 1) * 12),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(docRef, payload, { merge: true });
}

// Delete message from Cloud Firestore (immediately propagates deletion to all devices via onSnapshot)
export async function deleteMuralMessageFromCloud(messageId: string): Promise<boolean> {
  try {
    await ensureAuth();
    const safeId = messageId.replace(/[^a-zA-Z0-9_\-]/g, "_");
    const docRef = doc(db, "mural_messages", safeId);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error("[Firestore] Error deleting mural message:", err);
    return false;
  }
}

// Update message text or author in Cloud Firestore
export async function updateMuralMessageInCloud(
  messageId: string,
  message: string,
  author?: string,
  studentClass?: string
): Promise<boolean> {
  try {
    await ensureAuth();
    const safeId = messageId.replace(/[^a-zA-Z0-9_\-]/g, "_");
    const docRef = doc(db, "mural_messages", safeId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return false;
    const existing = docSnap.data();
    await setDoc(docRef, {
      ...existing,
      message,
      ...(author ? { author } : {}),
      ...(studentClass ? { studentClass } : {}),
      editedAt: new Date().toISOString(),
    });
    return true;
  } catch (err) {
    console.error("[Firestore] Error updating mural message:", err);
    return false;
  }
}

// Clear all student progress from Cloud Firestore
export async function clearAllStudentsProgressFromCloud(): Promise<boolean> {
  try {
    await ensureAuth();
    const snap = await getDocs(collection(db, "student_progress"));
    const deletes: Promise<void>[] = [];
    snap.forEach((d) => deletes.push(deleteDoc(d.ref)));
    await Promise.all(deletes);
    return true;
  } catch (err) {
    console.error("[Firestore] Error clearing student progress:", err);
    return false;
  }
}

