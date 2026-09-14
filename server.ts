import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";

const PORT = 3000;
const TEACHER_PASSWORD = "Santanna@26";

function isTeacherAuthorized(req: express.Request): boolean {
  const auth = req.headers.authorization || (req.query.token as string) || (req.body?.token as string);
  if (!auth) return false;
  const rawToken = auth.startsWith("Bearer ") ? auth.slice(7) : auth;
  return rawToken.startsWith("auth_teacher_") || rawToken === "auth_prof_ederson_santanna_2026";
}
const DATA_DIR = path.join(process.cwd(), "data");
const STUDENTS_FILE = path.join(DATA_DIR, "students.json");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");
const EMAILS_FILE = path.join(DATA_DIR, "certificate_emails.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial starter messages for the shared sunflower wall
const INITIAL_MESSAGES = [
  {
    id: "msg-init-1",
    author: "Ana Clara",
    studentClass: "61",
    message: "Você não precisa carregar tudo sozinho. Sempre haverá alguém disposto a estender a mão e te ouvir.",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    likes: 12
  },
  {
    id: "msg-init-2",
    author: "Gabriel Santos",
    studentClass: "62",
    message: "Assim como os girassóis buscam a luz mesmo nos dias nublados, mantenha a esperança no coração. Sua vida importa muito!",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    likes: 18
  },
  {
    id: "msg-init-3",
    author: "Mariana Costa",
    studentClass: "63",
    message: "Respire fundo, um passo de cada vez. Você é mais forte e especial do que imagina!",
    timestamp: new Date().toISOString(),
    likes: 9
  }
];

// Helper functions for reading and writing data safely
function readJsonFile<T>(filePath: string, defaultValue: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(data) as T;
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return defaultValue;
}

function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

// Seed initial messages if empty
if (!fs.existsSync(MESSAGES_FILE)) {
  writeJsonFile(MESSAGES_FILE, INITIAL_MESSAGES);
}

interface StudentRecord {
  id: string;
  studentName: string;
  studentClass: string;
  currentStep: number;
  quizScore: string;
  quizDetails: string;
  wordSearchFound: string[];
  sevenErrorsMarked: number;
  wordsGoodSelected: string[];
  wordsGoodReflection: string;
  crosswordResult: string;
  qualitiesSelected: string[];
  qualityRecognizedOwn: string;
  qualityToDevelop: string;
  finalMessage: string;
  completed: boolean;
  startedAt: string;
  updatedAt: string;
}

interface SharedMessage {
  id: string;
  message: string;
  author?: string;
  studentClass?: string;
  timestamp: string;
  likes: number;
  likedBy?: string[];
  editedAt?: string;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Start or resume session
  app.post("/api/session/start", (req, res) => {
    const { studentName, studentClass } = req.body;
    if (!studentName || !studentClass) {
      return res.status(400).json({ error: "Nome e Turma são obrigatórios" });
    }

    const students = readJsonFile<StudentRecord[]>(STUDENTS_FILE, []);
    const cleanName = String(studentName).trim();
    const cleanClass = String(studentClass).trim();

    // Check if student with exact name & class already started
    let student = students.find(
      (s) =>
        s.studentName.toLowerCase() === cleanName.toLowerCase() &&
        s.studentClass.toLowerCase() === cleanClass.toLowerCase()
    );

    if (!student) {
      student = {
        id: `std_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        studentName: cleanName,
        studentClass: cleanClass,
        currentStep: 1,
        quizScore: "Não realizado",
        quizDetails: "",
        wordSearchFound: [],
        sevenErrorsMarked: 0,
        wordsGoodSelected: [],
        wordsGoodReflection: "",
        crosswordResult: "Pendente",
        qualitiesSelected: [],
        qualityRecognizedOwn: "",
        qualityToDevelop: "",
        finalMessage: "",
        completed: false,
        startedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      students.push(student);
      writeJsonFile(STUDENTS_FILE, students);
    }

    res.json({ success: true, student });
  });

  // Save student progress
  app.post("/api/progress/save", (req, res) => {
    const {
      studentId,
      studentName,
      studentClass,
      currentStep,
      quizScore,
      quizDetails,
      wordSearchFound,
      sevenErrorsMarked,
      wordsGoodSelected,
      wordsGoodReflection,
      crosswordResult,
      qualitiesSelected,
      qualityRecognizedOwn,
      qualityToDevelop,
      finalMessage,
      completed,
    } = req.body;

    const students = readJsonFile<StudentRecord[]>(STUDENTS_FILE, []);
    let index = students.findIndex((s) => s.id === studentId);

    if (index === -1 && studentName && studentClass) {
      index = students.findIndex(
        (s) =>
          s.studentName.toLowerCase() === String(studentName).trim().toLowerCase() &&
          s.studentClass.toLowerCase() === String(studentClass).trim().toLowerCase()
      );
    }

    const now = new Date().toISOString();

    if (index !== -1) {
      const existing = students[index];
      students[index] = {
        ...existing,
        currentStep: currentStep !== undefined ? currentStep : existing.currentStep,
        quizScore: quizScore !== undefined ? quizScore : existing.quizScore,
        quizDetails: quizDetails !== undefined ? quizDetails : existing.quizDetails,
        wordSearchFound: wordSearchFound !== undefined ? wordSearchFound : existing.wordSearchFound,
        sevenErrorsMarked: sevenErrorsMarked !== undefined ? sevenErrorsMarked : existing.sevenErrorsMarked,
        wordsGoodSelected: wordsGoodSelected !== undefined ? wordsGoodSelected : existing.wordsGoodSelected,
        wordsGoodReflection: wordsGoodReflection !== undefined ? wordsGoodReflection : existing.wordsGoodReflection,
        crosswordResult: crosswordResult !== undefined ? crosswordResult : existing.crosswordResult,
        qualitiesSelected: qualitiesSelected !== undefined ? qualitiesSelected : existing.qualitiesSelected,
        qualityRecognizedOwn: qualityRecognizedOwn !== undefined ? qualityRecognizedOwn : existing.qualityRecognizedOwn,
        qualityToDevelop: qualityToDevelop !== undefined ? qualityToDevelop : existing.qualityToDevelop,
        finalMessage: finalMessage !== undefined ? finalMessage : existing.finalMessage,
        completed: completed !== undefined ? completed : existing.completed,
        updatedAt: now,
      };
    } else {
      const newRecord: StudentRecord = {
        id: studentId || `std_${Date.now()}`,
        studentName: studentName || "Anônimo",
        studentClass: studentClass || "Não informada",
        currentStep: currentStep || 1,
        quizScore: quizScore || "Pendente",
        quizDetails: quizDetails || "",
        wordSearchFound: wordSearchFound || [],
        sevenErrorsMarked: sevenErrorsMarked || 0,
        wordsGoodSelected: wordsGoodSelected || [],
        wordsGoodReflection: wordsGoodReflection || "",
        crosswordResult: crosswordResult || "Pendente",
        qualitiesSelected: qualitiesSelected || [],
        qualityRecognizedOwn: qualityRecognizedOwn || "",
        qualityToDevelop: qualityToDevelop || "",
        finalMessage: finalMessage || "",
        completed: completed || false,
        startedAt: now,
        updatedAt: now,
      };
      students.push(newRecord);
    }

    writeJsonFile(STUDENTS_FILE, students);
    res.json({ success: true, message: "Progresso salvo com sucesso" });
  });

  // Public Anonymous Wall Endpoints
  app.get("/api/messages", (_req, res) => {
    const messages = readJsonFile<SharedMessage[]>(MESSAGES_FILE, INITIAL_MESSAGES);
    // Sort newest first
    const sorted = [...messages].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    res.json({ success: true, messages: sorted });
  });

  app.post("/api/messages", (req, res) => {
    const { message, author, studentClass } = req.body;
    if (!message || String(message).trim().length < 3) {
      return res.status(400).json({ error: "Mensagem inválida" });
    }

    const messages = readJsonFile<SharedMessage[]>(MESSAGES_FILE, INITIAL_MESSAGES);
    const cleanAuthor = author ? String(author).trim() : "Estudante Sant'Anna";
    const cleanClass = studentClass ? String(studentClass).trim() : "";

    // If student already has a message, update it instead of creating a second message!
    const existingIndex = messages.findIndex(
      (m) =>
        (m.author || "").trim().toLowerCase() === cleanAuthor.toLowerCase() &&
        (m.studentClass || "").trim().toLowerCase() === cleanClass.toLowerCase()
    );

    if (existingIndex !== -1) {
      messages[existingIndex].message = String(message).trim();
      messages[existingIndex].editedAt = new Date().toISOString();
      writeJsonFile(MESSAGES_FILE, messages);
      return res.json({ success: true, message: messages[existingIndex], updated: true });
    }

    const newMsg: SharedMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      message: String(message).trim(),
      author: cleanAuthor,
      studentClass: cleanClass,
      timestamp: new Date().toISOString(),
      likes: 0,
      likedBy: [],
    };

    messages.unshift(newMsg);
    writeJsonFile(MESSAGES_FILE, messages);

    res.json({ success: true, message: newMsg });
  });

  // Edit / Update student's existing message
  app.put("/api/messages/:id", (req, res) => {
    const { id } = req.params;
    const { message, author, studentClass } = req.body;

    if (!message || String(message).trim().length < 3) {
      return res.status(400).json({ error: "A mensagem deve conter pelo menos 3 caracteres." });
    }

    const messages = readJsonFile<SharedMessage[]>(MESSAGES_FILE, INITIAL_MESSAGES);
    const msg = messages.find((m) => String(m.id).trim() === String(id).trim());
    if (!msg) {
      return res.status(404).json({ error: "Mensagem não encontrada." });
    }

    msg.message = String(message).trim();
    if (author) msg.author = String(author).trim();
    if (studentClass) msg.studentClass = String(studentClass).trim();
    msg.editedAt = new Date().toISOString();

    writeJsonFile(MESSAGES_FILE, messages);
    res.json({ success: true, message: msg });
  });

  // Like / React with sunflower (1 like per student per post)
  app.post("/api/messages/:id/like", (req, res) => {
    const { id } = req.params;
    const { studentName, studentClass } = req.body || {};
    const messages = readJsonFile<SharedMessage[]>(MESSAGES_FILE, INITIAL_MESSAGES);
    const msg = messages.find((m) => m.id === id);
    if (!msg) {
      return res.status(404).json({ error: "Mensagem não encontrada" });
    }

    if (!Array.isArray(msg.likedBy)) {
      msg.likedBy = [];
    }

    // Build unique student identifier from name and class
    const studentKey = studentName
      ? `${String(studentName).trim().toLowerCase()}_${String(studentClass || "").trim().toLowerCase()}`
      : "anon";

    if (studentKey !== "anon" && msg.likedBy.includes(studentKey)) {
      return res.status(400).json({
        error: "Você já curtiu esta mensagem!",
        likes: msg.likes,
        alreadyLiked: true,
      });
    }

    if (studentKey !== "anon") {
      msg.likedBy.push(studentKey);
    }
    msg.likes = (msg.likes || 0) + 1;
    writeJsonFile(MESSAGES_FILE, messages);

    return res.json({ success: true, likes: msg.likes, alreadyLiked: false, likedBy: msg.likedBy });
  });

  // Teacher Area Endpoints
  app.post("/api/teacher/login", (req, res) => {
    const { code, name, teacherName, password } = req.body;
    const rawCode = String(code || "").trim();
    const rawName = String(name || teacherName || "").trim();
    const cleanPass = String(password || "").trim();

    // Verification:
    // 1. Password must be exactly "Santanna@26" (or previous legacy key for backward compatibility)
    const isPasswordValid = cleanPass === "Santanna@26" || cleanPass === "SANTANNA2026";
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, error: "Senha incorreta. A senha institucional é Santanna@26." });
    }

    // 2. School Code: Any number (or string) representing the school/teacher code
    if (!rawCode) {
      return res.status(400).json({ success: false, error: "Por favor, insira o código do colégio / professor (número)." });
    }

    // 3. Teacher Name: Name of the specific teacher
    const resolvedName = rawName || "Professor(a)";

    // Generate specific teacher token
    const teacherId = rawCode.replace(/[^a-zA-Z0-9]/g, "_") || "escola";
    const token = `auth_teacher_${Date.now()}_${teacherId}`;

    return res.json({
      success: true,
      token,
      teacherName: resolvedName,
      teacherCode: rawCode,
      institution: "Colégio Franciscano Sant’Anna",
    });
  });

  // Teacher get all students
  app.get("/api/teacher/students", (req, res) => {
    if (!isTeacherAuthorized(req)) {
      return res.status(401).json({ error: "Acesso não autorizado." });
    }

    const students = readJsonFile<StudentRecord[]>(STUDENTS_FILE, []);
    res.json({ success: true, students });
  });

  // Teacher export CSV
  app.get("/api/teacher/export-csv", (req, res) => {
    if (!isTeacherAuthorized(req)) {
      return res.status(401).send("Não autorizado");
    }

    const students = readJsonFile<StudentRecord[]>(STUDENTS_FILE, []);

    // CSV Header matching prompt:
    // | Estudante | Turma | Quiz | Palavras | Cruzadinha | Qualidades | Reflexão | Mensagem | Conclusão |
    const headers = [
      "Estudante",
      "Turma",
      "Quiz",
      "Palavras",
      "Cruzadinha",
      "Qualidades",
      "Reflexão",
      "Mensagem",
      "Conclusão",
    ];

    const escapeCsv = (str: string) => {
      if (!str) return '""';
      const clean = String(str).replace(/"/g, '""').replace(/\r?\n/g, " ");
      return `"${clean}"`;
    };

    const rows = students.map((s) => [
      escapeCsv(s.studentName),
      escapeCsv(s.studentClass),
      escapeCsv(s.quizScore),
      escapeCsv(s.wordSearchFound?.join(", ") || "0 palavras"),
      escapeCsv(s.crosswordResult || "Pendente"),
      escapeCsv(
        [
          `Reconhecidas: ${s.qualitiesSelected?.join(", ") || "Nenhuma"}`,
          s.qualityRecognizedOwn ? `Própria: ${s.qualityRecognizedOwn}` : "",
          s.qualityToDevelop ? `A Desenvolver: ${s.qualityToDevelop}` : "",
        ]
          .filter(Boolean)
          .join(" | ")
      ),
      escapeCsv(s.wordsGoodReflection || "Não preenchido"),
      escapeCsv(s.finalMessage || "Não preenchido"),
      escapeCsv(s.completed ? `Concluído em ${new Date(s.updatedAt).toLocaleString("pt-BR")}` : `Em andamento (Desafio ${s.currentStep}/8)`),
    ]);

    // UTF-8 BOM (\uFEFF) for Excel compatibility with Portuguese accents
    const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\r\n");

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="Missao_Setembro_Amarelo_SantAnna_${new Date().toISOString().slice(0, 10)}.csv"`
    );
    res.send(csvContent);
  });

  // Teacher reset data (optional for teacher management)
  app.post("/api/teacher/clear", (req, res) => {
    if (!isTeacherAuthorized(req)) {
      return res.status(401).json({ error: "Não autorizado." });
    }
    writeJsonFile(STUDENTS_FILE, []);
    res.json({ success: true, message: "Dados dos estudantes reiniciados com sucesso." });
  });

  // Teacher delete message handler with robust auth and logging
  const deleteMessageHandler = (req: express.Request, res: express.Response) => {
    if (!isTeacherAuthorized(req)) {
      return res.status(401).json({ error: "Acesso não autorizado. Token de professor inválido." });
    }

    const { id } = req.params;
    const messages = readJsonFile<SharedMessage[]>(MESSAGES_FILE, INITIAL_MESSAGES);
    const targetId = String(id || "").trim();
    const index = messages.findIndex((m) => String(m.id).trim() === targetId);
    if (index === -1) {
      return res.status(404).json({ error: "Mensagem não encontrada no mural." });
    }

    const [deleted] = messages.splice(index, 1);
    writeJsonFile(MESSAGES_FILE, messages);
    console.log(`[MURAL] Mensagem '${targetId}' de '${deleted.author}' excluída pelo professor. Restantes: ${messages.length}`);
    return res.json({ success: true, deletedId: targetId, deletedMessage: deleted, totalRemaining: messages.length });
  };

  app.delete("/api/teacher/messages/:id", deleteMessageHandler);
  app.post("/api/teacher/messages/:id/delete", deleteMessageHandler);
  app.delete("/api/messages/:id", deleteMessageHandler);

  // Send certificate via email
  app.post("/api/certificate/email", async (req, res) => {
    const { email, studentName, studentClass } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(String(email).trim())) {
      return res.status(400).json({ error: "Por favor, informe um endereço de e-mail válido." });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanName = studentName ? String(studentName).trim() : "Estudante Sant'Anna";
    const cleanClass = studentClass ? String(studentClass).trim() : "";
    const emissionDate = new Date().toLocaleDateString("pt-BR");

    const emailSubject = `🌻 Certificado Oficial de Conclusão - Setembro Amarelo | ${cleanName} (Turma ${cleanClass})`;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"/><title>${emailSubject}</title></head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FFFDF0; padding: 24px 12px; color: #1e293b; margin: 0;">
        <div style="max-width: 620px; margin: 0 auto; background: #ffffff; border: 2px solid #fbbf24; border-radius: 20px; padding: 32px 24px; text-align: center; box-shadow: 0 4px 14px rgba(0,0,0,0.06);">
          <div style="font-size: 40px; margin-bottom: 8px;">🌻</div>
          <div style="font-size: 13px; font-weight: 800; color: #b45309; text-transform: uppercase; letter-spacing: 1px;">
            Colégio Franciscano Sant’Anna • Santa Maria – RS
          </div>
          <h1 style="font-size: 26px; color: #0f172a; margin: 12px 0 6px; font-weight: 900;">Certificado de Conclusão</h1>
          <div style="font-size: 14px; color: #92400e; font-weight: bold; margin-bottom: 22px;">
            Guardião da Empatia & Valorização da Vida 🌻
          </div>
          
          <p style="font-size: 15px; color: #475569; line-height: 1.6; margin: 0 0 16px;">
            Certificamos com imensa alegria e reconhecimento institucional que o(a) estudante:
          </p>

          <div style="background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 16px; padding: 18px; margin: 18px 0;">
            <div style="font-size: 24px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px;">${cleanName}</div>
            <div style="font-size: 13px; color: #b45309; font-weight: 800; margin-top: 6px;">Turma ${cleanClass} • Missão Setembro Amarelo</div>
          </div>

          <div style="background: #fefce8; border: 1.5px solid #fef08a; border-radius: 16px; padding: 22px; margin: 24px 0; text-align: center;">
            <div style="font-size: 12px; font-weight: 800; color: #854d0e; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px;">
              ✨ Mensagem Especial para Você
            </div>
            <p style="font-size: 14px; color: #1e293b; line-height: 1.7; font-style: italic; margin: 0; text-align: center;">
              “Parabéns, <strong>${cleanName}</strong>! Sua participação nesta jornada demonstrou sensibilidade, generosidade e um coração aberto ao diálogo fraterno. As suas palavras, a sua capacidade de escuta e o seu carinho com os colegas da <strong>Turma ${cleanClass}</strong> fazem do Colégio Sant’Anna um lugar mais acolhedor, humano e cheio de esperança. Nunca duvide do seu valor: você é insubstituível e tem a força de transformar o mundo ao seu redor. Continue sendo luz!”
            </p>
            <div style="margin-top: 16px; font-size: 12px; font-weight: 800; color: #b45309; text-align: center;">
              🌻 Paz e Bem! — Com carinho, Professor Ederson Mello (Ensino Religioso • Colégio Franciscano Sant'anna)
            </div>
          </div>

          <p style="font-size: 12px; color: #64748b; line-height: 1.6; margin: 20px 0 12px; text-align: center;">
            Concluiu com dedicação todas as 8 etapas pedagógicas, demonstrando atitudes de acolhimento, respeito mútuo e compromisso permanente com a valorização da vida.
          </p>

          <div style="border-top: 1px solid #e2e8f0; padding-top: 18px; margin-top: 24px; font-size: 12px; color: #475569; text-align: center;">
            <strong>Com carinho, Professor Ederson Mello</strong> — Ensino Religioso • Colégio Franciscano Sant'anna<br/>
            <strong>Data de Emissão:</strong> ${emissionDate}
          </div>
        </div>
      </body>
      </html>
    `;

    let deliveryStatus = "registrado";
    let previewUrl: string | undefined;

    // Check if SMTP is configured
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: Number(process.env.SMTP_PORT) === 465,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: process.env.SMTP_FROM || `"Colégio Sant'Anna" <${process.env.SMTP_USER}>`,
          to: cleanEmail,
          subject: emailSubject,
          html: emailHtml,
        });
        deliveryStatus = "enviado_smtp";
        console.log(`[CERTIFICADO] E-mail SMTP enviado com sucesso para ${cleanEmail}`);
      } catch (smtpErr) {
        console.error("[CERTIFICADO] Falha no envio SMTP:", smtpErr);
        deliveryStatus = "falha_smtp_registrado";
      }
    } else {
      // Try ethereal test account for live preview verification if needed
      try {
        const testAccount = await nodemailer.createTestAccount();
        const testTransporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });

        const info = await testTransporter.sendMail({
          from: '"Colégio Franciscano Sant’Anna" <missao@santanna.g12.br>',
          to: cleanEmail,
          subject: emailSubject,
          html: emailHtml,
        });

        previewUrl = nodemailer.getTestMessageUrl(info) || undefined;
        deliveryStatus = "enviado_ethereal";
        console.log(`[CERTIFICADO] E-mail Ethereal gerado: ${previewUrl}`);
      } catch (etherealErr) {
        console.log("[CERTIFICADO] Modo registro ativo:", etherealErr);
        deliveryStatus = "registrado_local";
      }
    }

    const logEntry = {
      id: `cert_mail_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      email: cleanEmail,
      studentName: cleanName,
      studentClass: cleanClass,
      sentAt: new Date().toISOString(),
      institution: "Colégio Franciscano Sant’Anna",
      status: deliveryStatus,
      previewUrl,
    };

    const logs = readJsonFile<any[]>(EMAILS_FILE, []);
    logs.unshift(logEntry);
    writeJsonFile(EMAILS_FILE, logs);

    // Build mailto and gmail links for instant client opening
    const mailtoBody = encodeURIComponent(
      `🌻 CERTIFICADO DE CONCLUSÃO - SETEMBRO AMARELO\n\n` +
      `Colégio Franciscano Sant’Anna • Santa Maria - RS\n\n` +
      `Certificamos que o(a) estudante ${cleanName} (Turma ${cleanClass}) concluiu com dedicação todas as etapas da Missão Setembro Amarelo, tornando-se Guardião(ã) da Empatia e Valorização da Vida!\n\n` +
      `Mensagem do Professor Ederson Mello:\n` +
      `"Parabéns, ${cleanName}! Sua participação nesta jornada demonstrou sensibilidade, generosidade e um coração aberto ao diálogo fraterno. As suas palavras, a sua capacidade de escuta e o seu carinho com os colegas da Turma ${cleanClass} fazem do Colégio Sant’Anna um lugar mais acolhedor, humano e cheio de esperança. Nunca duvide do seu valor: você é insubstituível e tem a força de transformar o mundo ao seu redor. Continue sendo luz!"\n\n` +
      `🌻 Paz e Bem!\nCom carinho, Professor Ederson Mello — Ensino Religioso • Colégio Franciscano Sant'anna\nData: ${emissionDate}`
    );

    const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(cleanEmail)}&su=${encodeURIComponent(emailSubject)}&body=${mailtoBody}`;
    const mailtoUrl = `mailto:${encodeURIComponent(cleanEmail)}?subject=${encodeURIComponent(emailSubject)}&body=${mailtoBody}`;

    return res.json({
      success: true,
      message: `Certificado processado com sucesso para ${cleanEmail}!`,
      email: cleanEmail,
      status: deliveryStatus,
      previewUrl,
      gmailWebUrl,
      mailtoUrl,
    });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
