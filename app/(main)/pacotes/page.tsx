"use client";

import { useToast } from "@/components/ToastProvider";
import {
  Moon,
  Bell,
  Search,
  MapPin,
  Calendar as CalendarIcon,
  Star,
  Shield,
  ArrowRight,
  Package,
  User,
  Clock,
  Compass
} from "lucide-react";
import { useState, useEffect } from "react";
import { getPublicPackages } from "@/app/actions.tours";
import { useRouter } from "next/navigation";

export default function PacotesPage() {
  const { showToast } = useToast();
  const router = useRouter();
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicPackages().then((data) => {
      setPackages(data);
      setLoading(false);
    });
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <header className="px-5 pt-6 pb-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
              <Compass className="text-white" size={20} />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <MapPin className="text-orange-500" size={12} />
                <span className="text-sm font-medium">Holambra, SP 🌷</span>
              </div>
              <h1 className="text-xl font-bold">Pacotes & Guias</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={toggleDarkMode}
              className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center"
            >
              <Moon className="text-slate-600 dark:text-slate-300" size={18} />
            </button>
            <button
              onClick={() => showToast("🔔 Notificações")}
              className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative"
            >
              <Bell className="text-slate-600 dark:text-slate-300" size={18} />
              <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-slate-800"></span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar guias, pacotes ou roteiros..."
            className="w-full bg-slate-100 dark:bg-slate-800 border-0 rounded-2xl py-3.5 pl-11 pr-4 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500/50 outline-none"
          />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-24 feed-scroll px-5">
        
        {/* Destaque / Banner */}
        <div className="mt-4 mb-6">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-5 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 w-2/3">
              <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 inline-block">Guias Locais</span>
              <h2 className="text-xl font-bold leading-tight mb-2">Explore Holambra com Especialistas</h2>
              <p className="text-xs text-orange-100 mb-4">Aproveite pacotes exclusivos montados por guias credenciados.</p>
              <button className="bg-white text-orange-600 px-4 py-2 rounded-full text-xs font-bold shadow-md hover:bg-orange-50 transition-colors">
                Ver Guias
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-50">
               <Shield size={120} className="text-white" />
            </div>
          </div>
        </div>

        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          Pacotes em Alta <Star className="text-amber-500 fill-amber-500" size={18} />
        </h3>

        {loading ? (
           <div className="flex justify-center p-10"><Clock className="animate-spin text-orange-500" /></div>
        ) : packages.length === 0 ? (
           <div className="text-center p-8 bg-slate-100 dark:bg-slate-800 rounded-2xl">
             <p className="text-slate-500">Nenhum pacote publicado ainda.</p>
           </div>
        ) : (
          <div className="space-y-4">
            {packages.map(pkg => (
              <div key={pkg.id} className="bg-white/70 dark:bg-slate-800/70 border border-white/20 dark:border-slate-800 backdrop-blur-md rounded-3xl p-4 shadow-sm cursor-pointer group hover:border-orange-500 transition-all">
                <div className="flex justify-between items-start mb-2">
                   <div>
                     <h4 className="font-bold text-lg group-hover:text-orange-500 transition-colors">{pkg.title}</h4>
                     <p className="text-xs text-slate-500 line-clamp-2 mt-1">{pkg.description || "Descubra o melhor de Holambra neste pacote incrível."}</p>
                   </div>
                   <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-xl text-xs font-bold whitespace-nowrap ml-2">
                     R$ {pkg.price.toFixed(2)}
                   </div>
                </div>

                <div className="flex items-center gap-2 mt-4 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl">
                   <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900/40 text-orange-600 rounded-full flex items-center justify-center shrink-0">
                     <User size={12} />
                   </div>
                   <span className="flex-1 truncate">Guia: {pkg.guide?.user?.name}</span>
                   <div className="flex items-center gap-1 text-amber-500">
                      <Star size={12} className="fill-amber-500" /> {pkg.rating ? pkg.rating.toFixed(1) : "Novo"}
                   </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                   <span className="text-xs text-slate-500 font-medium">{pkg.routes?.length || 0} Roteiros inclusos</span>
                   <button 
                     onClick={() => router.push(`/pacotes/${pkg.id}`)}
                     className="bg-orange-50 dark:bg-orange-900/20 text-orange-600 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 group-hover:bg-orange-500 group-hover:text-white transition-colors"
                   >
                     Ver detalhes <ArrowRight size={12} />
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
