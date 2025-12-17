"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  X, Camera, Search, LayoutGrid, Cone, Users, PartyPopper, GraduationCap, 
  Smile, Plus, Loader2, Calendar, ChevronDown,Menu,PlusCircle
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

// --- DATOS GLOBALES (Menú Hamburguesa) ---

const globalLinks = [
  { name: 'Inicio', path: '/', color: 'text-red-600', hoverBg: 'hover:bg-red-50', border: 'hover:border-red-200' },
  { name: 'Agenda', path: '/noticias', color: 'text-orange-600', hoverBg: 'hover:bg-orange-50', border: 'hover:border-orange-200' },
  { name: 'Cancionero', path: '/cancionero', color: 'text-yellow-600', hoverBg: 'hover:bg-yellow-50', border: 'hover:border-yellow-200' },
  { name: 'Recursos', path: '/recursos', color: 'text-green-600', hoverBg: 'hover:bg-green-50', border: 'hover:border-green-200' },
  { name: 'Galería', path: '/galeria', color: 'text-cyan-600', hoverBg: 'hover:bg-cyan-50', border: 'hover:border-cyan-200' },
  { name: 'Identidad', path: '/quienes-somos', color: 'text-indigo-600', hoverBg: 'hover:bg-indigo-50', border: 'hover:border-indigo-200' },
];
// --- CONSTANTES ---
const ITEMS_PER_PAGE = 12; 

// --- UTILIDADES ---
const compressImage = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1000; 
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = scaleSize < 1 ? MAX_WIDTH : img.width;
        canvas.height = scaleSize < 1 ? img.height * scaleSize : img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        resolve(compressedBase64);
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

const formatFechaLatina = (fechaIso: string) => {
    if (!fechaIso) return "";
    const fecha = new Date(fechaIso);
    if (!isNaN(fecha.getTime())) {
        const dia = fecha.getUTCDate().toString().padStart(2, '0');
        const mes = (fecha.getUTCMonth() + 1).toString().padStart(2, '0');
        const anio = fecha.getUTCFullYear();
        return `${dia}/${mes}/${anio}`;
    }
    return fechaIso;
};

// --- CONFIGURACIÓN ---
const fotosEstaticas = [
  { id: 101, categoria: "Vialidad", src: "/images/20190518_231107.jpg", desc: "Control en el Prado", fecha: "2025-12-01" },
{ id: 102, categoria: "Social", src: "/images/20190518_232858.jpg", desc: "Abrazo Cebra", fecha: "2025-12-02" },
  // Añade aquí tus otras fotos de ejemplo...
    { id: 103, categoria: "Desfiles", src: "/images/20200331_025013.jpg", desc: "Gran Poder", fecha: "03/12/2025" },

  { id: 104, categoria: "Capacitación", src: "/images/252276608_4427588540641355_3495706640484898726_n.jpg", desc: "Lanzamiento del programa 2025", fecha: "04/12/2025" },

  { id: 105, categoria: "Social", src: "/images/images.jpg", desc: "Visita a unidad educativa", fecha: "05/12/2025" },

  { id: 106, categoria: "Vialidad", src: "/images/WhatsApp Image 2023-11-06 at 14.22.40.jpeg", desc: "Enseñando a cruzar", fecha: "06/12/2025" },
];

const categoriasMenu = [
  { id: "Todas", label: "Todas", icon: <LayoutGrid size={18} /> },
  { id: "Vialidad", label: "Calles", icon: <Cone size={18} /> },
  { id: "Social", label: "P. Sociales", icon: <Users size={18} /> },
  { id: "Desfiles", label: "Desfiles", icon: <PartyPopper size={18} /> },
  { id: "Capacitación", label: "Talleres", icon: <GraduationCap size={18} /> },
];

const paperTexture = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E")`;

