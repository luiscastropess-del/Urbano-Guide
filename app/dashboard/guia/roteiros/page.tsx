"use client";

import { useEffect, useState } from "react";
import { getGuideRoutes, createTourRoute } from "@/app/actions.guide.routes";
import { useToast } from "@/components/ToastProvider";
import Link from "next/link";
import { MapPin, Plus, Clock, Package, MoreVertical, Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function GuideRoutesPage() {
  const { showToast } = useToast();
  const router = useRouter();
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create Modal
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const data = await getGuideRoutes();
      setRoutes(data);
    } catch (e) {
      showToast("Erro ao buscar roteiros. Certifique-se de estar aprovado como guia.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const route = await createTourRoute({ title: newTitle });
      showToast("Roteiro criado! Agora adicione os locais.");
      router.push(`/dashboard/guia/roteiros/${route.id}`);
    } catch (e) {
      showToast("Erro ao criar roteiro.");
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto h-full overflow-y-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MapPin className="text-orange-500" /> Roteiros
          </h1>
          <p className="text-slate-500 mt-1">
            Crie sequências de locais perfeitas para seus pacotes.
          </p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition shadow-lg shadow-orange-500/20"
        >
          <Plus size={18} /> Novo Roteiro
        </button>
      </div>

      {loading ? (
         <div className="flex justify-center p-10"><Clock className="animate-spin text-orange-500" /></div>
      ) : routes.length === 0 ? (
         <div className="text-center p-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
               <MapPin size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Nenhum roteiro ainda</h3>
            <p className="text-slate-500 mb-6">Comece criando um roteiro incrível para os visitantes de Holambra.</p>
            <button onClick={() => setIsCreating(true)} className="px-6 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-black font-semibold rounded-xl">
              Criar o primeiro
            </button>
         </div>
      ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {routes.map(route => (
              <div key={route.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 hover:border-orange-500 transition-colors group relative shadow-sm">
                 <div className="flex justify-between items-start mb-3">
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md ${route.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                      {route.status === 'PUBLISHED' ? "Publicado" : "Rascunho"}
                    </span>
                    <button className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                      <MoreVertical size={18} />
                    </button>
                 </div>
                 
                 <h3 className="font-bold text-lg mb-2 truncate group-hover:text-orange-500 transition-colors">{route.title}</h3>
                 <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10">
                   {route.description || "Nenhuma descrição adicionada ainda."}
                 </p>

                 <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} className="text-orange-500" />
                      {route.places.length} Locais
                    </div>
                    <div className="flex items-center gap-1">
                      <Package size={14} className="text-sky-500" />
                      {route._count.packages} Pacotes
                    </div>
                 </div>

                 <Link href={`/dashboard/guia/roteiros/${route.id}`} className="absolute inset-0 z-10" />
                 
                 <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <span className="text-sm font-semibold text-orange-500 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Editar <Edit2 size={14} />
                    </span>
                 </div>
              </div>
           ))}
         </div>
      )}

      {/* Modal Criar Roteiro */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <form onSubmit={handleCreate} className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
             <h2 className="text-xl font-bold mb-4">Novo Roteiro</h2>
             <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Nome do Roteiro</label>
                <input 
                  autoFocus
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3"
                  placeholder="Ex: Tour Histórico Moinho + Centrinho..."
                />
             </div>
             <div className="flex gap-3">
               <button type="button" onClick={() => setIsCreating(false)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl">
                 Cancelar
               </button>
               <button type="submit" className="flex-1 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition">
                 Iniciar Criação
               </button>
             </div>
           </form>
        </div>
      )}
    </div>
  );
}
