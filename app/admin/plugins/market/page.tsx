"use client";

import { useState } from "react";
import { useToast } from "@/components/ToastProvider";
import { Search, Download, Check, Box, PlusCircle, Link as LinkIcon, Star, Code2 } from "lucide-react";
import { upsertPlugin } from "@/app/actions.plugins";

const MOCK_MARKETPLACE = [
  {
    id: "m1",
    name: "Automação de WhatsApp",
    slug: "whatsapp-automator",
    description: "Envie mensagens automáticas para os prospects capturados com integração nativa do WhatsApp Web.",
    author: "Urbano Team",
    version: "1.2.0",
    rating: 4.8,
    downloads: "2.1k",
    manifest: JSON.stringify({ type: "iframe", permissions: ["db"] }),
    codeHtml: `<html><body style="font-family:sans-serif;padding:2rem;"><h2 style="color:#25D366;">WhatsApp Automator</h2><p>Simulação de disparo em massa.</p><button style="background:#25D366;color:white;border:none;padding:10px 20px;border-radius:8px;">Conectar WhatsApp</button></body></html>`
  },
  {
    id: "m2",
    name: "Exportador Avançado",
    slug: "advanced-exporter",
    description: "Exporte seus dados em múltiplos formatos: PDF, CSV, Excel e importe diretamente para o Google Sheets.",
    author: "Urbano Team",
    version: "2.0.1",
    rating: 4.9,
    downloads: "5.4k",
    manifest: JSON.stringify({ type: "iframe" }),
    codeHtml: `<html><body style="font-family:sans-serif;padding:2rem;"><h2>Exportador Avançado</h2><button style="padding:10px;background:#333;color:#fff;border-radius:4px;border:none;">Gerar XLS</button></body></html>`
  }
];

export default function MarketplacePage() {
  const { showToast } = useToast();
  const [installingId, setInstallingId] = useState<string | null>(null);
  const [installedCount, setInstalledCount] = useState(0);

  const handleInstallDefault = async (plugin: any) => {
    setInstallingId(plugin.id);
    try {
      await upsertPlugin({
        name: plugin.name,
        slug: plugin.slug,
        description: plugin.description,
        version: plugin.version,
        author: plugin.author,
        isActive: true,
        manifest: plugin.manifest,
        codeHtml: plugin.codeHtml
      });
      showToast(`${plugin.name} instalado com sucesso!`);
      setInstalledCount(c => c + 1);
    } catch (e) {
      showToast("Erro ao instalar plugin");
    } finally {
      setInstallingId(null);
    }
  };

  const handleCustomInstall = () => {
    // Here we could open a modal for ZIP upload or URL
    const jsonStr = prompt("Cole o JSON do Plugin Demo (URL do JSON ou código literal):");
    if (jsonStr) {
       try {
         const data = JSON.parse(jsonStr);
         if (!data.name || !data.slug) throw new Error("JSON inválido: name e slug obrigatórios");
         
         upsertPlugin({
           name: data.name,
           slug: data.slug,
           description: data.description || "Plugin importado manualmente",
           version: data.version || "1.0.0",
           author: data.author || "Desconhecido",
           isActive: true,
           manifest: data.manifest || "{}",
           codeHtml: data.codeHtml || "<h2>Plugin Customizado</h2>"
         }).then(() => {
            showToast("Plugin customizado instalado!");
         }).catch(() => showToast("Erro ao salvar plugin no banco"));

       } catch(e) {
         showToast("Formato inválido. Insira um JSON válido do plugin.");
       }
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 border-x border-slate-200 dark:border-slate-800">
      <header className="px-5 md:px-8 pt-6 pb-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg text-white">
               <Box size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Marketplace</h1>
              <p className="text-sm text-slate-500 font-medium">Descubra novos plugins incríveis para o sistema</p>
            </div>
          </div>
          <button 
            onClick={handleCustomInstall}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-semibold transition flex items-center gap-2"
          >
            <Code2 size={16} /> Importar Manual
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-5 md:p-8">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_MARKETPLACE.map(plugin => (
              <div key={plugin.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition group">
                <div className="h-32 bg-slate-100 dark:bg-slate-700 relative flex items-center justify-center">
                   <Box size={48} className="text-slate-300 dark:text-slate-600 transition-transform group-hover:scale-110" />
                   <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur px-2 py-1 flex items-center gap-1 rounded-full text-xs font-bold text-amber-500">
                     <Star size={12} className="fill-amber-500" /> {plugin.rating}
                   </div>
                </div>
                <div className="p-5">
                   <h3 className="font-bold text-lg mb-1">{plugin.name}</h3>
                   <p className="text-xs text-slate-400 mb-3">{plugin.author} • {plugin.downloads} downloads</p>
                   <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 line-clamp-3">
                     {plugin.description}
                   </p>
                   
                   <button 
                     onClick={() => handleInstallDefault(plugin)}
                     disabled={installingId === plugin.id}
                     className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-xl text-sm font-bold flex justify-center items-center gap-2 transition disabled:opacity-50"
                   >
                     {installingId === plugin.id ? (
                        <>Instalando...</>
                     ) : (
                        <><Download size={16} /> Instalar Grátis</>
                     )}
                   </button>
                </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}
