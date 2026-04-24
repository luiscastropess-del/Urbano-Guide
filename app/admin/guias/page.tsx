"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ToastProvider";
import { getGuides, updateGuideStatus } from "@/app/actions.admin.guias";
import { 
  Users, 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ShieldAlert,
  MapPin,
  Package
} from "lucide-react";
import { format } from "date-fns";

export default function AdminGuiasPage() {
  const { showToast } = useToast();
  const [guides, setGuides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      const data = await getGuides();
      setGuides(data);
    } catch (e) {
      showToast("Erro ao buscar guias.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    if (!confirm(`Tem certeza que deseja mudar para ${status}?`)) return;
    try {
      await updateGuideStatus(id, status);
      showToast("Status atualizado com sucesso!");
      fetchGuides();
    } catch (e) {
      showToast("Erro ao atualizar status.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED": return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-bold flex items-center gap-1"><CheckCircle size={12}/> Aprovado</span>;
      case "PENDING": return <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-xs font-bold flex items-center gap-1"><Clock size={12}/> Pendente</span>;
      case "REJECTED": return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-bold flex items-center gap-1"><XCircle size={12}/> Reprovado</span>;
      case "BLOCKED": return <span className="px-2 py-1 bg-slate-200 text-slate-700 rounded-md text-xs font-bold flex items-center gap-1"><ShieldAlert size={12}/> Bloqueado</span>;
      default: return null;
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto h-full overflow-y-auto feed-scroll">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="text-orange-500" />
            Gerenciamento de Guias
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Analise cadastros, ajuste comissões e acompanhe o desempenho dos guias turísticos.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar guia por nome ou email..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Perfil</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Comissão</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cadastrado em</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {loading && <tr><td colSpan={5} className="p-8 text-center text-slate-500"><Clock className="animate-spin inline mr-2" /> Carregando...</td></tr>}
              {!loading && guides.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-slate-500">Nenhum guia encontrado.</td></tr>}
              {!loading && guides.map(guide => (
                <tr key={guide.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center font-bold">
                        {guide.user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{guide.user.name}</div>
                        <div className="text-xs text-slate-500 flex gap-2 items-center mt-1">
                          {guide.user.email}
                          <span className="flex items-center gap-1 text-sky-500"><MapPin size={10}/> {guide._count.routes}</span>
                          <span className="flex items-center gap-1 text-emerald-500"><Package size={10}/> {guide._count.packages}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    {getStatusBadge(guide.status)}
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-medium">{(guide.commissionRate * 100)}%</span>
                  </td>
                  <td className="p-4 text-sm text-slate-500">
                    {format(new Date(guide.createdAt), "dd/MM/yyyy")}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       {guide.status !== "APPROVED" && (
                         <button 
                            onClick={() => handleUpdateStatus(guide.id, "APPROVED")}
                            className="px-3 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg text-xs font-bold transition"
                          >
                           Aprovar
                         </button>
                       )}
                       {guide.status === "PENDING" && (
                         <button 
                            onClick={() => handleUpdateStatus(guide.id, "REJECTED")}
                            className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-xs font-bold transition"
                          >
                           Reprovar
                         </button>
                       )}
                       {guide.status === "APPROVED" && (
                         <button 
                            onClick={() => handleUpdateStatus(guide.id, "BLOCKED")}
                            className="px-3 py-1 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-lg text-xs font-bold transition"
                          >
                           Bloquear
                         </button>
                       )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
