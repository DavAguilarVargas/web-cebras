"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import { 
  Calendar, Newspaper, MapPin, Clock, 
  Search, X, Youtube, Facebook, Video, ExternalLink,
  AlertTriangle, CheckCircle2
} from 'lucide-react';

// --- CONFIGURACIÓN ---
const GOOGLE_SHEET_URL = ""; 

// --- DATOS DE PRUEBA (Con tus ejemplos reales) ---
const datosPrueba = [
  // --- AGENDA (Futuro / Recurrente) ---
  {
    id: 1,
    tipo: "Agenda",
    estado: "Confirmado", // Opciones: Confirmado, Tentativo
    categoria: "Navidad",
    titulo: "Encendido del Árbol Navideño",
    fecha: "2025-12-01", 
    hora: "19:00",
    lugar: "Plaza Tejada Sorzano",
    descripcion: "Inicio de las fiestas. Asistencia con traje de gala (Luces).",
    imagen: "",
    link: ""
  },
  {
    id: 2,
    tipo: "Agenda",
    estado: "Tentativo", // Actividad recurrente sin fecha fija aun
    categoria: "Aniversario",
    titulo: "Cumpleaños Cebra 2025",
    fecha: "2025-11-19", // Fecha aproximada
    hora: "Por definir",
    lugar: "Por definir",
    descripcion: "Celebración de los 24 años del programa. Preparar números artísticos.",
    imagen: "",
    link: ""
  },
  
  // --- NOTICIAS (Pasado / Destacados) ---
  {
    id: 3,
    tipo: "Noticia",
    categoria: "Hito Histórico",
    titulo: "La Morenada Cebra",
    fecha: "2015-06-10",
    descripcion: "El día que las Cebras bailaron su propia morenada, demostrando que la cultura ciudadana también es folklore. Un evento que marcó identidad.",
    imagen: "https://placehold.co/600x400/fbbf24/000?text=Morenada+Cebra",
    link: ""
  },
  {
    id: 4,
    tipo: "Noticia",
    categoria: "Viral",
    titulo: "Challenge Jerusalema",
    fecha: "2020-09-15",
    descripcion: "En plena pandemia, las Cebras llevaron esperanza con el baile de Jerusalema, viralizándose en redes y mostrando resiliencia.",
    imagen: "https://placehold.co/600x400/22c55e/FFF?text=Jerusalema",
    link: ""
  },
  {
    id: 5,
    tipo: "Noticia",
    categoria: "Proyecto Social",
    titulo: "Proyecto 'Patitas' en Colegios",
    fecha: "2024-05-12",
    descripcion: "Campaña masiva de concientización sobre tenencia responsable de mascotas realizada en 50 unidades educativas.",
    imagen: "https://placehold.co/600x400/3b82f6/FFF?text=Patitas",
    link: ""
  },

  // --- MULTIMEDIA (Videos / Enlaces) ---
  {
    id: 6,
    tipo: "Video",
    categoria: "Miniserie",
    titulo: "Miniserie: Las Aventuras de la Cebra",
    fecha: "2022-01-01",
    descripcion: "Capítulo 1: El paso de cebra. Serie educativa para niños.",
    imagen: "https://placehold.co/600x340/FF0000/FFF?text=Miniserie+YouTube",
    link: "https://youtube.com" // Aquí pondrías el link real
  },
  {
    id: 7,
    tipo: "Video",
    categoria: "Flashmob",
    titulo: "Flashmob Aniversario La Paz",
    fecha: "2023-07-16",
    descripcion: "Intervención sorpresa en el Prado Paceño.",
    imagen: "https://placehold.co/600x340/000/FFF?text=Flashmob+Video",
    link: "https://facebook.com"
  }
];

