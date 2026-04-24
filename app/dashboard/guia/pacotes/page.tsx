"use client";

import { useEffect, useState } from "react";
import { getGuidePackages, createTourPackage } from "@/app/actions.guide.packages";
import { useToast } from "@/components/ToastProvider";
import Link from "next/link";
import { Wallet, Plus, Clock, MoreVertical, Edit2, Package } from "lucide-react";
import { useRouter } from "next/navigation";

export default function GuidePackagesPage() {
  const { showToast } = useToast();
  const router = useRouter();
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState("");

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const data = await getGuidePackages();
      setPackages(data);
    } catch (e) {
      showToast("Erro ao buscar pacotes.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return;
    
    try {
      const pkg = await createTourPackage({ title: newTitle, price: parseFloat(newPrice) });
      showToast("Pacote criado! Agora adicione os detalhes e roteiros.");
      // router.push(`/dashboard/guia/pacotes/${pkg.id}`);
      setIsCreating(false);
      setNewTitle("");
      setNewPrice("");
      fetchPackages();
    } catch (e) {
      showToast("Erro ao criar pacote.");
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto h-full overflow-y-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Wallet className="text-orange-500" /> Pacotes
          </h1>
          <p className="text-slate-500 mt-1">
            Reúna seus roteiros e venda pacotes fechados.
          </p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition shadow-lg shadow-orange-500/20"
        >
          <Plus size={18} /> Novo Pacote
        </button>
      </div>

      {loading ? (
         <div className="flex justify-center p-10"><Clock className="animate-spin text-orange-500" /></div>
      ) : packages.length === 0 ? (
         <div className="text-center p-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
               <Package size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Nenhum pacote ainda</h3>
            <p className="text-slate-500 mb-6">Crie pacotes contendo seus roteiros para oferecer aos clientes.</p>
            <button onClick={() => setIsCreating(true)} className="px-6 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-black font-semibold rounded-xl">
              Criar o primeiro
            </button>
         </div>
      ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {packages.map(pkg => (
              <div key={pkg.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:border-orange-500 transition-colors group relative">
                 <div className="flex justify-between items-start mb-3">
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md ${pkg.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                      {pkg.status === 'PUBLISHED' ? "Publicado" : "Rascunho"}
                    </span>
                 </div>
                 
                 <h3 className="font-bold text-lg mb-1 truncate group-hover:text-orange-500 transition-colors">{pkg.title}</h3>
                 <p className="text-xl font-black text-slate-800 dark:text-white mb-4">R$ {pkg.price.toFixed(2)}</p>

                 <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl mb-4">
                    <div className="flex items-center gap-1">
                      <Wallet size={14} className="text-orange-500" />
                      {pkg.routes?.length || 0} Roteiros
                    </div>
                    <div className="flex items-center gap-1">
                      {pkg._count?.reservations || 0} Reservas
                    </div>
                 </div>
                 
                 <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <button onClick={() => showToast('Funcionalidade em desenvolvimento!')} className="text-sm font-semibold text-orange-500 flex items-center gap-1 group-hover:translate-x-1 transition-transform relative z-10">
                      Editar Detalhes <Edit2 size={14} />
                    </button>
                 </div>
              </div>
           ))}
         </div>
      )}

      {isCreating && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <form onSubmit={handleCreate} className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
             <h2 className="text-xl font-bold mb-4">Novo Pacote</h2>
             <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Nome do Pacote</label>
                <input 
                  autoFocus
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3"
                  placeholder="Ex: Fim de Semana Floral"
                />
             </div>
             <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Preço (R$)</label>
                <input 
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  value={newPrice}
                  onChange={e => setNewPrice(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3"
                  placeholder="Ex: 250.00"
                />
             </div>
             <div className="flex gap-3">
               <button type="button" onClick={() => setIsCreating(false)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl">
                 Cancelar
               </button>
               <button type="submit" className="flex-1 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition">
                 Criar Pacote
               </button>
             </div>
           </form>
        </div>
      )}
    </div>
  );
}
