import React, { useState, useEffect } from "react";
import {
  X,
  Lock,
  Download,
  Search,
  Filter,
  CheckCircle2,
  FileSpreadsheet,
  Trash2,
  RefreshCw,
  Info,
  MessageCircle,
  Calendar,
  User,
  Hash,
} from "lucide-react";
import { StudentDataRecord, SharedMessage } from "../types";
import { api } from "../services/api";
import { SantAnnaLogo } from "./SantAnnaLogo";

interface TeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeacherModal: React.FC<TeacherModalProps> = ({ isOpen, onClose }) => {
  const [token, setToken] = useState<string | null>(
    sessionStorage.getItem("teacher_token")
  );
  const [loggedTeacherName, setLoggedTeacherName] = useState<string>(
    sessionStorage.getItem("teacher_name") || "Professor(a)"
  );
  const [code, setCode] = useState("");
  const [teacherNameInput, setTeacherNameInput] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [students, setStudents] = useState<StudentDataRecord[]>([]);
  const [muralMessages, setMuralMessages] = useState<SharedMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMural, setLoadingMural] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("TODAS");
  const [muralSearchQuery, setMuralSearchQuery] = useState("");
  const [muralSelectedClass, setMuralSelectedClass] = useState("TODAS");
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null);
  const [confirmingDeleteMsgId, setConfirmingDeleteMsgId] = useState<string | null>(null);
  const [muralFeedback, setMuralFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"students" | "mural" | "instructions">("students");
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<StudentDataRecord | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoading(true);

    try {
      const res = await api.teacherLogin(code, password, teacherNameInput);
      if (res.success && res.token) {
        setToken(res.token);
        const nameToSave = res.teacherName || teacherNameInput.trim() || "Professor(a)";
        setLoggedTeacherName(nameToSave);
        sessionStorage.setItem("teacher_token", res.token);
        sessionStorage.setItem("teacher_name", nameToSave);
        loadStudents(res.token);
        loadMuralMessages();
      } else {
        setLoginError(res.error || "Código ou senha incorretos.");
      }
    } catch {
      setLoginError("Falha na comunicação com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async (authToken: string) => {
    setLoading(true);
    try {
      const data = await api.getTeacherStudents(authToken);
      setStudents(data);
    } catch {
      setToken(null);
      sessionStorage.removeItem("teacher_token");
      sessionStorage.removeItem("teacher_name");
    } finally {
      setLoading(false);
    }
  };

  const loadMuralMessages = async () => {
    setLoadingMural(true);
    try {
      const msgs = await api.getMessages();
      setMuralMessages(msgs);
    } catch (err) {
      console.error("Error loading mural messages:", err);
    } finally {
      setLoadingMural(false);
    }
  };

  useEffect(() => {
    if (isOpen && token) {
      loadStudents(token);
      loadMuralMessages();
    }
  }, [isOpen, token]);

  const handleLogout = () => {
    setToken(null);
    sessionStorage.removeItem("teacher_token");
    sessionStorage.removeItem("teacher_name");
  };

  const handleExportCsv = () => {
    if (!token) return;
    window.location.href = `/api/teacher/export-csv?token=${encodeURIComponent(token)}`;
  };

  const handleClearData = async () => {
    if (!token) return;
    const confirm = window.confirm(
      "Atenção pedagógica: Deseja realmente zerar as respostas dos estudantes? Esta operação não poderá ser revertida."
    );
    if (!confirm) return;

    try {
      await api.clearTeacherData(token);
      setStudents([]);
    } catch {
      alert("Erro ao limpar dados.");
    }
  };

  const executeDeleteMessage = async (id: string, authorName: string) => {
    if (!token) return;
    setDeletingMessageId(id);
    setMuralFeedback(null);

    try {
      const res = await api.deleteMuralMessage(id, token);
      if (res.success) {
        setMuralMessages((prev) => prev.filter((m) => String(m.id).trim() !== String(id).trim()));
        setMuralFeedback({
          type: "success",
          text: `Publicação de "${authorName || "Estudante"}" excluída com sucesso do Mural!`,
        });
      } else {
        setMuralFeedback({
          type: "error",
          text: res.error || "Não foi possível excluir a mensagem no momento.",
        });
      }
    } catch {
      setMuralFeedback({
        type: "error",
        text: "Erro de comunicação com o servidor ao excluir mensagem.",
      });
    } finally {
      setDeletingMessageId(null);
      setConfirmingDeleteMsgId(null);
    }
  };

  if (!isOpen) return null;

  const classesList = Array.from(new Set(students.map((s) => s.studentClass))).filter(Boolean);
  const filteredStudents = students.filter((s) => {
    const matchSearch =
      s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentClass.toLowerCase().includes(searchQuery.toLowerCase());
    const matchClass = selectedClass === "TODAS" || s.studentClass === selectedClass;
    return matchSearch && matchClass;
  });

  const muralClassesList = Array.from(
    new Set(muralMessages.map((m) => m.studentClass).filter(Boolean))
  ) as string[];

  const filteredMuralMessages = muralMessages.filter((m) => {
    const matchSearch =
      (m.author || "").toLowerCase().includes(muralSearchQuery.toLowerCase()) ||
      (m.message || "").toLowerCase().includes(muralSearchQuery.toLowerCase()) ||
      (m.studentClass || "").toLowerCase().includes(muralSearchQuery.toLowerCase());
    const matchClass =
      muralSelectedClass === "TODAS" ||
      (m.studentClass && m.studentClass.toLowerCase() === muralSelectedClass.toLowerCase());
    return matchSearch && matchClass;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <SantAnnaLogo className="h-7 w-auto" />
            <div className="h-6 w-px bg-slate-200 mx-0.5" />
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2 font-['Outfit']">
                Painel Pedagógico do Professor
                {token && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-50 text-[#005CA9] border border-sky-100 font-semibold">
                    {loggedTeacherName}
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Colégio Franciscano Sant’Anna • Santa Maria – RS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {token && (
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs text-slate-500 hover:text-rose-600 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-rose-200 transition-colors font-semibold cursor-pointer"
              >
                Encerrar Sessão
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        {!token ? (
          /* Login Form */
          <div className="p-8 max-w-md mx-auto my-auto w-full">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mx-auto mb-3 shadow-2xs">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 font-['Outfit']">
                Acesso à Área do Professor
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Insira o código do colégio, seu nome e a senha institucional para acessar seu painel pedagógico.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-[#005CA9]" />
                  <span>Código do Professor / Colégio</span>
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Informe qualquer número (ex: 2026, 12345)"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 focus:bg-white transition-all shadow-2xs"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Código numérico institucional do colégio ou matrícula docente.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#005CA9]" />
                  <span>Nome do Professor(a)</span>
                </label>
                <input
                  type="text"
                  value={teacherNameInput}
                  onChange={(e) => setTeacherNameInput(e.target.value)}
                  placeholder="Ex: Prof. Ederson Mello, Profa. Ana..."
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 focus:bg-white transition-all shadow-2xs"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Define sua área exclusiva de acompanhamento com seu nome identificado.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Senha Institucional</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite a senha institucional"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 focus:bg-white transition-all shadow-2xs"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  A senha definida para acesso é <strong>Santanna@26</strong>.
                </span>
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-sm tracking-wide shadow-md shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? "Autenticando..." : "ACESSAR ÁREA DO PROFESSOR"}
              </button>
            </form>
          </div>
        ) : (
          /* Teacher Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden p-6">
            {/* Top Stats & Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold mr-1">
                  <User className="w-3.5 h-3.5 text-amber-700" />
                  <span>Área: {loggedTeacherName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("students")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "students"
                      ? "bg-[#005CA9] text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Respostas dos Estudantes ({students.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("mural");
                    loadMuralMessages();
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === "mural"
                      ? "bg-amber-500 text-slate-950 shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <span>🌻 Moderar Mural ({muralMessages.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("instructions")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "instructions"
                      ? "bg-[#005CA9] text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Rede & Arquitetura
                </button>
              </div>

              {activeTab === "mural" && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={loadMuralMessages}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs flex items-center gap-1.5 border border-slate-200 cursor-pointer"
                    title="Atualizar mensagens do mural"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingMural ? "animate-spin text-amber-600" : ""}`} />
                    <span className="text-xs font-semibold">Atualizar Mural</span>
                  </button>
                </div>
              )}

              {activeTab === "students" && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => token && loadStudents(token)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs flex items-center gap-1.5 border border-slate-200 cursor-pointer"
                    title="Atualizar dados"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#005CA9]" : ""}`} />
                  </button>

                  <button
                    type="button"
                    id="btn-exportar-csv"
                    onClick={handleExportCsv}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>EXPORTAR CSV</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClearData}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 text-xs border border-slate-200 hover:border-rose-200 cursor-pointer"
                    title="Limpar todos os dados"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {activeTab === "students" ? (
              <>
                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Pesquisar por nome ou turma..."
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 focus:bg-white shadow-2xs"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-2xs font-semibold"
                    >
                      <option value="TODAS">Todas as Turmas</option>
                      {classesList.map((c) => (
                        <option key={c} value={c}>
                          Turma {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-x-auto overflow-y-auto border border-slate-200 rounded-2xl bg-white shadow-2xs">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="sticky top-0 bg-slate-50 text-slate-600 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200 z-10">
                      <tr>
                        <th className="py-3 px-4">Estudante</th>
                        <th className="py-3 px-3">Turma</th>
                        <th className="py-3 px-3">Quiz</th>
                        <th className="py-3 px-3">Palavras</th>
                        <th className="py-3 px-3">Cruzadinha</th>
                        <th className="py-3 px-3">Qualidades</th>
                        <th className="py-3 px-3">Reflexão</th>
                        <th className="py-3 px-3">Mensagem</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredStudents.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="py-12 text-center text-slate-400 font-medium">
                            Nenhum registro encontrado para este filtro.
                          </td>
                        </tr>
                      ) : (
                        filteredStudents.map((s) => (
                          <tr
                            key={s.id}
                            onClick={() => setSelectedStudentDetail(s)}
                            className="hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                              {s.studentName}
                            </td>
                            <td className="py-3 px-3 font-semibold text-[#005CA9] whitespace-nowrap">
                              {s.studentClass}
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap">
                              <span className="px-2 py-0.5 rounded-lg bg-sky-50 border border-sky-100 text-[#005CA9] font-medium">
                                {s.quizScore || "Pendente"}
                              </span>
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap font-medium">
                              {s.wordSearchFound?.length || 0} palavras
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap font-medium">
                              {s.crosswordResult || "Pendente"}
                            </td>
                            <td className="py-3 px-3 max-w-[150px] truncate" title={s.qualitiesSelected?.join(", ")}>
                              {s.qualitiesSelected?.length
                                ? `${s.qualitiesSelected.length} selecionadas`
                                : "-"}
                            </td>
                            <td className="py-3 px-3 max-w-[180px] truncate text-slate-600" title={s.wordsGoodReflection}>
                              {s.wordsGoodReflection || "-"}
                            </td>
                            <td className="py-3 px-3 max-w-[180px] truncate italic text-slate-600" title={s.finalMessage}>
                              {s.finalMessage ? `“${s.finalMessage}”` : "-"}
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              {s.completed ? (
                                <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 font-bold text-[11px]">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  Concluído
                                </span>
                              ) : (
                                <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 font-bold text-[11px]">
                                  Etapa {s.currentStep}/8
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="mt-2 text-[11px] text-slate-500 text-right font-medium">
                  Clique sobre qualquer linha para abrir a ficha completa do estudante.
                </div>
              </>
            ) : (
              /* Network & Database Instructions tab */
              <div className="flex-1 overflow-y-auto space-y-6 text-sm text-slate-600 pr-2 leading-relaxed">
                <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950">
                  <h4 className="font-bold text-base text-slate-900 flex items-center gap-2 mb-2">
                    <Info className="w-5 h-5 text-amber-700" />
                    Funcionamento em Rede no Laboratório de Informática
                  </h4>
                  <p>
                    A aplicação está estruturada com backend full-stack Node.js / Express. Todos os computadores do laboratório que abrem o endereço compartilham o mesmo servidor centralizado.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <h5 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-sky-100 text-[#005CA9] flex items-center justify-center text-xs font-bold">
                        1
                      </span>
                      Armazenamento e Sincronismo Contínuo
                    </h5>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      As respostas de cada aluno e as mensagens anônimas do mural são salvas de forma segura no disco do servidor em arquivos JSON. Isso garante sincronização instantânea entre as máquinas dos estudantes.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <h5 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">
                        2
                      </span>
                      Exportação Pronta para Excel / Planilhas
                    </h5>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      O botão <strong>EXPORTAR CSV</strong> gera uma tabela completa com marca de ordem de bytes (UTF-8 BOM), preservando a acentuação e pontuação corretas no Microsoft Excel e Google Planilhas.
                    </p>
                  </div>
                </div>

                {/* Package ZIP Download */}
                <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <span>📦</span>
                      Pacote Completo do Projeto (.ZIP)
                    </h5>
                    <p className="text-xs text-slate-600 mt-1">
                      Faça o download do código-fonte completo, componentes e recursos visuais para backup institucional ou implantação local.
                    </p>
                  </div>
                  <a
                    href="/missao_setembro_amarelo_santanna.zip"
                    download="missao_setembro_amarelo_santanna.zip"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#005CA9] hover:bg-[#004b8a] text-white font-bold text-xs tracking-wide shadow-xs transition-all whitespace-nowrap cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>BAIXAR PACOTE .ZIP</span>
                  </a>
                </div>
              </div>
            )}

            {/* Moderar Mural Tab */}
            {activeTab === "mural" && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Search & Class Filter */}
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={muralSearchQuery}
                      onChange={(e) => setMuralSearchQuery(e.target.value)}
                      placeholder="Pesquisar publicações por autor, texto ou turma..."
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 focus:bg-white shadow-2xs"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <select
                      value={muralSelectedClass}
                      onChange={(e) => setMuralSelectedClass(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-2xs font-semibold"
                    >
                      <option value="TODAS">Todas as Turmas ({muralMessages.length})</option>
                      {muralClassesList.map((c) => (
                        <option key={c} value={c}>
                          Turma {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Feedback banner */}
                {muralFeedback && (
                  <div
                    className={`p-3 rounded-xl mb-3 flex items-center justify-between text-xs font-semibold ${
                      muralFeedback.type === "success"
                        ? "bg-emerald-50 text-emerald-900 border border-emerald-300"
                        : "bg-rose-50 text-rose-900 border border-rose-300"
                    }`}
                  >
                    <span>{muralFeedback.text}</span>
                    <button
                      type="button"
                      onClick={() => setMuralFeedback(null)}
                      className="text-xs font-bold underline cursor-pointer ml-2 opacity-70 hover:opacity-100"
                    >
                      Fechar
                    </button>
                  </div>
                )}

                {/* Mural Messages List with Excluir action */}
                <div className="flex-1 overflow-y-auto pr-1">
                  {loadingMural ? (
                    <div className="py-16 text-center text-slate-500 flex flex-col items-center gap-3">
                      <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
                      <span className="font-medium text-xs">Carregando mensagens do mural...</span>
                    </div>
                  ) : filteredMuralMessages.length === 0 ? (
                    <div className="py-16 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-200 p-8">
                      <span className="text-3xl mb-2 block">🌻</span>
                      <p className="text-sm font-semibold text-slate-600">Nenhuma mensagem encontrada.</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {muralSearchQuery || muralSelectedClass !== "TODAS"
                          ? "Tente alterar os termos da busca ou a turma selecionada."
                          : "Ainda não há mensagens no mural."}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                      {filteredMuralMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className="flex flex-col justify-between p-4 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 shadow-2xs transition-all"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2.5">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-slate-900 text-xs flex items-center gap-1">
                                  <span>🌻</span>
                                  <span>{msg.author || "Estudante Sant’Anna"}</span>
                                </span>
                                {msg.studentClass && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 font-mono">
                                    Turma {msg.studentClass}
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1 shrink-0">
                                <Calendar className="w-3 h-3 text-slate-400" />
                                {msg.timestamp
                                  ? new Date(msg.timestamp).toLocaleString("pt-BR", {
                                      day: "2-digit",
                                      month: "2-digit",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })
                                  : ""}
                              </span>
                            </div>

                            <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed mb-3 bg-slate-50/70 p-3 rounded-xl border border-slate-100 font-medium">
                              “{msg.message}”
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto gap-2 flex-wrap">
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                              <span>🌻</span>
                              <span>{msg.likes || 0} curtida(s)</span>
                            </span>

                            {confirmingDeleteMsgId === msg.id ? (
                              <div className="flex items-center gap-1.5 bg-rose-50 p-1.5 rounded-xl border border-rose-300">
                                <span className="text-[11px] font-bold text-rose-850">Excluir?</span>
                                <button
                                  type="button"
                                  disabled={deletingMessageId === msg.id}
                                  onClick={() => executeDeleteMessage(msg.id, msg.author || "Estudante")}
                                  className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold shadow-2xs transition-all cursor-pointer disabled:opacity-50"
                                >
                                  {deletingMessageId === msg.id ? "..." : "Sim, Excluir"}
                                </button>
                                <button
                                  type="button"
                                  disabled={deletingMessageId === msg.id}
                                  onClick={() => setConfirmingDeleteMsgId(null)}
                                  className="px-2 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-[11px] font-bold cursor-pointer"
                                >
                                  Não
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                disabled={deletingMessageId === msg.id}
                                onClick={() => setConfirmingDeleteMsgId(msg.id)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 hover:border-rose-300 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                                title="Excluir esta publicação definitivamente do mural"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                                <span>Excluir Post</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Student Detail Modal */}
        {selectedStudentDetail && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl bg-white border-2 border-amber-300 p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 font-['Outfit']">
                    {selectedStudentDetail.studentName}
                  </h3>
                  <span className="text-xs font-bold text-[#005CA9]">
                    Turma: {selectedStudentDetail.studentClass}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedStudentDetail(null)}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3.5 text-xs text-slate-700">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-[#005CA9] block mb-1">🧠 Quiz:</span>
                  <div className="font-semibold text-slate-900">{selectedStudentDetail.quizScore}</div>
                  <div className="text-slate-500 mt-1">{selectedStudentDetail.quizDetails}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-[#005CA9] block mb-1">
                    🔎 Caça-Palavras & Palavras Cruzadas:
                  </span>
                  <div>Palavras encontradas: <strong className="text-slate-900">{selectedStudentDetail.wordSearchFound?.join(", ") || "Nenhuma"}</strong></div>
                  <div className="mt-1">Cruzadinha: <strong className="text-slate-900">{selectedStudentDetail.crosswordResult}</strong></div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-[#005CA9] block mb-1">
                    💛 Reflexão sobre as Palavras:
                  </span>
                  <div className="text-slate-800 leading-relaxed font-medium">{selectedStudentDetail.wordsGoodReflection || "Não preenchido"}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-[#005CA9] block mb-1">
                    🌟 Qualidades & Virtudes:
                  </span>
                  <div>Identificadas: <strong className="text-slate-900">{selectedStudentDetail.qualitiesSelected?.join(", ") || "Nenhuma"}</strong></div>
                  <div className="mt-1">
                    <strong>Qualidade Própria:</strong> {selectedStudentDetail.qualityRecognizedOwn || "-"}
                  </div>
                  <div className="mt-1">
                    <strong>A Desenvolver:</strong> {selectedStudentDetail.qualityToDevelop || "-"}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200">
                  <span className="font-bold text-amber-900 block mb-1">
                    💌 Mensagem Enviada ao Mural Anônimo:
                  </span>
                  <div className="italic text-slate-800 font-medium leading-relaxed">
                    “{selectedStudentDetail.finalMessage || "Não preenchido"}”
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
