"use client";

import { useEffect, useState } from "react";
import { getGuideProfile, registerAsGuide } from "@/app/actions.guide";
import { useToast } from "@/components/ToastProvider";
import { Loader2, Plus, Calendar as CalendarIcon, Users, DollarSign, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function GuideDashboardPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  
  // Registration form state
  const [bio, setBio] = useState("");
  const [languages, setLanguages] = useState("Português");
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const res = await getGuideProfile();
    setLoading(false);
    if (!res.error) {
      setProfile(res.profile);
      setUser(res.user);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    try {
      const langs = languages.split(",").map(l => l.trim());
      await registerAsGuide({ bio, languages: langs });
      showToast("Solicitação enviada com sucesso! Aguarde aprovação.");
      loadProfile();
    } catch (e) {
      showToast("Erro ao processar solicitação.");
    } finally {
      setIsRegistering(false);
    }
  };

  if (loading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-orange-500" /></div>;
  }

  if (!profile) {
    return (
      <div className="p-6 md:p-12 max-w-2xl mx-auto">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-800 text-center">
          <h1 className="text-2xl font-bold mb-2">Torne-se um Guia Parceiro</h1>
          <p className="text-slate-500 mb-8">
            Compartilhe seu conhecimento sobre Holambra, crie roteiros incríveis e seja pago por isso!
          </p>
          
          <form onSubmit={handleRegister} className="text-left space-y-4">
             <div>
               <label className="block text-sm font-medium mb-1">Biografia Resumida</label>
               <textarea 
                  required
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  className="w-full rounded-xl border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-sm h-32"
                  placeholder="Conte um pouco sobre sua experiência como guia na região..."
               />
             </div>
             <div>
               <label className="block text-sm font-medium mb-1">Idiomas (separados por vírgula)</label>
               <input 
                  required
                  value={languages}
                  onChange={e => setLanguages(e.target.value)}
                  className="w-full rounded-xl border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-sm"
                  placeholder="Português, Inglês, Espanhol"
               />
             </div>
             <button 
                disabled={isRegistering}
                type="submit" 
                className="w-full p-4 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 transition flex items-center justify-center gap-2 mt-4"
              >
               {isRegistering ? <Loader2 className="animate-spin" /> : "Enviar Solicitação"}
             </button>
          </form>
        </div>
      </div>
    );
  }

  if (profile.status === "PENDING") {
    return (
      <div className="p-8 md:p-12 text-center max-w-lg mx-auto mt-10 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-3xl">
        <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CalendarIcon size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Em Análise</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Sua solicitação de parceiro está em análise pela nossa equipe. 
          Avisaremos assim que seu painel for liberado!
        </p>
      </div>
    );
  }

  if (profile.status === "BLOCKED") {
    return <div className="p-8 text-center text-red-500 font-bold">Infelizmente, sua conta de guia foi bloqueada.</div>;
  }

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Olá, {user?.name.split(" ")[0]}! 👋</h1>
          <p className="text-slate-500 mt-1">Bem-vindo(a) de volta ao seu painel de operações.</p>
        </div>
        <Link 
          href="/dashboard/guia/roteiros/novo" 
          className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition shadow-lg shadow-orange-500/20"
        >
          <Plus size={18} /> Novo Roteiro
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Reservas (Mês)" value="12" icon={<CalendarIcon />} trend="+2" />
        <MetricCard title="Clientes Atendidos" value="48" icon={<Users />} trend="+5" />
        <MetricCard title="Ganho Estimado" value="R$ 1.850" icon={<DollarSign />} trend="+15%" />
        <MetricCard title="Taxa de Ocupação" value="78%" icon={<TrendingUp />} trend="-2%" negative />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Próximos Passeios</h3>
          <div className="text-center py-10 text-slate-500 text-sm">
            Nenhuma reserva para os próximos 7 dias. <br/>
            Que tal compartilhar seus pacotes nas redes sociais?
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Avisos do Sistema</h3>
          <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-2xl text-sm mb-3">
            <strong>Dica:</strong> Roteiros com mais de 3 fotos atraem 40% mais visualizações. 
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 p-4 rounded-2xl text-sm">
            Taxa de comissão atual: <strong>{(profile.commissionRate * 100).toFixed(0)}%</strong>.
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, trend, negative = false }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 mb-4">
        {icon}
      </div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <div className="flex items-end gap-3 mt-1">
        <h4 className="text-2xl font-bold">{value}</h4>
        <span className={`text-xs font-medium mb-1 ${negative ? 'text-red-500' : 'text-green-500'}`}>{trend}</span>
      </div>
    </div>
  );
}
