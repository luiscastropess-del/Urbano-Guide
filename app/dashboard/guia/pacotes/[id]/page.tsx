"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  getTourPackage, 
  updateTourPackageDetails,
  addRouteToPackage,
  removeRouteFromPackage
} from "@/app/actions.guide.packages";
import { getGuideRoutes } from "@/app/actions.guide.routes";
import { useToast } from "@/components/ToastProvider";
import { 
  ArrowLeft, 
  Save, 
  MapPin, 
  Plus, 
  X, 
  Clock, 
  Image as ImageIcon,
  Star
} from "lucide-react";
import Link from "next/link";

export default function PackageBuilderPage() {
  const { id } = useParams() as { id: string };
  const { showToast } = useToast();
  const router = useRouter();
  
  const [pkg, setPkg] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form Details
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [durationDays, setDurationDays] = useState("1");
  const [maxPeople, setMaxPeople] = useState("10");
  const [status, setStatus] = useState("DRAFT");
  
  // Routes to select
  const [availableRoutes, setAvailableRoutes] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const pData = await getTourPackage(id);
      if (pData) {
        setPkg(pData);
        setTitle(pData.title);
        setDescription(pData.description || "");
        setPrice(pData.price.toString());
        setDurationDays(pData.durationDays.toString());
        setMaxPeople(pData.maxPeople.toString());
        setStatus(pData.status);
      }
      
      const rData = await getGuideRoutes();
      setAvailableRoutes(rData);
    } catch (e) {
      showToast("Erro ao carregar pacote.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDetails = async () => {
    setSaving(true);
    try {
      await updateTourPackageDetails(id, {
        title,
        description,
        price: parseFloat(price),
        durationDays: parseInt(durationDays),
        maxPeople: parseInt(maxPeople),
        status
      });
      showToast("Pacote salvo com sucesso!");
    } catch (e) {
      showToast("Erro ao salvar.");
    } finally {
      setSaving(false);
      fetchData();
    }
  };

  const handleAddRoute = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const rId = e.target.value;
    if(!rId) return;
    try {
      if(pkg.routes.find((r: any) => r.id === rId)) {
         showToast("Este roteiro já está no pacote");
         return;
      }
      await addRouteToPackage(id, rId);
      e.target.value = "";
      fetchData();
    } catch(e) {
      showToast("Erro ao adicionar roteiro.");
    }
  };

  const handleRemoveRoute = async (routeId: string) => {
    try {
      await removeRouteFromPackage(id, routeId);
      fetchData();
    } catch(e) {
      showToast("Erro ao remover roteiro.");
    }
  };

  const buyPremium = async () => {
     if(!confirm("Impulsionar pacote por R$99.90 mensais? O valor será descontado de seu saldo.")) return;
     try {
        await updateTourPackageDetails(id, { status: "PREMIUM" });
        showToast("Sucesso! Seu pacote agora é Premium.");
        fetchData();
     } catch(e) {
        showToast("Erro ao comprar PREMIUM.");
     }
  }

  if (loading || !pkg) return <div className="p-10 flex justify-center"><Clock className="animate-spin text-orange-500"/></div>;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto h-full overflow-y-auto pb-32">
      <Link href="/dashboard/guia/pacotes" className="inline-flex items-center gap-2 text-slate-500 hover:text-orange-500 mb-6 font-medium text-sm transition">
        <ArrowLeft size={16} /> Voltar para Pacotes
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">Configurar Pacote {pkg.status === "PREMIUM" && <Star size={20} className="fill-amber-500 text-amber-500"/>}</h1>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          {pkg.status !== "PREMIUM" && (
            <button onClick={buyPremium} className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg">
                <Star size={16} className="fill-white"/> Impulsionar (Premium)
            </button>
          )}

          <select 
             value={status}
             onChange={e => setStatus(e.target.value)}
             className="flex-1 md:flex-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 font-medium text-sm focus:outline-none focus:border-orange-500"
          >
            <option value="DRAFT">Rascunho</option>
            <option value="PUBLISHED">Publicado</option>
            {pkg.status === "PREMIUM" && (
                <option value="PREMIUM">PREMIUM (Ativo)</option>
            )}
          </select>
          <button 
            disabled={saving}
            onClick={handleSaveDetails}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition disabled:bg-slate-300"
          >
            {saving ? <Clock className="animate-spin" size={18} /> : <Save size={18} />}
            Salvar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <h3 className="font-bold mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Informações</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Título do Pacote</label>
                  <input 
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 font-medium focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Preço (R$)</label>
                  <input 
                    type="number"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 font-medium focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                   <div>
                       <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Duração (Dias)</label>
                       <input 
                         type="number"
                         value={durationDays}
                         onChange={e => setDurationDays(e.target.value)}
                         className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 font-medium"
                       />
                   </div>
                   <div>
                       <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Max. Pessoas</label>
                       <input 
                         type="number"
                         value={maxPeople}
                         onChange={e => setMaxPeople(e.target.value)}
                         className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 font-medium"
                       />
                   </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Descrição para venda</label>
                  <textarea 
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={5}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 font-medium text-sm focus:ring-2 focus:ring-orange-500 resize-none"
                    placeholder="Venda seu pacote..."
                  />
                </div>
              </div>
           </div>
        </div>

        <div className="lg:col-span-2">
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm min-h-[400px] flex flex-col mb-8">
               <h3 className="font-bold mb-4">Roteiros Inclusos ({pkg.routes.length})</h3>
               
               <div className="mb-6 z-20">
                    <select
                      onChange={handleAddRoute}
                      defaultValue=""
                      className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-3 font-medium text-sm"
                    >
                       <option value="" disabled>+ Adicionar Roteiro Existente ao Pacote</option>
                       {availableRoutes.filter(ar => ar.status === "PUBLISHED").map(r => (
                          <option key={r.id} value={r.id}>{r.title} ({r.durationMinutes} min)</option>
                       ))}
                    </select>
               </div>

               <div className="flex-1 space-y-4">
                   {pkg.routes.length === 0 ? (
                       <div className="text-center text-slate-400 mt-10">Este pacote ainda não tem roteiros.</div>
                   ) : (
                       pkg.routes.map((r: any) => (
                           <div key={r.id} className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 flex justify-between items-start">
                               <div>
                                  <h4 className="font-bold">{r.title}</h4>
                                  <p className="text-xs text-slate-500 mt-1">{r.places.length} locais de visitação</p>
                               </div>
                               <button onClick={() => handleRemoveRoute(r.id)} className="p-2 text-rose-500 hover:bg-rose-100 rounded-lg">
                                  <X size={16}/>
                               </button>
                           </div>
                       ))
                   )}
               </div>
           </div>
           
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm text-center py-10">
              <ImageIcon size={32} className="mx-auto mb-3 text-slate-300" />
              <h3 className="font-bold mb-1">Fotos do Pacote</h3>
              <p className="text-xs text-slate-500 mb-4">Em breve você poderá fazer upload de fotos exclusivas do pacote aqui.</p>
              <button disabled className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl font-medium text-sm">Upload Indisponível</button>
           </div>
        </div>

      </div>
    </div>
  );
}
