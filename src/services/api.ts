import { SharedMessage, StudentDataRecord } from "../types";

const LOCAL_STORAGE_MESSAGES_KEY = "santanna_static_messages";
const LOCAL_STORAGE_STUDENTS_KEY = "santanna_static_students";

// Initial seed messages for static / GitHub Pages deployment
const INITIAL_STATIC_MESSAGES: SharedMessage[] = [
  {
    id: "msg-init-1",
    author: "Ana Clara",
    studentClass: "61",
    message: "Você não precisa carregar tudo sozinho. Sempre haverá alguém disposto a estender a mão e te ouvir. 🌻",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    likes: 14,
    likedBy: [],
  },
  {
    id: "msg-init-2",
    author: "Gabriel Santos",
    studentClass: "62",
    message: "Assim como os girassóis buscam a luz mesmo nos dias nublados, mantenha a esperança no coração. Sua vida importa muito! 💛",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    likes: 19,
    likedBy: [],
  },
  {
    id: "msg-init-3",
    author: "Mariana Costa",
    studentClass: "63",
    message: "Respire fundo, um passo de cada vez. Você é mais forte e especial do que imagina! ✨",
    timestamp: new Date().toISOString(),
    likes: 11,
    likedBy: [],
  },
];

function getLocalMessages(): SharedMessage[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_MESSAGES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Could not read local messages", e);
  }
  return INITIAL_STATIC_MESSAGES;
}

function saveLocalMessages(msgs: SharedMessage[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_MESSAGES_KEY, JSON.stringify(msgs));
  } catch (e) {
    console.warn("Could not save local messages", e);
  }
}

function getLocalStudents(): StudentDataRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_STUDENTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Could not read local students", e);
  }
  return [];
}

function saveLocalStudent(record: Partial<StudentDataRecord> & { studentId: string }) {
  try {
    const students = getLocalStudents();
    const existingIdx = students.findIndex((s) => s.id === record.studentId);
    const now = new Date().toISOString();
    if (existingIdx >= 0) {
      students[existingIdx] = {
        ...students[existingIdx],
        ...record,
        lastUpdated: now,
      } as StudentDataRecord;
    } else {
      students.unshift({
        id: record.studentId,
        studentName: record.studentName || "Aluno(a)",
        studentClass: record.studentClass || "",
        currentStep: record.currentStep || 1,
        startedAt: now,
        lastUpdated: now,
        completed: record.completed || false,
        ...record,
      } as StudentDataRecord);
    }
    localStorage.setItem(LOCAL_STORAGE_STUDENTS_KEY, JSON.stringify(students));
  } catch (e) {
    console.warn("Could not save student locally", e);
  }
}

