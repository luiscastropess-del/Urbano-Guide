"use client";

import { useToast } from "@/components/ToastProvider";
import { Moon, Bell, Search, MapPin, Calendar as CalendarIcon, Star, Shield, ArrowRight, Package, User, Clock, Compass } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { getPublicPackages, getPremiumPackages, getFeaturedCities } from "@/app/actions.tours";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";

export default function PacotesPage() {
  const { showToast } = useToast();
  const router = useRouter();
  
  const [packages, setPackages] = useState<any[]>([]);
  const [premiumPackages, setPremiumPackages] = useState<any[]>([]);
  const [featuredCities, setFeaturedCities] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);

  const [isPaused, setIsPaused] = useState(false);
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);

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

  useEffect(() => {
    if (containerRef.current && featuredCities.length > 0) {
      setContentWidth(containerRef.current.scrollWidth / 2);
    }
  }, [featuredCities, loading]);

  useAnimationFrame((t, delta) => {
    if (isPaused || contentWidth <= 0) return;

    let moveBy = -1.2 * (delta / 16); 
    let currentX = x.get();
    let nextX = currentX + moveBy;

    if (nextX <= -contentWidth) {
      nextX += contentWidth;
    } else if (nextX > 0) {
      nextX -= contentWidth;
    }

    x.set(nextX);
  });

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
                       <div className="relative overflow-hidden group/carousel" style={{ height: '480px' }}>
               <motion.div 
                 ref={containerRef}
                 className="flex gap-6 absolute px-5 py-4"
                 style={{ x }}
                 drag="x"
                 dragConstraints={{ left: -contentWidth * 2, right: 0 }}
                 onDragStart={() => setIsPaused(true)}
                 onDragEnd={() => setIsPaused(false)}
                 onHoverStart={() => setIsPaused(true)}
                 onHoverEnd={() => setIsPaused(false)}
                 whileTap={{ cursor: "grabbing" }}
               >
                  {/* Duplicate the list for infinite scroll effect */}
                  {[...featuredCities, ...featuredCities].map((city, index) => (
                    <div 
                      key={`${city.id || city.name}-${index}`} 
                      className="flex-shrink-0 w-[280px] h-[440px] relative rounded-[40px] overflow-hidden group cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-orange-500/20 transition-all duration-700"
                    >
                      <img 
                        src={city.coverImage || city.profileImage || `https://picsum.photos/seed/${city.name}/600/1000`} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                        alt={city.name} 
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Premium Overlay Gradients */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90" />
                      <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      
                      <div className="absolute inset-x-0 bottom-0 pt-32 pb-10 px-8 flex flex-col justify-end">
                         <div className="flex items-center gap-3 mb-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <span className="bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-white/20">
                               {city.state || "SP"}
                            </span>
                            <div className="h-[1px] flex-1 bg-white/10" />
                         </div>
                         <h4 className="text-white font-black text-4xl drop-shadow-2xl mb-3 tracking-tighter transition-all duration-500 group-hover:scale-105 origin-left">
                           {city.name}
                         </h4>
                         <p className="text-white/60 text-[13px] font-medium line-clamp-2 leading-relaxed mb-6 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100 translate-y-2 group-hover:translate-y-0">
                           {city.description || `Um destino fascinante que aguarda sua visita para criar memórias inesquecíveis.`}
                         </p>
                         <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-700 delay-200">
                            <div className="inline-flex items-center gap-3 text-white text-xs font-black bg-orange-500 px-6 py-3 rounded-2xl shadow-xl shadow-orange-500/40 active:scale-95 transition-all">
                               Explorar <ArrowRight size={16} />
                            </div>
                            <div className="flex -space-x-2">
                               {[1,2,3].map(i => (
                                 <img key={i} src={`https://i.pravatar.cc/100?img=${i+20}`} className="w-8 h-8 rounded-full border-2 border-black" />
                               ))}
                            </div>
                         </div>
                      </div>
                      
                      {/* Fancy Number Badge */}
                      <div className="absolute top-8 left-8">
                         <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center group-hover:bg-orange-500/80 transition-colors duration-500">
                            <span className="text-white font-black text-sm">{(index % featuredCities.length) + 1}</span>
                         </div>
                      </div>
                    </div>
                  ))}
               </motion.div>
            </div>
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
