"use client";

import { useToast } from "@/components/ToastProvider";
import { Moon, Bell, Search, MapPin, Calendar as CalendarIcon, Star, Shield, ArrowRight, Package, User, Clock, Compass } from "lucide-react";
import { useState, useEffect } from "react";
import { getPublicPackages, getPremiumPackages, getFeaturedCities } from "@/app/actions.tours";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function PacotesPage() {
  const { showToast } = useToast();
  const router = useRouter();
  
  const [packages, setPackages] = useState<any[]>([]);
  const [premiumPackages, setPremiumPackages] = useState<any[]>([]);
  const [featuredCities, setFeaturedCities] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);

  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    Promise.all([
      getPublicPackages(),
      getPremiumPackages(),
      getFeaturedCities()
    ]).then(([pkgs, premiumPkgs, cities]) => {
      setPackages(pkgs);
      setPremiumPackages(premiumPkgs);
      setFeaturedCities(cities);
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
          <div className="mb-10 mt-2">
            <div className="px-5 mb-4 flex justify-between items-end">
               <div>
                  <h3 className="font-black text-2xl tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                    Cidades em Destaque 
                    <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                  </h3>
                  <p className="text-slate-500 text-sm font-medium">Explore destinos escolhidos a dedo para você</p>
               </div>
               <Star className="text-amber-500 fill-amber-500 mb-1" size={20} />
            </div>

            <div className="relative overflow-hidden group/carousel" style={{ height: '420px' }}>
               <motion.div 
                 className="flex gap-5 absolute px-5"
                 animate={isPaused ? {} : { x: ["0%", "-50%"] }}
                 transition={{ 
                    ease: "linear", 
                    duration: 40, 
                    repeat: Infinity,
                    repeatType: "loop"
                 }}
                 drag="x"
                 dragConstraints={{ left: -2000, right: 0 }}
                 onHoverStart={() => setIsPaused(true)}
                 onHoverEnd={() => setIsPaused(false)}
                 onTouchStart={() => setIsPaused(true)}
                 onTouchEnd={() => setIsPaused(false)}
                 whileTap={{ cursor: "grabbing" }}
               >
                  {/* Duplicate the list for infinite scroll effect */}
                  {[...featuredCities, ...featuredCities].map((city, index) => (
                    <div 
                      key={`${city.id || city.name}-${index}`} 
                      className="flex-shrink-0 w-[300px] h-[400px] relative rounded-[32px] overflow-hidden group cursor-pointer shadow-2xl shadow-black/20 hover:shadow-orange-500/10 transition-all duration-500"
                    >
                      <img 
                        src={city.coverImage || city.profileImage || `https://picsum.photos/seed/${city.name}/600/800`} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                        alt={city.name} 
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/40 to-transparent pt-32 pb-8 px-6 flex flex-col justify-end">
                         <div className="flex items-center gap-2 mb-2">
                            <span className="bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md">
                               {city.state || "SP"}
                            </span>
                            <div className="h-[1px] flex-1 bg-white/20" />
                         </div>
                         <h4 className="text-white font-black text-3xl drop-shadow-2xl mb-2 tracking-tight group-hover:translate-x-1 transition-transform duration-300">
                           {city.name}
                         </h4>
                         <p className="text-white/70 text-xs font-medium line-clamp-2 leading-relaxed mb-4">
                           {city.description || `Um destino encantador com experiências únicas que você só encontra aqui.`}
                         </p>
                         <div className="flex items-center gap-2">
                            <div className="inline-flex items-center gap-2 text-white text-xs font-bold bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-2xl group-hover:bg-orange-500 group-hover:border-orange-400 transition-all duration-300">
                               Ver Pacotes <ArrowRight size={14} />
                            </div>
                            <div className="flex -space-x-2">
                               {[1,2,3].map(i => (
                                 <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-6 h-6 rounded-full border-2 border-black/50" />
                               ))}
                               <div className="w-6 h-6 rounded-full border-2 border-black/50 bg-slate-800 flex items-center justify-center text-[8px] text-white font-bold">+12</div>
                            </div>
                         </div>
                      </div>
                      
                      {/* Top Badges */}
                      <div className="absolute top-5 left-5 right-5 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                         <div className="bg-white/10 backdrop-blur-md rounded-2xl p-1 px-3 border border-white/10 text-white text-[10px] font-bold">
                            #{index % featuredCities.length + 1}
                         </div>
                         <div className="bg-amber-500 rounded-full h-8 w-8 flex items-center justify-center shadow-lg">
                            <Star className="text-white fill-white" size={14} />
                         </div>
                      </div>
                    </div>
                  ))}
              </motion.div>
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
