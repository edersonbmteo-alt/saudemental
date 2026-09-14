import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  RefreshCw,
  Send,
  Award,
  Calendar,
  Lock,
  MessageCircle,
  X,
  Smile,
  Edit3,
  Check,
  Cloud,
} from "lucide-react";
import { SharedMessage } from "../types";
import { api } from "../services/api";
import { subscribeToMuralMessages } from "../lib/firebase";
import { SantAnnaLogo } from "./SantAnnaLogo";
import { Francisquinho } from "./Francisquinho";

interface MuralViewProps {
  studentName?: string;
  studentClass?: string;
  onRestartNewStudent: () => void;
}

export const MuralView: React.FC<MuralViewProps> = ({
  studentName,
  studentClass,
  onRestartNewStudent,
}) => {
  const [messages, setMessages] = useState<SharedMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [newMsgText, setNewMsgText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  // Message editing states
  const [isEditingMyMessage, setIsEditingMyMessage] = useState(false);
  const [editMsgText, setEditMsgText] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editSuccess, setEditSuccess] = useState<string | null>(null);
  const editSectionRef = useRef<HTMLDivElement>(null);

  // Filter state: 'myClass' or 'all'
  const [filterMode, setFilterMode] = useState<"myClass" | "all">("all");

  const studentKey = studentName
    ? `${studentName.trim().toLowerCase()}_${(studentClass || "").trim().toLowerCase()}`
    : "aluno_santanna";

  // Track liked message IDs locally to immediately disable button
  const [likedIds, setLikedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(`santanna_liked_${studentKey}`);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const fetchMessages = async (silent = false) => {
    if (!silent) setRefreshing(true);
    try {
      const data = await api.getMessages();
      setMessages(data);

      // Merge with server likedBy
      setLikedIds((prev) => {
        const next = new Set(prev);
        data.forEach((m) => {
          if (m.likedBy && m.likedBy.includes(studentKey)) {
            next.add(m.id);
          }
        });
        return next;
      });
    } catch (err) {
      console.error("Error fetching mural messages:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // 1. Initial immediate load
    fetchMessages(true);

    // 2. Real-time Cloud Firestore subscription (Instant push to all computers)
    const unsubscribe = subscribeToMuralMessages(
      (liveMessages) => {
        if (liveMessages && liveMessages.length > 0) {
          setMessages(liveMessages);
          setLikedIds((prev) => {
            const next = new Set(prev);
            liveMessages.forEach((m) => {
              if (m.likedBy && m.likedBy.includes(studentKey)) {
                next.add(m.id);
              }
            });
            return next;
          });
        }
        setLoading(false);
        setRefreshing(false);
      },
      (err) => {
        console.warn("[MuralView] Live Firestore fallback note:", err);
      }
    );

    // Fallback light interval (15s) in case socket momentarily pauses
    const interval = setInterval(() => {
      fetchMessages(true);
    }, 15000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [studentKey]);

  // Find the student's unique message on the mural
  const myMessage = messages.find(
    (m) =>
      Boolean(studentName) &&
      (m.author || "").trim().toLowerCase() === (studentName || "").trim().toLowerCase() &&
      (m.studentClass || "").trim().toLowerCase() === (studentClass || "").trim().toLowerCase()
  ) || messages.find(
    (m) =>
      Boolean(studentName) &&
      (m.author || "").trim().toLowerCase() === (studentName || "").trim().toLowerCase()
  );

  const handleLike = async (id: string) => {
    // Verificar se é a própria mensagem do aluno
    const targetMsg = messages.find((m) => m.id === id);
    if (targetMsg) {
      const isOwn =
        (myMessage && targetMsg.id === myMessage.id) ||
        (Boolean(studentName) &&
          (targetMsg.author || "").trim().toLowerCase() === (studentName || "").trim().toLowerCase());
      if (isOwn) {
        return;
      }
    }

    if (likedIds.has(id)) return;

    // Record like locally so button is instantly disabled
    const nextLiked = new Set(likedIds);
    nextLiked.add(id);
    setLikedIds(nextLiked);

    try {
      localStorage.setItem(
        `santanna_liked_${studentKey}`,
        JSON.stringify(Array.from(nextLiked))
      );
    } catch (e) {
      console.warn("Could not save like to localStorage:", e);
    }

    // Optimistic update
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, likes: (m.likes || 0) + 1 } : m))
    );

    const result = await api.likeMessage(id, studentName, studentClass);
    if (result && result.likes !== undefined) {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, likes: result.likes } : m))
      );
    }
  };

  // Only used if student did not create a message in Step 8
  const handleSendInitialMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsgText.trim() || newMsgText.trim().length < 5) return;

    setIsSending(true);
    const authorName = studentName?.trim() || "Estudante Sant'Anna";
    const added = await api.postMessage(newMsgText.trim(), authorName, studentClass);
    if (added) {
      setMessages((prev) => [added, ...prev.filter((m) => m.id !== added.id)]);
      setNewMsgText("");
    }
    setIsSending(false);
  };

  // Editing student's own message
  const handleStartEdit = () => {
    if (myMessage) {
      setEditMsgText(myMessage.message);
      setIsEditingMyMessage(true);
      if (editSectionRef.current) {
        editSectionRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const handleSaveEditedMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myMessage || !editMsgText.trim() || editMsgText.trim().length < 5) return;

    setIsSavingEdit(true);
    try {
      const res = await api.updateMessage(myMessage.id, {
        message: editMsgText.trim(),
        author: studentName || "Estudante Sant'Anna",
        studentClass: studentClass || "",
      });

      if (res.success && res.message) {
        setMessages((prev) =>
          prev.map((m) => (m.id === myMessage.id ? res.message! : m))
        );
        setIsEditingMyMessage(false);
        setEditSuccess("Sua mensagem foi atualizada no Mural da Esperança com sucesso!");
        setTimeout(() => setEditSuccess(null), 4000);
      } else {
        alert(res.error || "Não foi possível atualizar a mensagem.");
      }
    } catch {
      alert("Erro ao salvar alterações da mensagem.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleInsertEmojiIntoEdit = (emoji: string) => {
    setEditMsgText((prev) => prev + emoji);
  };

  const handleInsertEmoji = (emoji: string) => {
    setNewMsgText((prev) => prev + emoji);
  };

  // Displayed messages based on filterMode:
  const displayedMessages =
    filterMode === "myClass" && studentClass
      ? messages.filter(
          (m) =>
            m.studentClass &&
            m.studentClass.trim().toLowerCase() === studentClass.trim().toLowerCase()
        )
      : messages;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-10 shadow-xl shadow-slate-200/40 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="shrink-0 hidden sm:block">
              <Francisquinho className="w-20 h-auto" pose="waving" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold tracking-wide uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>
                    {studentClass
                      ? `Mural Fraterno • Turma ${studentClass}`
                      : "Espaço Coletivo de Acolhimento"}
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <Cloud className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Online na Nuvem</span>
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit'] flex items-center gap-3">
                <span>🌻</span>
                <span>Mural da Esperança</span>
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
                Mensagens de afeto, luz e acolhimento compartilhadas pelos estudantes no Colégio Franciscano Sant’Anna. Cada palavra aqui nos recorda que ninguém caminha sozinho!
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {studentName && (
              <button
                type="button"
                id="btn-ver-certificado"
                onClick={() => setShowCertificateModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
              >
                <Award className="w-4 h-4 text-slate-900" />
                <span>Ver Meu Certificado</span>
              </button>
            )}

            <button
              type="button"
              id="btn-atualizar-mural"
              onClick={() => fetchMessages()}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold border border-slate-200 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-[#005CA9] ${refreshing ? "animate-spin" : ""}`} />
              <span>{refreshing ? "Atualizando..." : "Atualizar Mural"}</span>
            </button>
          </div>
        </div>

        {/* Tab Filters: Todas as Turmas vs Minha Turma */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFilterMode("all")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                filterMode === "all"
                  ? "bg-[#005CA9] text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              🌻 Todas as Mensagens ({messages.length})
            </button>
            {studentClass && (
              <button
                type="button"
                onClick={() => setFilterMode("myClass")}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  filterMode === "myClass"
                    ? "bg-[#005CA9] text-white shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                🏫 Minha Turma ({studentClass})
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Envie 1 girassol de apoio para as mensagens dos seus colegas</span>
          </div>
        </div>
      </div>

      {/* Student's Own Message Section / Single Post Only */}
      <div
        ref={editSectionRef}
        id="section-minha-mensagem"
        className="mb-8"
      >
        {myMessage ? (
          <div className="p-5 sm:p-6 rounded-2xl bg-amber-50/70 border-2 border-amber-300/80 shadow-sm transition-all">
            {editSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{editSuccess}</span>
              </div>
            )}

            {isEditingMyMessage ? (
              <form onSubmit={handleSaveEditedMessage} className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-950 uppercase tracking-wider">
                    <Edit3 className="w-4 h-4 text-amber-700" />
                    <span>Editando Sua Mensagem no Mural</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditingMyMessage(false)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>

                <textarea
                  rows={3}
                  value={editMsgText}
                  onChange={(e) => setEditMsgText(e.target.value)}
                  placeholder="Escreva sua mensagem de carinho, apoio fraterno ou esperança..."
                  className="w-full px-4 py-3 rounded-xl bg-white border border-amber-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-2xs resize-none"
                />

                {/* Quick Emojis Palette */}
                <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-amber-200/70">
                  <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1 mr-1">
                    <Smile className="w-3.5 h-3.5 text-amber-600" />
                    <span>Inserir emojis:</span>
                  </span>
                  {["🌻", "💛", "✨", "🌟", "😊", "🤗", "🕊️", "☀️", "🤝", "💪", "🌈", "💖", "🙏", "💐", "🎉"].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleInsertEmojiIntoEdit(emoji)}
                      className="w-8 h-8 flex items-center justify-center rounded-xl bg-white hover:bg-amber-100 border border-amber-200 text-base transition-transform active:scale-125 cursor-pointer shadow-2xs"
                      title={`Inserir emoji ${emoji}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingMyMessage(false)}
                    disabled={isSavingEdit}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingEdit || editMsgText.trim().length < 5}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#005CA9] hover:bg-[#004b8a] text-white font-bold text-xs sm:text-sm tracking-wide shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isSavingEdit ? "Salvando..." : "Salvar Alterações"}</span>
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-950 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Sua Mensagem no Mural da Esperança</span>
                    {studentClass && (
                      <span className="text-amber-800 font-mono text-[11px] font-semibold">
                        (Turma {studentClass})
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    id="btn-editar-minha-mensagem"
                    onClick={handleStartEdit}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold shadow-2xs transition-all cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-700" />
                    <span>Editar Minha Mensagem</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-white border border-amber-200/90 shadow-2xs">
                  <p className="text-sm sm:text-base text-slate-800 italic font-medium leading-relaxed">
                    “{myMessage.message}”
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between flex-wrap gap-2 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1 font-semibold text-amber-800 bg-amber-100/70 px-2.5 py-1 rounded-full border border-amber-200">
                    🌻 {myMessage.likes || 0} curtida(s) da turma
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    {myMessage.editedAt ? "Editado recentemente • " : "Publicado • "}
                    Cada estudante publica uma mensagem única e pode editá-la quando desejar.
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Student did not write message in Step 8: allow publishing exactly one */
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <form onSubmit={handleSendInitialMessage}>
              <label
                htmlFor="input-extra-message"
                className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#005CA9]" />
                <span>
                  Deixe sua mensagem de esperança para a {studentClass ? `Turma ${studentClass}` : "turma"}:
                </span>
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  id="input-extra-message"
                  type="text"
                  value={newMsgText}
                  onChange={(e) => setNewMsgText(e.target.value)}
                  placeholder="Escreva uma palavra de carinho, apoio fraterno ou esperança..."
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 focus:bg-white transition-all shadow-2xs"
                />
                <button
                  type="submit"
                  disabled={isSending || newMsgText.trim().length < 5}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#005CA9] hover:bg-[#004b8a] text-white font-bold text-sm tracking-wide shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSending ? "Enviando..." : "Publicar no Mural"}</span>
                </button>
              </div>

              {/* Quick Emojis Palette */}
              <div className="flex items-center gap-1.5 flex-wrap mt-3 pt-3 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 mr-1">
                  <Smile className="w-3.5 h-3.5 text-amber-600" />
                  <span>Adicionar emojis:</span>
                </span>
                {["🌻", "💛", "✨", "🌟", "😊", "🤗", "🕊️", "☀️", "🤝", "💪", "🌈", "💖", "🙏", "💐", "🎉"].map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => handleInsertEmoji(emoji)}
                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-amber-100 border border-slate-200 hover:border-amber-300 text-base transition-transform active:scale-125 cursor-pointer shadow-2xs"
                    title={`Inserir emoji ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Messages Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-500 flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
          <span className="font-medium">Carregando mensagens da turma...</span>
        </div>
      ) : displayedMessages.length === 0 ? (
        <div className="py-16 text-center text-slate-500 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <span className="text-4xl mb-2 block">🌻</span>
          <p className="text-base font-bold text-slate-800">
            {filterMode === "myClass" && studentClass
              ? `Nenhuma mensagem da Turma ${studentClass} encontrada.`
              : "Nenhuma mensagem no mural ainda."}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Seja o primeiro a deixar uma palavra de carinho e esperança para seus colegas!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedMessages.map((msg, index) => {
            const hasLiked =
              likedIds.has(msg.id) ||
              (Boolean(msg.likedBy) && msg.likedBy!.includes(studentKey));

            const isMyPost =
              (myMessage && msg.id === myMessage.id) ||
              (Boolean(studentName) &&
                (msg.author || "").trim().toLowerCase() === (studentName || "").trim().toLowerCase());

            return (
              <div
                key={msg.id || index}
                className={`group relative flex flex-col justify-between p-6 rounded-2xl bg-white transition-all duration-300 shadow-sm ${
                  isMyPost
                    ? "border-2 border-amber-400 bg-amber-50/20 shadow-md ring-2 ring-amber-400/20"
                    : "border border-slate-200/90 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/5"
                }`}
              >
                {/* Top card adornment with author and class */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                      isMyPost
                        ? "bg-amber-200/80 text-amber-950 border-amber-300"
                        : "bg-amber-50 text-amber-900 border border-amber-200"
                    }`}
                  >
                    <span>{isMyPost ? "⭐" : "🌻"}</span>
                    <span className="truncate max-w-[150px]">
                      {isMyPost ? `${msg.author || "Você"} (Você)` : msg.author || "Estudante Sant’Anna"}
                    </span>
                    {msg.studentClass && (
                      <span className="text-amber-700 font-semibold font-mono text-[10px]">
                        • T. {msg.studentClass}
                      </span>
                    )}
                  </span>

                  <div className="flex items-center gap-2">
                    {isMyPost && (
                      <button
                        type="button"
                        onClick={handleStartEdit}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#005CA9] hover:underline cursor-pointer"
                        title="Editar sua mensagem"
                      >
                        <Edit3 className="w-3 h-3 text-[#005CA9]" />
                        <span>Editar</span>
                      </button>
                    )}
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono font-medium shrink-0">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {msg.timestamp
                        ? new Date(msg.timestamp).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </span>
                  </div>
                </div>

                {/* Message text */}
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium mb-6 italic">
                  “{msg.message}”
                </p>

                {/* Bottom Card Footer: Sunflower Like (1 like per student, cannot like own post) */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-xs text-slate-500 font-semibold">Valorização da Vida</span>
                  {isMyPost ? (
                    <div
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50/80 border border-amber-200/80 text-xs font-semibold text-amber-900 shadow-2xs select-none"
                      title="Esta é a sua mensagem. Você pode curtir as mensagens dos seus colegas!"
                    >
                      <span className="text-sm">🌻</span>
                      <span className="font-bold">{msg.likes || 0}</span>
                      <span className="text-[10px] text-amber-800 bg-amber-200/60 px-1.5 py-0.5 rounded font-medium">
                        Sua publicação
                      </span>
                    </div>
                  ) : hasLiked ? (
                    <button
                      type="button"
                      disabled
                      className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-xs font-bold text-amber-900 shadow-2xs cursor-default"
                      title="Você já curtiu esta mensagem com um girassol!"
                    >
                      <span className="text-sm">🌻</span>
                      <span>{msg.likes || 0}</span>
                      <span className="text-[10px] bg-amber-200/90 text-amber-950 px-1.5 py-0.5 rounded font-semibold ml-0.5">
                        Curtido
                      </span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleLike(msg.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-xs font-bold text-slate-700 hover:text-amber-900 transition-all cursor-pointer group-hover:scale-105 shadow-2xs"
                      title="Enviar um girassol de apoio (1 por aluno)"
                    >
                      <span className="text-sm">🌻</span>
                      <span>{msg.likes || 0}</span>
                      <span className="text-[10px] text-amber-700 font-semibold hidden sm:inline">
                        Curtir
                      </span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Restart Mission for new student */}
      <div className="mt-12 text-center pt-8 border-t border-slate-200">
        <button
          type="button"
          onClick={onRestartNewStudent}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold border border-slate-300 transition-all cursor-pointer"
        >
          <span>Reiniciar Missão com outro estudante</span>
        </button>
      </div>

      {/* Certificate Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl bg-white border-2 border-amber-400 p-6 sm:p-8 shadow-2xl text-center my-8">
            <button
              type="button"
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* School Logo - reduced size so all of it is clearly and harmoniously visible */}
            <div className="flex justify-center mb-2.5">
              <SantAnnaLogo className="h-8 sm:h-9 w-auto" />
            </div>

            <div className="text-[11px] font-bold text-amber-700 uppercase tracking-widest mb-1">
              Colégio Franciscano Sant’Anna • Santa Maria – RS
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
              Certificado de Conclusão
            </h3>
            <p className="text-xs text-amber-900 font-bold uppercase tracking-wider mt-0.5">
              Guardião da Empatia & Valorização da Vida 🌻
            </p>

            <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Certificamos com imensa alegria e reconhecimento que o(a) estudante:
            </p>

            {/* Student Name & Class Highlight */}
            <div className="my-3.5 p-3 sm:p-4 rounded-2xl bg-amber-50/80 border border-amber-200">
              <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {studentName}
              </div>
              <div className="text-xs text-amber-800 font-bold mt-1">
                Turma {studentClass} • Missão Setembro Amarelo
              </div>
            </div>

            {/* Special Personalized Message with Student Name - Centered */}
            <div className="my-3.5 p-5 rounded-2xl bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border border-amber-300 text-center shadow-2xs">
              <div className="flex items-center justify-center gap-2 mb-2 text-amber-900 font-extrabold text-xs uppercase tracking-wider text-center">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Mensagem Especial para Você, {studentName}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium text-center max-w-xl mx-auto">
                “Parabéns, <strong>{studentName}</strong>! Sua participação nesta jornada demonstrou sensibilidade, generosidade e um coração aberto ao diálogo fraterno. As suas palavras, a sua capacidade de escuta e o seu carinho com os colegas da <strong>Turma {studentClass}</strong> fazem do Colégio Sant’Anna um lugar mais acolhedor, humano e cheio de esperança. Nunca duvide do seu valor: você é insubstituível e tem a força de transformar o mundo ao seu redor. Continue sendo luz!”
              </p>
              <div className="mt-3 flex flex-col items-center justify-center gap-1 text-[11px] font-bold text-amber-900 text-center">
                <span>🌻 Paz e Bem!</span>
                <span>Com carinho, Professor Ederson Braga Mello — Ensino Religioso • Colégio Franciscano Sant'anna</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed text-center max-w-md mx-auto">
              Concluiu com dedicação todas as 8 etapas pedagógicas, demonstrando atitudes de acolhimento, respeito mútuo e compromisso permanente com a valorização da vida.
            </p>

            {/* Signatures & Footer - Centered */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex flex-col items-center justify-center gap-1 text-[11px] text-slate-600 font-medium text-center">
              <div>
                Com carinho, <strong className="text-slate-900">Professor Ederson Braga Mello</strong> — Ensino Religioso • Colégio Franciscano Sant'anna
              </div>
              <div>
                Data de Conclusão: <strong className="text-slate-800">{new Date().toLocaleDateString("pt-BR")}</strong>
              </div>
            </div>

            {/* Modal Actions: Close */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center">
              <button
                type="button"
                onClick={() => setShowCertificateModal(false)}
                className="px-8 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs sm:text-sm font-bold cursor-pointer transition-colors shadow-xs"
              >
                Fechar Janela
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