export const api = {
  // Start or resume session
  async startSession(studentName: string, studentClass: string) {
    try {
      const res = await fetch("/api/session/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentName, studentClass }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Server offline (e.g. GitHub Pages static host)
    }

    // Static fallback
    const student = {
      id: `std_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      studentName,
      studentClass,
      currentStep: 1,
    };
    saveLocalStudent({
      studentId: student.id,
      studentName,
      studentClass,
      currentStep: 1,
    });
    return { success: true, student };
  },

  // Save student progress
  async saveProgress(data: Partial<StudentDataRecord> & { studentId: string }) {
    // Always persist to local fallback
    saveLocalStudent(data);

    try {
      const res = await fetch("/api/progress/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch {
      // Server offline
    }
    return { success: true };
  },

  // Get shared wall messages
  async getMessages(): Promise<SharedMessage[]> {
    try {
      const res = await fetch("/api/messages");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.messages) && data.messages.length > 0) {
          return data.messages;
        }
      }
    } catch {
      // Server offline
    }
    return getLocalMessages();
  },

  // Post message to shared wall
  async postMessage(
    message: string,
    author?: string,
    studentClass?: string
  ): Promise<SharedMessage | null> {
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, author, studentClass }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.message;
      }
    } catch {
      // Server offline
    }

    // Static fallback
    const newMsg: SharedMessage = {
      id: `msg-static-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      author: author?.trim() || "Estudante Guardião",
      studentClass: studentClass?.trim() || "",
      message: message.trim(),
      timestamp: new Date().toISOString(),
      likes: 1,
      likedBy: [],
    };
    const current = getLocalMessages();
    const updated = [newMsg, ...current];
    saveLocalMessages(updated);
    return newMsg;
  },

  // Like / Sunflower reaction
  async likeMessage(
    id: string,
    studentName?: string,
    studentClass?: string
  ): Promise<{ success: boolean; likes: number; alreadyLiked?: boolean } | null> {
    try {
      const res = await fetch(`/api/messages/${id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentName, studentClass }),
      });
      if (res.ok) return await res.json();
    } catch {
      // Server offline
    }

    // Static fallback
    const studentIdentifier = studentName
      ? `${studentName.trim().toLowerCase()}_${(studentClass || "").trim().toLowerCase()}`
      : "aluno_santanna";

    const current = getLocalMessages();
    const msg = current.find((m) => m.id === id);
    if (!msg) return null;

    msg.likedBy = msg.likedBy || [];
    if (msg.likedBy.includes(studentIdentifier)) {
      return { success: true, likes: msg.likes, alreadyLiked: true };
    }

    msg.likedBy.push(studentIdentifier);
    msg.likes = (msg.likes || 0) + 1;
    saveLocalMessages(current);
    return { success: true, likes: msg.likes };
  },

  // Teacher login
  async teacherLogin(code: string, password: string, teacherName?: string) {
    try {
      const res = await fetch("/api/teacher/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, password, teacherName }),
      });
      if (res.ok) return await res.json();
    } catch {
      // Server offline
    }

    // Static fallback with the exact password Santanna@26
    if (password === "Santanna@26") {
      const token = `auth_static_teacher_${Date.now()}`;
      return {
        success: true,
        token,
        teacherName: teacherName?.trim() || "Prof. Ederson Braga Mello",
      };
    }
    return { success: false, error: "Código ou senha incorretos." };
  },

  // Teacher get students
  async getTeacherStudents(token: string): Promise<StudentDataRecord[]> {
    try {
      const res = await fetch("/api/teacher/students", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        return data.students || [];
      }
    } catch {
      // Server offline
    }
    return getLocalStudents();
  },

  // Teacher clear data
  async clearTeacherData(token: string) {
    try {
      const res = await fetch("/api/teacher/clear", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) return await res.json();
    } catch {
      // Server offline
    }
    localStorage.removeItem(LOCAL_STORAGE_STUDENTS_KEY);
    return { success: true };
  },

  // Update message on mural
  async updateMessage(
    id: string,
    data: { message: string; author?: string; studentClass?: string }
  ): Promise<{ success: boolean; message?: SharedMessage; error?: string }> {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch {
      // Server offline
    }

    const current = getLocalMessages();
    const msg = current.find((m) => m.id === id);
    if (!msg) return { success: false, error: "Mensagem não encontrada" };
    msg.message = data.message;
    if (data.author) msg.author = data.author;
    if (data.studentClass) msg.studentClass = data.studentClass;
    saveLocalMessages(current);
    return { success: true, message: msg };
  },

  // Teacher delete message from mural
  async deleteMuralMessage(id: string, token: string) {
    try {
      const cleanToken = token.replace(/^Bearer\s+/i, "");
      const res = await fetch(`/api/teacher/messages/${id}?token=${encodeURIComponent(cleanToken)}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${cleanToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: cleanToken }),
      });
      if (res.ok) return await res.json();
    } catch {
      // Server offline
    }

    const current = getLocalMessages().filter((m) => m.id !== id);
    saveLocalMessages(current);
    return { success: true };
  },

  // Send certificate by email
  async sendCertificateByEmail(
    email: string,
    studentName: string,
    studentClass: string
  ): Promise<{
    success: boolean;
    message?: string;
    error?: string;
    previewUrl?: string;
    gmailWebUrl?: string;
    mailtoUrl?: string;
  }> {
    try {
      const res = await fetch("/api/certificate/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, studentName, studentClass }),
      });
      if (res.ok) return await res.json();
    } catch {
      // Server offline
    }

    const subject = encodeURIComponent(`Certificado Setembro Amarelo 🌻 - ${studentName} (${studentClass})`);
    const body = encodeURIComponent(
      `Olá, ${studentName}!\n\nParabéns por completar os 8 desafios da Missão Setembro Amarelo do Colégio Franciscano Sant'Anna!\n\nVocê é agora oficialmente Guardião(ã) da Empatia e Valorização da Vida 🌻.\n\nCom carinho,\nProf. Ederson Braga Mello\nColégio Franciscano Sant'Anna`
    );
    const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;
    const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${subject}&body=${body}`;

    return {
      success: true,
      message: `Pronto! Como o site está em hospedagem estática, você pode abrir o e-mail diretamente.`,
      gmailWebUrl,
      mailtoUrl,
    };
  },
};
