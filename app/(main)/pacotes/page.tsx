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
import { 
  getPublicPackages, 
  getPremiumPackages,
  getFeaturedCities,
  getPremiumGuides
} from "@/app/actions.tours";
import { useRouter } from "next/navigation";

export default function PacotesPage() {
  const { showToast } = useToast();
  const router = useRouter();
  
  const [packages, setPackages] = useState<any[]>([]);
  const [premiumPackages, setPremiumPackages] = useState<any[]>([]);
  const [featuredCities, setFeaturedCities] = useState<any[]>([]);
  const [premiumGuides, setPremiumGuides] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getPublicPackages(),
      getPremiumPackages(),
      getFeaturedCities(),
      getPremiumGuides()
    ]).then(([pkgs, premiumPkgs, cities, guides]) => {
      setPackages(pkgs);
      setPremiumPackages(premiumPkgs);
      setFeaturedCities(cities);
      setPremiumGuides(guides);
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
            placeholder="Buscar cidades, guias ou pacotes..."
            className="w-full bg-slate-100 dark:bg-slate-800 border-0 rounded-2xl py-3.5 pl-11 pr-4 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500/50 outline-none"
          />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-24 feed-scroll">
        
        {/* Featured Cities Carousel */}
        {featuredCities.length > 0 && (
          <div className="mt-4 mb-8 pl-5">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2 pr-5">
              Top Destinos <Star className="text-amber-500 fill-amber-500" size={18} />
            </h3>
            <div className="flex gap-4 overflow-x-auto scroll-x hide-scroll pb-2 pr-5">
              {featuredCities.map(city => (
                <div key={city.id} className="flex-shrink-0 w-44 rounded-3xl overflow-hidden relative shadow-md shadow-orange-500/10 cursor-pointer group aspect-[4/5]">
                   <img src={city.coverImage || "https://picsum.photos/400/500?nature"} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                   <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-white/20 backdrop-blur-md rounded-xl p-2.5 border border-white/20">
                         <h4 className="font-black text-white text-base leading-tight drop-shadow-md">{city.name}</h4>
                         <p className="text-orange-200 text-[10px] font-bold mt-0.5 max-w-full truncate">{city.state || "SP"}</p>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Premium Guides Banner / Carousel */}
        {premiumGuides.length > 0 && (
          <div className="mb-8 px-5">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-5 text-white shadow-xl relative overflow-hidden">
               <div className="flex justify-between items-center mb-4 relative z-10 w-full">
                  <div>
                     <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 inline-block">Guias Premium</span>
                     <h2 className="text-xl font-bold leading-tight">Os Melhores da Região</h2>
                  </div>
                  <Shield size={32} className="text-orange-500 shrink-0" />
               </div>
               
               <div className="flex gap-3 overflow-x-auto scroll-x hide-scroll pb-2 relative z-10">
                  {premiumGuides.map(guide => (
                     <div key={guide.id} className="flex-shrink-0 w-36 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex flex-col items-center text-center cursor-pointer hover:bg-white/20 transition-colors">
                        <img src={guide.user?.avatar || "https://picsum.photos/100/100?face"} className="w-14 h-14 rounded-full mb-2 object-cover border-2 border-orange-500" />
                        <h4 className="font-bold text-sm text-white line-clamp-1">{guide.user?.name}</h4>
                        <div className="flex items-center gap-1 text-orange-400 text-[10px] font-bold mt-1">
                           <Star size={10} className="fill-orange-400" /> Nível {guide.user?.level || 1}
                        </div>
                     </div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {/* Premium Packages (Pacotes em Alta) */}
        {premiumPackages.length > 0 && (
          <div className="mb-6 px-5">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              Pacotes em Alta <Star className="text-amber-500 fill-amber-500" size={18} />
            </h3>
            <div className="flex gap-4 overflow-x-auto scroll-x hide-scroll pb-4 -mx-5 px-5">
               {premiumPackages.map(pkg => (
                 <div key={pkg.id} onClick={() => router.push(`/pacotes/${pkg.id}`)} className="flex-shrink-0 w-72 bg-gradient-to-br from-orange-400 to-amber-500 rounded-3xl p-1 shadow-lg shadow-orange-500/20 cursor-pointer transition-transform hover:scale-[1.02]">
                    <div className="bg-white dark:bg-slate-900 rounded-[22px] h-full overflow-hidden flex flex-col pointer-events-none p-4">
                       <div className="flex justify-between items-start mb-2">
                         <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider h-fit">Mais Vendido</span>
                         <div className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl text-xs font-black">
                           R$ {pkg.price.toFixed(2)}
                         </div>
                       </div>
                       <h4 className="font-bold text-lg leading-tight mb-2 truncate">{pkg.title}</h4>
                       <p className="text-xs text-slate-500 line-clamp-2 min-h-[32px]">{pkg.description}</p>
                       <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                           <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex justify-center items-center"><User size={12}/></div>
                              <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400 truncate max-w-[80px]">{pkg.guide?.user?.name}</span>
                           </div>
                           <span className="text-orange-500 text-xs font-bold flex items-center gap-1">Detalhes <ArrowRight size={12}/></span>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* All Packages */}
        <div className="px-5">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
             Todos os Pacotes
          </h3>

          {loading ? (
             <div className="flex justify-center p-10"><Clock className="animate-spin text-orange-500" /></div>
          ) : packages.length === 0 ? (
             <div className="text-center p-8 bg-slate-100 dark:bg-slate-800 rounded-2xl">
               <p className="text-slate-500">Nenhum pacote disponível.</p>
             </div>
          ) : (
            <div className="space-y-4">
              {packages.map(pkg => (
                <div key={pkg.id} onClick={() => router.push(`/pacotes/${pkg.id}`)} className="bg-white/70 dark:bg-slate-800/70 border border-white/20 dark:border-slate-800 backdrop-blur-md rounded-3xl p-4 shadow-sm cursor-pointer group hover:border-orange-500 transition-all">
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
    </div>
  );
}