// --- COMPONENTES UI ---
const RainbowIconTabs = ({ items, activeId, setActiveId }: any) => {
    const activeLabel = items.find((i: any) => i.id === activeId)?.label;
    const rainbowColors = [
      { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-100', active: 'bg-cyan-600 text-white' },
      { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100', active: 'bg-orange-500 text-white' },
      { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-100', active: 'bg-yellow-500 text-white' },
      { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100', active: 'bg-green-600 text-white' },
      { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', active: 'bg-blue-600 text-white' },
    ];

    return (
        <div className="flex flex-col items-center w-full px-1">
            <div className="flex flex-wrap justify-center items-center gap-2 w-full">
                {items.map((item: any, index: number) => {
                    const colorObj = rainbowColors[index % rainbowColors.length];
                    const isActive = activeId === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveId(item.id)}
                            className={`
                                relative rounded-2xl transition-all duration-300 flex items-center justify-center shrink-0 border
                                ${isActive 
                                    ? `${colorObj.active} border-transparent shadow-md px-4 py-2 scale-105` 
                                    : `${colorObj.bg} ${colorObj.text} ${colorObj.border} opacity-90 hover:opacity-100 p-2.5`
                                }
                            `}
                        >
                            {React.cloneElement(item.icon, { size: isActive ? 20 : 18 })}
                            {isActive && <span className="ml-2 text-xs font-bold whitespace-nowrap animate-fadeIn">{item.label}</span>}
                        </button>
                    );
                })}
            </div>
            <div className="text-center mt-2 h-4 mb-1">
                 {!items.find((i:any) => i.id === activeId)?.label.includes(activeLabel) && (
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-0.5">{activeLabel}</span>
                 )}
            </div>
        </div>
    );
};
// Barra de Navegación Principal (Tabs Grandes)
const DesktopNavBar = ({ items, activeId, setActiveId }: any) => {
  return (
    <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 flex overflow-x-auto no-scrollbar justify-start md:justify-center gap-1 w-full">
      {items.map((item: any) => (
        <button 
          key={item.id}
          onClick={() => setActiveId(item.id)}
          className={`
            flex-1 min-w-fit px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-sm whitespace-nowrap
            ${activeId === item.id 
              ? 'bg-slate-900 text-white shadow-md' 
              : 'text-gray-500 hover:bg-gray-50 hover:text-slate-700'
            }
          `}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
};
// --- COMPONENTE PRINCIPAL ---

export default function Galeria() {
  const [filtro, setFiltro] = useState("Todas");
  const [busqueda, setBusqueda] = useState(""); 
  const [imagenSeleccionada, setImagenSeleccionada] = useState<any>(null);
  const [pagina, setPagina] = useState(1);
  ///
  const [isScrolled, setIsScrolled] = useState(false);
  const [globalMenuOpen, setGlobalMenuOpen] = useState(false);
  
  
  const [todasLasFotos, setTodasLasFotos] = useState<any[]>(fotosEstaticas);
  const [cargando, setCargando] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [categoriaInput, setCategoriaInput] = useState("");
  const [descripcionInput, setDescripcionInput] = useState("");
  const [fechaInput, setFechaInput] = useState(new Date().toISOString().split("T")[0]);
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [subiendo, setSubiendo] = useState(false);

  // 1. CARGA SEGURA DE VARIABLES DE ENTORNO
  const GOOGLE_URL = process.env.NEXT_PUBLIC_GOOGLE_URL;
  const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY;

  useEffect(() => {
     if (!GOOGLE_URL) {
         toast.error("⚠️ Falta configurar la URL en .env.local");
         return;
     }
     fetchFotos();
  }, [GOOGLE_URL]);

  useEffect(() => {
     setPagina(1);
  }, [filtro, busqueda]);

  const fetchFotos = async () => {
    setCargando(true);
    try {
        // 2. USO DE VARIABLE DE ENTORNO
        const res = await fetch(GOOGLE_URL!);
        const data = await res.json();
        
        if (Array.isArray(data)) {
            setTodasLasFotos([...data.reverse(), ...fotosEstaticas]); 
        }
    } catch (error) {
        console.error("Error cargando fotos:", error);
        toast.error("Error de conexión al cargar fotos");
    } finally {
        setCargando(false);
    }
  };

  const fotosFiltradasTotal = todasLasFotos.filter(foto => {
    const cumpleCategoria = filtro === "Todas" ? true : foto.categoria === filtro;
    const busquedaLower = busqueda.toLowerCase();
    const descLower = (foto.desc || "").toLowerCase();
    const catLower = (foto.categoria || "").toLowerCase();
    const fechaLatina = formatFechaLatina(foto.fecha); 
    
    const cumpleBusqueda = descLower.includes(busquedaLower) || 
                           catLower.includes(busquedaLower) ||
                           fechaLatina.includes(busquedaLower);

    return cumpleCategoria && cumpleBusqueda;
  });

  const fotosParaMostrar = fotosFiltradasTotal.slice(0, pagina * ITEMS_PER_PAGE);
  const hayMasFotos = fotosFiltradasTotal.length > fotosParaMostrar.length;


  const handleUpload = async () => {
    if (!fileInput) return toast.warning("⚠️ Debes seleccionar una imagen primero");
    if (!categoriaInput || !descripcionInput || !fechaInput) return toast.warning("📝 Completa todos los campos");
    if (!GOOGLE_URL || !SECRET_KEY) return toast.error("❌ Error de configuración (Faltan variables .env)");

    setSubiendo(true);

    try {
        const imagenComprimida = await compressImage(fileInput);

        // 3. USO DE VARIABLE DE ENTORNO EN EL UPLOAD
        const res = await fetch(
          GOOGLE_URL,
          {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({
              key: SECRET_KEY, // Clave segura
              categoria: categoriaInput,
              descripcion: descripcionInput,
              fecha: fechaInput, 
              imagen: imagenComprimida 
            })
          }
        );
        
        const data = await res.json();
        
        if (data.status === "success" || data.result === "success" || data.success === true) {
          toast.success("¡Foto subida con éxito! 🎉");
          setModalVisible(false);
          setCategoriaInput("");
          setDescripcionInput("");
          setFileInput(null);
          fetchFotos(); 
        } else {
             toast.error("Error servidor: " + (data.message || "Desconocido"));
        }
    } catch(err) {
        console.error("Error al subir:", err);
        toast.error("Error de conexión. 📶");
    } finally {
        setSubiendo(false);
    }
  };

  useEffect(() => {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 10);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);
  
  

  return (
    <main className="min-h-screen bg-slate-50 pb-20 font-sans" style={{ backgroundImage: paperTexture }}>
      <Toaster richColors position="bottom-center" />
{/* --- MENU GLOBAL (OVERLAY) --- */}
      {/* Se sobrepone a TODO el contenido */}
      {globalMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md animate-fadeIn flex justify-end">
          <div className="w-full md:w-96  shadow-2xl animate-slideInRight">
            <div className="p-4 flex justify-between items-center border-b border-slate-100 bg-amber-50">
              <h2 className="text-xl font-black text-slate-800">Menú Global</h2>
              <button
                onClick={() => setGlobalMenuOpen(false)}
                className="p-2 bg-red-100 text-red-500 rounded-full hover:bg-red-200 transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-amber-50">
              {globalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={() => setGlobalMenuOpen(false)}
                  className={`flex items-center justify-between p-2 rounded-2xl transition-all font-black text-lg border-2
                                ${link.path === '/galeria'
                      ? 'bg-slate-900 border-slate-900 text-white shadow-lg'
        
                      : `bg-amber-50 border-transparent text-black ${link.hoverBg} hover:border-slate-200 ${link.color} ${link.border}`}

                            `} 
                >
                  <span>{link.name}</span>
                  {link.path === '/galeria' && <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>}
                </Link>
              ))}
            </div>

            <div className="bg-amber-50 p-8 text-center mt-auto border-t border-slate-100">
              <h2 className="text-3xl font-black flex justify-center items-center gap-1 tracking-tighter ">
                CEBRAS
                <span className="text-red-500">L</span>
                <span className="text-green-500">P</span>
                <span className="text-4xl ml-2">🦓</span>
              </h2>
              <p className="text-slate-500 text-xs mt-2 uppercase tracking-widest font-bold">La Paz - Bolivia</p>
            </div>
          </div>
        </div>
      )}
    
      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-slate-50/95 backdrop-blur-sm shadow-sm transition-all pb-2">
          <section className="bg-gradient-to-br from-cyan-900 via-blue-700 to-slate-900 p-2 pt-3 rounded-b-[2.5rem] shadow-lg mb-4 text-center relative overflow-hidden z-20">
            <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]"></div>
            
            <div className="relative z-10 flex flex-col items-center">
                <div className="bg-white/20 p-2 rounded-full mb-2 backdrop-blur-sm border-2 border-white/30 hover:rotate-12 transition-transform duration-300 animate-bounce">
                    <Camera className="w-8 h-8 text-white" />
                </div>
 <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-md">Galería Cebra</h1>
        <p className="text-cyan-100 font-medium text-sm">Momentos capturados.</p>
                
                <div className="w-full max-w-md relative group mt-4 ">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
                        <Search className="h-5 w-5 text-white/70 group-focus-within:text-white " />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar por descripción o fecha..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border-none rounded-full leading-5 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:bg-white/30 focus:ring-2 focus:ring-white/50 focus:placeholder-white transition duration-150 ease-in-out sm:text-sm shadow-inner backdrop-blur-md"
                    />
                    {busqueda && (
                         <button onClick={() => setBusqueda("")} className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/70 hover:text-white">
                             <X size={16} />
                         </button>
                    )}
                </div>
            </div>
          </section>

       

          <div className="container mx-auto px-4 max-w-2xl">
             <RainbowIconTabs items={categoriasMenu} activeId={filtro} setActiveId={setFiltro} />
          </div>

               {isScrolled && (
          <button
            className=" 
      fixed top-1 right-2
      z-[999]
      bg-white/20 text-white
      w-10 h-10
      rounded-full
      flex items-center justify-center
      shadow-xl
      animate-fade-in border-white/20 text-white hover:bg-white/20 transition-all active:scale-95 hover:rotate-90 duration-500
    "
            onClick={() => setGlobalMenuOpen(true)}
          >
            <Menu size={22} />
          </button>
        )}
      </div>

      {/* GRILLA MASONRY REAL */}
      <div className="container mx-auto px-4 pt-2 max-w-6xl animate-fadeIn">
        
        {cargando && todasLasFotos.length <= fotosEstaticas.length && (
             <div className="flex justify-center py-8 text-cyan-600">
                <Loader2 className="animate-spin w-8 h-8"/>
             </div>
        )}

        {fotosParaMostrar.length === 0 ? (
           <div className="text-center py-20 text-gray-400 flex flex-col items-center">
               <div className="bg-white p-4 rounded-full shadow-sm mb-3">
                   <Smile size={40} className="text-gray-300"/>
               </div>
               <p>No encontramos fotos con esos criterios.</p>
           </div>
        ) : (
            <>
                <ResponsiveMasonry columnsCountBreakPoints={{ 350: 2, 768: 3, 1024: 4 }}>
                    <Masonry gutter="16px">
                        {fotosParaMostrar.map((foto) => (
                            <div 
                            key={foto.id} 
                            className="group relative rounded-2xl overflow-hidden cursor-zoom-in shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 bg-white"
                            onClick={() => setImagenSeleccionada(foto)}
                            >
                            <div className="relative w-full">
                                <img 
                                    src={foto.src} 
                                    alt={foto.desc} 
                                    className="block w-full transform group-hover:scale-105 transition duration-700 ease-in-out"
                                    loading="lazy"
                                />
                            </div>
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                <span className="text-yellow-400 text-[10px] font-black uppercase tracking-widest mb-1 flex justify-between">
                                    {foto.categoria}
                                    <span className="text-white/80 font-normal normal-case">{formatFechaLatina(foto.fecha)}</span>
                                </span>
                                <p className="text-white text-sm font-medium leading-tight line-clamp-2">
                                {foto.desc || "Sin descripción"}
                                </p>
                            </div>
                            </div>
                        ))}
                    </Masonry>
                </ResponsiveMasonry>

                {hayMasFotos && (
                    <div className="flex justify-center mt-12 mb-8">
                        <button 
                            onClick={() => setPagina(prev => prev + 1)}
                            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-full shadow-sm hover:shadow-md hover:bg-gray-50 transition-all active:scale-95"
                        >
                            Ver más fotos <ChevronDown size={18} />
                        </button>
                    </div>
                )}
            </>
        )}
      </div>

      {/* LIGHTBOX */}
      {imagenSeleccionada && (
        <div 
          className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setImagenSeleccionada(null)}
        >
          <button className="absolute top-4 right-4 text-white/50 hover:text-white p-2 bg-white/10 rounded-full transition-colors z-50">
            <X size={24} />
          </button>
          
          <div className="max-w-4xl max-h-[90vh] w-full relative flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img 
              src={imagenSeleccionada.src} 
              alt={imagenSeleccionada.desc}
              className="max-w-full max-h-[80vh] rounded-lg shadow-2xl object-contain bg-black"
            />
            <div className="w-full mt-4 text-center">
               <div className="flex justify-center items-center gap-2 mb-2">
                    <span className="inline-block px-3 py-1 bg-yellow-500 text-black text-xs font-black rounded-full uppercase tracking-wide">
                        {imagenSeleccionada.categoria}
                    </span>
                    <span className="flex items-center text-white/60 text-xs">
                        <Calendar size={12} className="mr-1"/>
                        {formatFechaLatina(imagenSeleccionada.fecha)}
                    </span>
               </div>
               <h3 className="text-white text-lg font-medium">{imagenSeleccionada.desc}</h3>
            </div>
          </div>
        </div>
      )}
 {/* BOTÓN FLOTANTE */}
        <div className="fixed bottom-6 right-4 z-50 ">
          <div className="absolute inset-0 blur-xl opacity-30 bg-gradient-to-br from-red-700 via-orange-500 to-red-700 via-orange-500 to-red-700 rounded-full animate-pulse"></div>
          <button
            onClick={() => setModalVisible(true)}
            className="relative bg-gradient-to-br from-cyan-900 via-blue-700 to-slate-900 hover:from-cyan-500 hover:to-blue-700 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 transition-all hover:scale-80 active:scale-55 group"
          >
            <PlusCircle className="animate-pulse drop-shadow-md" />
          
          </button>
        </div>
      {/* BOTÓN UPLOAD */}

      {/* MODAL FORMULARIO */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center p-4 z-50 backdrop-blur-sm" onClick={() => setModalVisible(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md relative shadow-2xl" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-gray-400 hover:text-black" onClick={() => setModalVisible(false)}>
              <X size={24} />
            </button>
            <h2 className="text-2xl font-black mb-6 text-gray-800">Subir Foto</h2>
            
            <div className="space-y-4">
                <div>
                    <label className="block mb-1 text-sm font-bold text-gray-600">Categoría</label>
                    <select value={categoriaInput} onChange={e => setCategoriaInput(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none">
                    <option value="">Selecciona categoría</option>
                    {categoriasMenu.filter(c => c.id !== "Todas").map(c => (
                        <option key={c.id} value={c.label}>{c.label}</option>
                    ))}
                    </select>
                </div>
                <div>
                    <label className="block mb-1 text-sm font-bold text-gray-600">Descripción</label>
                    <input type="text" value={descripcionInput} onChange={e => setDescripcionInput(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none" placeholder="¿Qué está pasando?" />
                </div>
                <div>
                    <label className="block mb-1 text-sm font-bold text-gray-600">Fecha</label>
                    <input type="date" value={fechaInput} onChange={e => setFechaInput(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none" />
                </div>
                <div>
                    <label className="block mb-1 text-sm font-bold text-gray-600">Imagen</label>
                    <input type="file" accept="image/png, image/jpeg, image/jpg" onChange={e => setFileInput(e.target.files?.[0] || null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100" />
                    <p className="text-xs text-green-600 mt-1 font-semibold">Optimización automática activada (Soporta 5MB+)</p>
                </div>
            </div>

            <button 
                onClick={handleUpload} 
                disabled={subiendo}
                className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100 flex justify-center items-center gap-2"
            >
              {subiendo ? <><Loader2 className="animate-spin" /> Comprimiendo y Subiendo...</> : "Subir Foto"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
//https://script.google.com/macros/s/AKfycbyGrr6i118Qjyi4_PoIXESccDe7BzBPXKXqy5z7F4GDOw4Z1m2NjKvCDjgBu9CIV-qv/exec