"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Compass, 
  MapPin, 
  Calendar, 
  Users, 
  Settings, 
  Wallet,
  Menu
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard/guia", label: "Visão Geral", icon: Compass },
  { href: "/dashboard/guia/roteiros", label: "Roteiros", icon: MapPin },
  { href: "/dashboard/guia/pacotes", label: "Pacotes", icon: Wallet },
  { href: "/dashboard/guia/agenda", label: "Agenda", icon: Calendar },
  { href: "/dashboard/guia/clientes", label: "Clientes", icon: Users },
  { href: "/dashboard/guia/perfil", label: "Meu Perfil", icon: Settings },
];

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between z-20 sticky top-0">
        <h1 className="text-lg font-bold">Portal do Guia</h1>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <Menu size={20} />
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 fixed md:sticky top-0 left-0 h-screen w-64 
        bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 
        transition-transform duration-300 z-10 overflow-y-auto flex flex-col
      `}>
        <div className="p-6 hidden md:block">
          <h1 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-500">
            Urbano Guias
          </h1>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm
                  ${isActive 
                    ? "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}
                `}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>

      {/* Backdrop for mobile */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-0 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
