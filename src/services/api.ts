import { SharedMessage, StudentDataRecord } from "../types";

export const api = {
  // Start or resume session
  async startSession(studentName: string, studentClass: string) {
    const res = await fetch("/api/session/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentName, studentClass }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Erro na conexão" }));
      throw new Error(err.error || "Não foi possível iniciar a sessão");
    }
    return res.json();
  },

  // Save student progress
  async saveProgress(data: Partial<StudentDataRecord> & { studentId: string }) {
    try {
      const res = await fetch("/api/progress/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (err) {
      console.warn("Could not save progress to server:", err);
      return { success: false };
    }
  },

  // Get shared wall messages
  async getMessages(): Promise<SharedMessage[]> {
    try {
      const res = await fetch("/api/messages");
      if (res.ok) {
        const data = await res.json();
        return data.messages || [];
      }
    } catch (err) {
      console.warn("Error fetching wall messages:", err);
    }
    return [];
  },

  // Post message to shared wall
  async postMessage(
    message: string,
    author?: string,
    studentClass?: string
  ): Promise<SharedMessage | null> {
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, author, studentClass }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.message;
    }
    return null;
  },

  // Like / Sunflower reaction (1 like per student per post)
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
      const data = await res.json();
      return data;
    } catch (err) {
      console.warn("Error reacting to message:", err);
    }
    return null;
  },

  // Teacher login
  async teacherLogin(code: string, password: string, teacherName?: string) {
    const res = await fetch("/api/teacher/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, password, teacherName }),
    });
    return res.json();
  },

  // Teacher get students
  async getTeacherStudents(token: string): Promise<StudentDataRecord[]> {
    const res = await fetch("/api/teacher/students", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Acesso negado");
    const data = await res.json();
    return data.students || [];
  },

  // Teacher clear data
  async clearTeacherData(token: string) {
    const res = await fetch("/api/teacher/clear", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  // Update message on mural
  async updateMessage(
    id: string,
    data: { message: string; author?: string; studentClass?: string }
  ): Promise<{ success: boolean; message?: SharedMessage; error?: string }> {
    const res = await fetch(`/api/messages/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Teacher delete message from mural
  async deleteMuralMessage(id: string, token: string) {
    const cleanToken = token.replace(/^Bearer\s+/i, "");
    const res = await fetch(`/api/teacher/messages/${id}?token=${encodeURIComponent(cleanToken)}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: cleanToken }),
    });
    return res.json();
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
    const res = await fetch("/api/certificate/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, studentName, studentClass }),
    });
    return res.json();
  },
};