export default function Noticias() {
  const [activeTab, setActiveTab] = useState<'agenda' | 'noticias' | 'multimedia'>('agenda');
  const [items, setItems] = useState<any[]>(datosPrueba);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(false);

  // Carga de Excel (Igual que antes)
  useEffect(() => {
    if (GOOGLE_SHEET_URL) {
      setLoading(true);
      Papa.parse(GOOGLE_SHEET_URL, {
        download: true,
        header: true,
        complete: (results) => {
          setItems(results.data);
          setLoading(false);
        }
      });
    }
  }, []);

  // LÓGICA DE FILTRADO (Buscador + Pestaña)
  const itemsFiltrados = useMemo(() => {
    return items.filter(item => {
      // 1. Filtro por Pestaña
      let coincideTipo = false;
      if (activeTab === 'agenda') coincideTipo = item.tipo === 'Agenda';
      if (activeTab === 'noticias') coincideTipo = item.tipo === 'Noticia';
      if (activeTab === 'multimedia') coincideTipo = item.tipo === 'Video';

      // 2. Filtro por Buscador (Texto)
      const textoBusqueda = busqueda.toLowerCase();
      const coincideTexto = 
        item.titulo.toLowerCase().includes(textoBusqueda) ||
        item.descripcion.toLowerCase().includes(textoBusqueda) ||
        item.categoria.toLowerCase().includes(textoBusqueda);

      return coincideTipo && coincideTexto;
    });
  }, [items, activeTab, busqueda]);


  // Helpers de Fecha
  const formatearFecha = (fechaStr: string) => {
    if (!fechaStr) return "";
    const [year, month, day] = fechaStr.split('-').map(Number);
    const fecha = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat('es-BO', { day: 'numeric', month: 'short', year: 'numeric' }).format(fecha);
  };

  const getDia = (fechaStr: string) => {
    if (!fechaStr) return "";
    return fechaStr.split('-')[2];
  };

  const getMes = (fechaStr: string) => {
    if (!fechaStr) return "";
    const [year, month, day] = fechaStr.split('-').map(Number);
    const fecha = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat('es-BO', { month: 'short' }).format(fecha).toUpperCase();
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      
      {/* 1. CABECERA */}
      <section className="bg-black text-white p-6 pt-10 rounded-b-[2.5rem] shadow-lg mb-6 sticky top-0 z-40">
        <div className="flex flex-col items-center mb-4">
          <Newspaper className="w-10 h-10 text-yellow-400 mb-2" />
          <h1 className="text-2xl font-black">Pizarra Cebra</h1>
        </div>

        {/* BUSCADOR INTEGRADO */}
        <div className="relative max-w-md mx-auto w-full">
          <Search className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Buscar: Navidad, Aniversario, Jerusalema..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-white text-black pl-10 pr-10 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 font-medium placeholder-gray-400 shadow-inner"
          />
          {busqueda && (
            <button 
              onClick={() => setBusqueda("")}
              className="absolute right-3 top-3 text-gray-400 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </section>

      {/* 2. PESTAÑAS (TABS) */}
      <div className="container mx-auto px-4 max-w-2xl mb-6">
        <div className="bg-white p-1 rounded-2xl shadow-sm border border-gray-200 flex overflow-x-auto no-scrollbar">
            <button 
                onClick={() => setActiveTab('agenda')}
                className={`flex-1 min-w-[100px] py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-sm
                    ${activeTab === 'agenda' ? 'bg-yellow-400 text-black shadow-sm' : 'text-gray-500 hover:bg-gray-50'}
                `}
            >
                <Calendar size={18} /> Agenda
            </button>
            <button 
                onClick={() => setActiveTab('noticias')}
                className={`flex-1 min-w-[100px] py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-sm
                    ${activeTab === 'noticias' ? 'bg-yellow-400 text-black shadow-sm' : 'text-gray-500 hover:bg-gray-50'}
                `}
            >
                <Newspaper size={18} /> Novedades
            </button>
            <button 
                onClick={() => setActiveTab('multimedia')}
                className={`flex-1 min-w-[100px] py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-sm
                    ${activeTab === 'multimedia' ? 'bg-yellow-400 text-black shadow-sm' : 'text-gray-500 hover:bg-gray-50'}
                `}
            >
                <Video size={18} /> Videos
            </button>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-2xl">
        
        {loading && <p className="text-center text-gray-500 py-10">Cargando...</p>}

        {/* --- VISTA AGENDA --- */}
        {activeTab === 'agenda' && !loading && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center mb-2">
                <h2 className="font-bold text-gray-400 uppercase text-xs tracking-widest">Planificación Anual</h2>
                <span className="text-[10px] bg-gray-200 px-2 py-1 rounded text-gray-600">
                    {itemsFiltrados.length} actividades
                </span>
            </div>
            
            {itemsFiltrados.map((item, index) => {
              const esTentativo = item.estado === 'Tentativo';

              return (
                <div key={index} className={`
                    bg-white rounded-2xl shadow-sm border-l-8 overflow-hidden flex hover:shadow-md transition relative
                    ${esTentativo ? 'border-gray-400 bg-gray-50' : 'border-yellow-400'}
                `}>
                  {/* Fecha */}
                  <div className={`
                      min-w-[80px] flex flex-col items-center justify-center p-2 text-center border-r 
                      ${esTentativo ? 'bg-gray-100 border-gray-200' : 'bg-yellow-50 border-yellow-100'}
                  `}>
                    <span className="text-3xl font-black text-black leading-none">{getDia(item.fecha)}</span>
                    <span className="text-xs font-bold text-gray-500 uppercase mt-1">{getMes(item.fecha)}</span>
                  </div>

                  {/* Detalles */}
                  <div className="p-4 flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-gray-100 text-gray-600">
                        {item.categoria}
                      </span>
                      {/* Badge de Estado */}
                      {esTentativo ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full border border-orange-200">
                              <AlertTriangle size={10} /> POR CONFIRMAR
                          </span>
                      ) : (
                          <span className="flex items-center gap-1 text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200">
                              <CheckCircle2 size={10} /> CONFIRMADO
                          </span>
                      )}
                    </div>
                    
                    <h3 className="font-bold text-lg text-gray-900 leading-tight mb-2">{item.titulo}</h3>
                    
                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className={esTentativo ? "text-gray-400" : "text-yellow-500"} /> 
                        {item.hora}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className={esTentativo ? "text-gray-400" : "text-yellow-500"} /> 
                        {item.lugar}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 border-t pt-2 border-dashed border-gray-200">{item.descripcion}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* --- VISTA NOVEDADES (HISTÓRICO) --- */}
        {activeTab === 'noticias' && !loading && (
          <div className="space-y-6 animate-fadeIn">
             <h2 className="font-bold text-gray-400 uppercase text-xs tracking-widest mb-2">Historial de Impacto</h2>

             {itemsFiltrados.map((item, index) => (
               <div key={index} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 group">
                 {/* Imagen */}
                 {item.imagen && (
                   <div className="h-48 bg-gray-200 w-full relative overflow-hidden">
                      <img src={item.imagen} alt="Noticia" className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700" />
                      <div className="absolute top-3 left-3 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded shadow-md">
                          {item.categoria}
                      </div>
                   </div>
                 )}
                 
                 <div className="p-6">
                   <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
                      <Calendar size={12} />
                      <span>{formatearFecha(item.fecha)}</span>
                   </div>
                   
                   <h3 className="text-xl font-black text-gray-900 mb-2">{item.titulo}</h3>
                   <p className="text-gray-600 text-sm leading-relaxed">
                     {item.descripcion}
                   </p>
                 </div>
               </div>
             ))}
          </div>
        )}

        {/* --- VISTA MULTIMEDIA (VIDEOS) --- */}
        {activeTab === 'multimedia' && !loading && (
           <div className="space-y-4 animate-fadeIn">
                <h2 className="font-bold text-gray-400 uppercase text-xs tracking-widest mb-2">Videoteca Cebra</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {itemsFiltrados.map((item, index) => (
                        <a 
                            key={index} 
                            href={item.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition group block"
                        >
                            <div className="h-40 bg-black relative flex items-center justify-center">
                                <img src={item.imagen} alt="Video" className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition" />
                                <div className="absolute bg-white/20 p-3 rounded-full backdrop-blur-sm group-hover:scale-110 transition">
                                    <Video className="text-white w-8 h-8" />
                                </div>
                                {/* Icono de Red Social Pequeño */}
                                <div className="absolute bottom-2 right-2 bg-white text-black p-1 rounded-full text-xs font-bold flex items-center gap-1 px-2">
                                     {item.link.includes('youtube') ? <Youtube size={12} className="text-red-600"/> : <Facebook size={12} className="text-blue-600"/>}
                                     Ver
                                </div>
                            </div>
                            <div className="p-4">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">
                                    {item.categoria}
                                </span>
                                <h3 className="font-bold text-gray-900 leading-tight mb-2 group-hover:text-yellow-600 transition">
                                    {item.titulo}
                                </h3>
                                <div className="flex items-center gap-1 text-xs text-blue-600 font-bold">
                                    Ver video <ExternalLink size={12} />
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
           </div>
        )}

        {itemsFiltrados.length === 0 && !loading && (
            <div className="text-center py-12">
                <p className="text-gray-400 mb-2">No encontramos nada con "{busqueda}" 🦓</p>
                <button onClick={() => setBusqueda("")} className="text-yellow-600 font-bold text-sm hover:underline">
                    Borrar búsqueda
                </button>
            </div>
        )}

      </div>
    </main>
  );
}