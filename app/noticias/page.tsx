"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

import {
  Calendar, Newspaper, MapPin, Clock,
  Search, X, Youtube, Facebook, Video, ExternalLink,
  AlertTriangle, CheckCircle2, Ticket, PlusCircle, Sparkles,
  CalendarPlus, Share2, Loader2, CheckCircle, Menu, Wifi, WifiOff, User, Send, Smile, ImageIcon, Copy, Check, MessageCircle,AlertCircle,
  //videos
  Instagram, Film, PlayCircle,
  //agenda
  ChevronLeft, ChevronRight, Calendar as CalendarIcon
} from 'lucide-react';

// --- DATOS GLOBALES (Menú Hamburguesa) ---

const globalLinks = [
  { name: 'Inicio', path: '/', color: 'text-red-600', hoverBg: 'hover:bg-red-50', border: 'hover:border-red-200' },
  { name: 'Agenda', path: '/noticias', color: 'text-orange-600', hoverBg: 'hover:bg-orange-50', border: 'hover:border-orange-200' },
  { name: 'Cancionero', path: '/cancionero', color: 'text-yellow-600', hoverBg: 'hover:bg-yellow-50', border: 'hover:border-yellow-200' },
  { name: 'Recursos', path: '/recursos', color: 'text-green-600', hoverBg: 'hover:bg-green-50', border: 'hover:border-green-200' },
  { name: 'Galería', path: '/galeria', color: 'text-cyan-600', hoverBg: 'hover:bg-cyan-50', border: 'hover:border-cyan-200' },
  { name: 'Identidad', path: '/quienes-somos', color: 'text-indigo-600', hoverBg: 'hover:bg-indigo-50', border: 'hover:border-indigo-200' },
];

// --- CONFIGURACIÓN DE HOJAS (LINKS CSV) ---
const URL_HOJA_AGENDA = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ3Zwx_f4um49xKZVHWypV5XF2gGAtDgZdTmIpAH-ggays8YUAyWuwE8xdoEty-cmZvgewlmfGeFtEd/pub?gid=0&single=true&output=csv";
const URL_HOJA_NOTICIAS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ3Zwx_f4um49xKZVHWypV5XF2gGAtDgZdTmIpAH-ggays8YUAyWuwE8xdoEty-cmZvgewlmfGeFtEd/pub?gid=2037381564&single=true&output=csv";
const URL_HOJA_VIDEOS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ3Zwx_f4um49xKZVHWypV5XF2gGAtDgZdTmIpAH-ggays8YUAyWuwE8xdoEty-cmZvgewlmfGeFtEd/pub?gid=308124152&single=true&output=csv";


// --- DATOS DE RESPALDO ---
const datosRespaldo = [
  // ... (Tus datos de respaldo se mantienen igual)
  {
    id: 1,
    tipo: "Agenda",
    estado: "Confirmado",
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
    estado: "Tentativo",
    categoria: "Aniversario",
    titulo: "Cumpleaños Cebra 2025",
    fecha: "2025-11-19",
    hora: "08:00",
    lugar: "Alcaldía de La Paz",
    descripcion: "Celebración de los 24 años del programa. Preparar números artísticos.",
    imagen: "",
    link: ""
  },
  {
    id: 9,
    tipo: "Agenda",
    estado: "Confirmado",
    categoria: "Capacitación",
    titulo: "Taller de Teatro Callejero",
    fecha: "2025-10-15",
    hora: "14:30",
    lugar: "Casa de la Cultura",
    descripcion: "Taller obligatorio para el bloque de educadores urbanos.",
    imagen: "",
    link: ""
  },
  {
    id: 3,
    tipo: "Noticia",
    categoria: "Hito Histórico",
    titulo: "La Morenada Cebra",
    fecha: "2019-12-19",
    descripcion: "El día que las Cebras bailaron su propia morenada, demostrando que la cultura ciudadana también es folklore.",
    imagen: "/images/images.jpg",
    link: ""
  },
  {
    id: 4,
    tipo: "Noticia",
    categoria: "Viral",
    titulo: "Challenge Jerusalema",
    fecha: "2021-03-26",
    descripcion: "En plena pandemia, las Cebras llevaron esperanza con el baile de Jerusalema.",
    imagen: "https://placehold.co/600x400/22c55e/FFF?text=Jerusalema",
    link: "https://www.facebook.com/share/v/1AAv6gMuhd/"
  },
  {
    id: 6,
    tipo: "Video",
    categoria: "Miniserie",
    titulo: "Miniserie: Las Aventuras de la Cebra",
    fecha: "2022-01-01",
    descripcion: "Capítulo 1: El paso de cebra. Serie educativa para niños.",
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT53MftDkyAmq10SE63Lm8llmfVEWGWKTJ_rDsvdylNEQOyQC9vTY0RbqvR5hAg_qbmgH4&usqp=CAU",
    link: "https://www.youtube.com/watch?v=ylhKGIeDDqU"
  },
  {
    id: 7,
    tipo: "Video",
    categoria: "Flashmob",
    titulo: "Flashmob II - Max Paredes",
    fecha: "2018-12-18",
    descripcion: "Intervención en el macrodistrito Max Paredes.",
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7Qcig_wylFNrdqy9YbhezugXT2EUHZLwCig&s",
    link: "https://youtu.be/MJ80ngfAYSc"
  }
];

// --- HELPER: PARSER CSV ---
const parseCSV = (text, tipoPorDefecto) => {
  if (!text) return [];
  const lines = text.split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());

  return lines.slice(1).map(line => {
    const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    if (values.length < 1 || !values[0]) return null;

    const entry = { tipo: tipoPorDefecto };

    headers.forEach((header, index) => {
      let val = values[index] ? values[index].trim() : '';
      val = val.replace(/^"|"$/g, '').replace(/""/g, '"');

      if (header === 'imagenlink' || header === 'imagenminiatura') {
        entry['imagen'] = val;
      } else if (header === 'id') {
        entry['id'] = val;
      } else {
        entry[header] = val;
      }
    });

    if (!entry.titulo) return null;
    return entry;
  }).filter(item => item !== null);
};

// --- HELPER: ESTILOS DE ESTADO ---
const getEstadoConfig = (estadoRaw) => {
  const e = (estadoRaw || "").toLowerCase().trim();

  if (e.includes('curso') || e.includes('progreso')) {
    return {
      cardBorder: 'border-blue-400',
      stubBg: 'bg-blue-50',
      stubBorder: 'border-blue-200',
      badgeClass: 'bg-blue-100 text-blue-700 border-blue-200',
      icon: <Loader2 size={12} className="animate-spin" />,
      label: 'EN CURSO'
    };
  }
  if (e.includes('tentativo') || e.includes('pendiente')) {
    return {
      cardBorder: 'border-orange-300',
      stubBg: 'bg-orange-50',
      stubBorder: 'border-orange-200',
      badgeClass: 'bg-orange-100 text-orange-700 border-orange-200',
      icon: <AlertTriangle size={12} />,
      label: 'POR CONFIRMAR'
    };
  }
  if (e.includes('realizado') || e.includes('pasado') || e.includes('concluido')) {
    return {
      cardBorder: 'border-gray-300',
      stubBg: 'bg-gray-100',
      stubBorder: 'border-gray-200',
      badgeClass: 'bg-gray-100 text-gray-500 border-gray-200',
      icon: <CheckCircle size={12} />,
      label: 'REALIZADO'
    };
  }
  return {
    cardBorder: 'border-yellow-400',
    stubBg: 'bg-yellow-50',
    stubBorder: 'border-yellow-200',
    badgeClass: 'bg-green-100 text-green-700 border-green-200',
    icon: <CheckCircle2 size={12} />,
    label: 'CONFIRMADO'
  };
};

const paperTexture = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E")`;

// --- HELPERS FECHA ---
const getFechaObj = (fechaStr) => {
  if (!fechaStr) return null;
  if (fechaStr.includes('-')) { const p = fechaStr.split('-'); return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2])); }
  if (fechaStr.includes('/')) { const p = fechaStr.split('/'); return new Date(Number(p[2]), Number(p[1]) - 1, Number(p[0])); }
  return null;
};

const formatearFecha = (fechaStr) => {
  const f = getFechaObj(fechaStr);
  if (!f || isNaN(f.getTime())) return fechaStr || "";
  try {
    return new Intl.DateTimeFormat('es-BO', { day: 'numeric', month: 'short', year: 'numeric' }).format(f);
  } catch { return fechaStr; }
};

const getDia = (f) => {
  const date = getFechaObj(f);
  return (date && !isNaN(date.getTime())) ? date.getDate().toString() : "--";
};

const getMes = (f) => {
  const date = getFechaObj(f);
  if (!date || isNaN(date.getTime())) return "---";
  return new Intl.DateTimeFormat('es-BO', { month: 'short' }).format(date).toUpperCase().replace('.', '');
};

const crearLinkCalendario = (item) => {
  const titulo = encodeURIComponent(`🦓 ${item.titulo || "Evento Cebra"}`);
  const detalles = encodeURIComponent(item.descripcion || "");
  const local = encodeURIComponent(item.lugar || "");
  const fObj = getFechaObj(item.fecha);

  if (!fObj) return "#";
  const yyyy = fObj.getFullYear();
  const mm = String(fObj.getMonth() + 1).padStart(2, '0');
  const dd = String(fObj.getDate()).padStart(2, '0');
  const fechaIso = `${yyyy}${mm}${dd}`;

  const horaStr = (item.hora && item.hora.includes(':')) ? item.hora.replace(':', '') + '00' : "090000";

  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${titulo}&dates=${fechaIso}T${horaStr}/${fechaIso}T${parseInt(horaStr) + 10000}&details=${detalles}&location=${local}&sf=true&output=xml`;
};

const compartirContenido = (item) => {
  if (typeof navigator !== 'undefined' && navigator.share) {
    navigator.share({
      title: item.titulo,
      text: `Noticia Cebra 🦓: ${item.titulo}`,
      url: item.link || window.location.href,
    }).catch((error) => console.log('Error', error));
  } else {
    alert("¡Link copiado!");
  }
};

// --- COMPONENTES UI (NUEVO ESTILO) ---

// 1. Barra de Iconos Arcoíris (Para Submenús)
const RainbowIconTabs = ({ items, activeId, setActiveId }) => {
  const activeLabel = items.find(i => i.id === activeId)?.label;

  const rainbowColors = [
    { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-300', active: 'bg-red-600 text-white' },
    { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-300', active: 'bg-orange-500 text-white' },
    { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300', active: 'bg-yellow-500 text-white' },
    { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-300', active: 'bg-green-600 text-white' },
    { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-300', active: 'bg-blue-600 text-white' },
    { bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-300', active: 'bg-indigo-600 text-white' },
    { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-300', active: 'bg-purple-600 text-white' },
  ];

  return (
    <div className="flex flex-col items-center w-full px-1 ">
      {/* Fila de Iconos centrada y con wrap */}
      <div className="justify-center items-center w-full flex overflow-x-auto no-scrollbar py-2 snap-x snap-mandatory gap-2 px-4">
        {items.map((item, index) => {
          const colorObj = rainbowColors[index % rainbowColors.length];
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveId(item.id)}
              className={` snap-center shrink-0 rounded-full  text-xs font-bold whitespace-nowrap
                                relative transition-all duration-300 flex items-center justify-center shrink-0 border
                                ${isActive
                  ? `${colorObj.active} border-transparent shadow-md px-3 py-1.5 scale-105`
                  : `${colorObj.bg} ${colorObj.text} ${colorObj.border} opacity-90 hover:opacity-100 p-2`
                }
                            `}
            >
              {/* Si es texto (meses), se muestra el texto. Si es icono, se muestra el icono */}
              {item.icon ? React.cloneElement(item.icon, { size: isActive ? 18 : 18 }) : <span className="text-xs font-bold">{item.label}</span>}

              {/* Si tiene icono, mostrar label solo al activar */}
              {item.icon && isActive && (
                <span className="ml-1.5 text-[10px] font-bold whitespace-nowrap animate-fadeIn leading-none">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Título de la sección activa */}
      {items[0].icon && (
        <div className="text-center mt-2 h-4 mb-1">
          {!items.find(i => i.id === activeId)?.label.includes(activeLabel) && (
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-0.5">
              {activeLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// 2. Barra de Navegación Móvil Neutra
const MobileNeutralNavBar = ({ items, activeId, setActiveId, setBusqueda }) => {
  return (
    <div className="bg-white p-1 rounded-2xl shadow-sm border border-gray-100 flex justify-center gap-1 w-full max-w-sm mx-auto">
      {items.map((item) => {
        const isActive = activeId === item.id;
        return (
          <button
            key={item.id}
            onClick={() => { setActiveId(item.id); setBusqueda(""); }}
            className={`
                            flex-1 py-2 px-1 rounded-xl font-bold flex flex-col items-center justify-center gap-0.5 transition-all
                            ${isActive
                ? 'bg-gray-900 text-white shadow-md'
                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
              }
                        `}
          >
            {React.cloneElement(item.icon, { size: 18 })}
            <span className="text-[9px] uppercase tracking-wide">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// 3. Barra de Navegación PC
const DesktopNavBar = ({ items, activeId, setActiveId, setBusqueda }) => {
  return (
    <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 flex justify-center gap-1 w-full">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => { setActiveId(item.id); setBusqueda(""); }}
          className={`
                        flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-sm whitespace-nowrap
                        ${activeId === item.id
              ? 'bg-gray-900 text-white shadow-md'
              : 'text-gray-500 hover:bg-gray-50'
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

const SkeletonCard = () => (
  <div className="bg-white rounded-[2rem] p-4 shadow-sm border-2 border-gray-100 animate-pulse flex flex-col sm:flex-row gap-4 h-auto sm:h-40">
    <div className="w-full sm:w-28 bg-gray-200 rounded-xl h-32 sm:h-auto shrink-0"></div>
    <div className="flex-1 space-y-3 py-2 w-full">
      <div className="h-6 bg-gray-200 rounded-lg w-3/4"></div>
      <div className="h-10 bg-gray-200 rounded-xl w-full"></div>
    </div>
  </div>
);

// --- COMPONENTE: MODAL COMUNIDAD ---
const ModalComunidad = ({ isOpen, onClose }) => {
  const [enviado, setEnviado] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    tipo: 'Agenda',
    fecha: '',
    autor: '',
    detalle: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numeroCelular = "59170000000"; // Reemplaza con tu número real
    const mensajeWhatsApp = `Hola Cebra 🦓, tengo una noticia/evento para la pizarra:

📌 *Título:* ${formData.titulo}
📂 *Tipo:* ${formData.tipo}
📅 *Fecha:* ${formData.fecha || "No definida"}
👤 *De parte de:* ${formData.autor || "Anónimo"}
📝 *Detalle:* ${formData.detalle || "-"}`;

    const url = `https://wa.me/${numeroCelular}?text=${encodeURIComponent(mensajeWhatsApp)}`;
    window.open(url, '_blank');

    setEnviado(true);
    setTimeout(() => {
      setEnviado(false);
      setFormData({ titulo: '', tipo: 'Agenda', fecha: '', autor: '', detalle: '' });
      onClose();
    }, 3500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative transform transition-all scale-100 flex flex-col max-h-[90vh]">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-red-500 z-10 p-1 bg-white/50 rounded-full">
          <X size={24} />
        </button>

        {!enviado ? (
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="inline-block relative">
                  <div className="w-16 h-16 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border-2 border-yellow-200">
                    <Newspaper size={32} className="animate-pulse" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Comunidad
                  </div>
                </div>
                <h2 className="text-2xl font-black text-gray-800">¡Publicar Algo!</h2>
                <p className="text-gray-500 text-sm mt-1">¿Sabes de un evento o noticia Cebra? Cuéntanos.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <User size={12} /> Reportero Cebra
                  </h3>
                  <div>
                    <input required name="autor" value={formData.autor} onChange={handleChange} type="text" placeholder="Tu nombre o apodo" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-yellow-400 focus:outline-none text-sm" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Título</label>
                    <input required name="titulo" value={formData.titulo} onChange={handleChange} type="text" placeholder="Ej: Aniversario del Macro Sur" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-400 focus:outline-none" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Tipo</label>
                      <select name="tipo" value={formData.tipo} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-400 focus:outline-none">
                        <option>Agenda</option>
                        <option>Noticia</option>
                        <option>Video/Foto</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Fecha (Aprox)</label>
                      <input name="fecha" value={formData.fecha} onChange={handleChange} type="date" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-400 focus:outline-none text-sm" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Detalle o Link</label>
                    <textarea name="detalle" value={formData.detalle} onChange={handleChange} rows={2} placeholder="Descripción, lugar, o link de la noticia..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-400 focus:outline-none"></textarea>
                  </div>
                </div>

                <button type="submit" className="w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 group shadow-lg">
                  <Send size={18} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" /> Enviar por WhatsApp
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="p-10 text-center bg-yellow-50 h-full flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mb-6 animate-bounce shadow-lg border-4 border-white">
              <Smile size={40} className="text-black" />
            </div>
            <h3 className="text-3xl font-black text-gray-800 mb-2">¡Gracias!</h3>
            <p className="text-gray-600 mb-6 max-w-xs mx-auto">Te estamos redirigiendo a WhatsApp para recibir tu reporte.</p>
          </div>
        )}
      </div>
    </div>
  );
};
//agendaCalendar
// --- COMPONENTE CALENDARIO TIPO GOOGLE ---
// --- COMPONENTE CALENDARIO (VERSION ESCRITORIO SPLIT + MOVIL STACK) ---
const AgendaCalendar = ({ items, busqueda = "" }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  // NUEVO ESTADO: Controla si vemos solo el día o todo el mes
  const [viewAllMonth, setViewAllMonth] = useState(false);

  const isSearching = busqueda.length > 0;

  // --- FIX DE FECHAS ---
  const parseFechaLocal = (fechaStr) => {
    if (!fechaStr) return null;
    if (typeof fechaStr === 'string' && fechaStr.length === 10 && fechaStr.includes('-')) {
      const [year, month, day] = fechaStr.split('-').map(Number);
      return new Date(year, month - 1, day);
    }
    return new Date(fechaStr);
  };

  // 1. Obtener días
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay };
  };

  const { days, firstDay } = getDaysInMonth(selectedDate);
  const daysArray = Array.from({ length: days }, (_, i) => i + 1);
  const dayNames = ["D", "L", "M", "M", "J", "V", "S"];

  // Helper visual
  const formatearFecha = (fechaStr) => {
    const date = parseFechaLocal(fechaStr);
    if (!date) return "";
    return new Intl.DateTimeFormat('es-BO', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
  };

  // 2. LÓGICA DE FILTRADO
  const eventosA_Mostrar = useMemo(() => {
    // A. MODO BÚSQUEDA (Prioridad 1)
    if (isSearching) {
      const termino = busqueda.toLowerCase();
      return items.filter(item => {
        const titulo = (item.titulo || "").toLowerCase();
        const desc = (item.descripcion || "").toLowerCase();
        const cat = (item.categoria || "").toLowerCase();
        let fechaLegible = "";
        let fechaCorta = "";
        const f = parseFechaLocal(item.fecha);

        if (f && !isNaN(f)) {
          fechaLegible = new Intl.DateTimeFormat('es-BO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(f).toLowerCase();
          fechaCorta = f.toLocaleDateString('es-BO');
        }
        return titulo.includes(termino) || desc.includes(termino) || cat.includes(termino) || fechaLegible.includes(termino) || fechaCorta.includes(termino);
      }).sort((a, b) => {
        const dateA = parseFechaLocal(a.fecha) || new Date(0);
        const dateB = parseFechaLocal(b.fecha) || new Date(0);
        return dateB - dateA;
      });
    }

    // B. MODO "VER TODO EL MES" (Prioridad 2)
    if (viewAllMonth) {
      return items.filter(item => {
        const f = parseFechaLocal(item.fecha);
        if (!f || isNaN(f)) return false;
        // Coincidir solo Mes y Año
        return f.getMonth() === selectedDate.getMonth() &&
          f.getFullYear() === selectedDate.getFullYear();
      }).sort((a, b) => {
        // Orden ascendente (1, 2, 3...) para el mes
        const dateA = parseFechaLocal(a.fecha) || new Date(0);
        const dateB = parseFechaLocal(b.fecha) || new Date(0);
        return dateA - dateB;
      });
    }

    // C. MODO NORMAL: DÍA SELECCIONADO (Prioridad 3)
    return items.filter(item => {
      const f = parseFechaLocal(item.fecha);
      if (!f || isNaN(f)) return false;
      return f.getDate() === selectedDate.getDate() &&
        f.getMonth() === selectedDate.getMonth() &&
        f.getFullYear() === selectedDate.getFullYear();
    });

  }, [items, busqueda, selectedDate, isSearching, viewAllMonth]); // Agregamos viewAllMonth a dependencias

  // Navegación
  const prevMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
    setViewAllMonth(false); // Reset al cambiar mes
  };
  const nextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
    setViewAllMonth(false); // Reset al cambiar mes
  };

  // Función al hacer click en un día
  const handleDayClick = (date) => {
    setSelectedDate(date);
    setViewAllMonth(false); // IMPORTANTE: Al hacer click en un día, desactivamos "ver todo"
  };

  // Título dinámico de la lista derecha
  const getListTitle = () => {
    if (isSearching) return "Resultados de búsqueda";
    if (viewAllMonth) return `Eventos de ${new Intl.DateTimeFormat('es-BO', { month: 'long' }).format(selectedDate)}`;
    return "Eventos del día";
  };

  const getListSubtitle = () => {
    if (isSearching) return `Encontrados: ${eventosA_Mostrar.length} coincidencias`;
    if (viewAllMonth) return "Mostrando todo el mes";
    return new Intl.DateTimeFormat('es-BO', { weekday: 'long', day: 'numeric', month: 'long' }).format(selectedDate);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

      {/* CALENDARIO IZQUIERDO */}
      <div className={`bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden p-6 md:sticky md:top-24 transition-opacity duration-300 ${isSearching ? 'opacity-50 grayscale pointer-events-none' : 'opacity-100'}`}>

        <div className="flex justify-between items-center mb-6">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full transition"><ChevronLeft /></button>
          <h3 className="text-xl font-black text-slate-800 capitalize">
            {new Intl.DateTimeFormat('es-BO', { month: 'long', year: 'numeric' }).format(selectedDate)}
          </h3>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full transition"><ChevronRight /></button>
        </div>

        <div className="grid grid-cols-7 mb-2 text-center">
          {dayNames.map((d, i) => <div key={i} className="text-xs font-black text-gray-300 py-2">{d}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {Array(firstDay).fill(null).map((_, i) => <div key={`empty-${i}`} />)}

          {daysArray.map((day) => {
            const currentDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
            const now = new Date();

            // Lógica de estados
            // Si "viewAllMonth" está activo, NINGÚN día específico está seleccionado visualmente
            const isSelected = !isSearching && !viewAllMonth && day === selectedDate.getDate();
            const isToday = day === now.getDate() && selectedDate.getMonth() === now.getMonth() && selectedDate.getFullYear() === now.getFullYear();

            const hasEvents = !isSearching && items.some(item => {
              const f = parseFechaLocal(item.fecha);
              return f && f.getDate() === day && f.getMonth() === selectedDate.getMonth();
            });

            let buttonClasses = "relative h-12 w-10 flex flex-col items-center justify-center text-sm transition-all mx-auto rounded-lg ";

            if (isSelected) {
              buttonClasses += "bg-slate-900 text-white shadow-lg scale-110 font-bold z-10";
            } else if (isToday) {
              buttonClasses += "bg-blue-50 text-blue-600 font-bold border border-blue-100";
            } else {
              buttonClasses += "text-gray-600 hover:bg-gray-100";
            }

            if (hasEvents && !isSelected && !isToday) {
              buttonClasses += " font-black text-slate-800";
            }

            return (
              <button
                key={day}
                onClick={() => handleDayClick(currentDate)} // Usamos el nuevo handler
                className={buttonClasses}
              >
                <span className="leading-none">{day}</span>
                {hasEvents && (
                  <div className={`h-[3px] w-5 rounded-full mt-1 ${isSelected ? 'bg-white/50' : 'bg-red-500'}`}></div>
                )}
              </button>
            );
          })}
        </div>
        {isSearching && <div className="text-center text-xs text-gray-400 mt-4 italic">Calendario desactivado durante la búsqueda</div>}
      </div>

      {/* RESULTADOS DERECHA */}
      <div className="space-y-4 animate-fadeIn min-h-[300px]">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
          <div className={`p-2 rounded-lg transition-colors ${isSearching ? 'bg-slate-50 text-amber-600' : 'bg-red-100 text-red-600'}`}>
            {isSearching ? <Search size={20} /> : <Calendar size={20} />}
          </div>
          <div>
            <h4 className="font-black text-slate-800 text-lg capitalize">
              {getListTitle()}
            </h4>
            <p className="text-xs text-gray-500 capitalize font-medium">
              {getListSubtitle()}
            </p>
          </div>
        </div>

        {eventosA_Mostrar.length > 0 ? (
          <div className="space-y-3">
            {eventosA_Mostrar.map((item, index) => (
              <div key={`${item.id || 'evt'}-${index}`} className="relative group">
                {/* Mostramos fecha si buscamos O si estamos viendo todo el mes */}
                {(isSearching || viewAllMonth) && (
                  <div className="text-[10px] font-bold text-gray-400 uppercase mb-1 ml-2">
                    {formatearFecha(item.fecha)}
                  </div>
                )}
                <AgendaCardDetalle item={item} />
              </div>
            ))}
            {/* Botón opcional al final de la lista del mes */}
            {viewAllMonth && (
              <button
                onClick={() => setViewAllMonth(false)}
                className="w-full py-2 text-xs text-blue-500 font-bold hover:bg-blue-50 rounded-lg transition"
              >
                Volver a ver por día
              </button>
            )}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-[2rem] border border-dashed border-gray-300 flex flex-col items-center justify-center">
            <div className="bg-gray-50 p-4 rounded-full mb-3">
              {isSearching ? <Search className="text-gray-300" /> : <Calendar className="text-gray-300" />}
            </div>
            <p className="text-gray-500 font-medium">
              {isSearching
                ? `No encontramos eventos con "${busqueda}"`
                : "No hay eventos para este día."}
            </p>

            {/* --- AQUÍ ESTÁ EL BOTÓN QUE PEDISTE --- */}
            {!isSearching && !viewAllMonth && (
              <div className="mt-4">
                <button
                  onClick={() => setViewAllMonth(true)}
                  className="px-6 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl shadow-lg hover:bg-slate-800 hover:scale-105 transition active:scale-95 flex items-center gap-2"
                >
                  Ver agenda de {new Intl.DateTimeFormat('es-BO', { month: 'long' }).format(selectedDate)}
                </button>
                <p className="text-[10px] text-gray-400 mt-2 max-w-[200px] mx-auto leading-tight">
                  Haz clic para ver todos los eventos disponibles en este mes.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

//fin agenda Canlendar
// --- COMPONENTE FALTANTE: AgendaCardDetalle ---
const AgendaCardDetalle = ({ item }) => {

  // 1. Función para formatear la hora (Prioriza item.hora "19:00" -> "07:00 p.m.")
  const getHoraFormat = () => {
    // A. Si tienes un campo hora específico (ej: "19:00")
    if (item.hora && item.hora.includes(':')) {
      try {
        const [hStr, mStr] = item.hora.split(':');
        let h = parseInt(hStr, 10);
        const ampm = h >= 12 ? 'p.m.' : 'a.m.';
        h = h % 12 || 12;
        return `${h < 10 ? '0' + h : h}:${mStr} ${ampm}`; // Retorna "07:00 p.m."
      } catch (e) { return item.hora; }
    }

    // B. Si solo tienes fecha ISO, intentamos extraer la hora (Fallback)
    if (item.fecha && item.fecha.length > 10) {
      try {
        const d = new Date(item.fecha);
        return d.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' });
      } catch (e) { return "--:--"; }
    }

    return "Todo el día"; // Si no hay hora
  };

  // 2. Función para los colores del ESTADO
  const getEstiloEstado = (estado) => {
    const e = (estado || "").toLowerCase();
    switch (e) {
      case 'realizado':
        return 'bg-green-100 text-green-700 border-green-200'; // Verde
      case 'en curso':
        return 'bg-blue-100 text-blue-700 border-blue-200 animate-pulse'; // Azul pulsando
      case 'tentativo':
        return 'bg-amber-50 text-amber-600 border-amber-200 border-dashed'; // Naranja/Amarillo
      case 'confirmado':
        return 'bg-slate-100 text-slate-700 border-slate-200'; // Gris solido
      default:
        return 'bg-gray-50 text-gray-400 border-gray-100';
    }
  };

  // 3. Función para los colores de la CATEGORÍA
  const getEstiloCategoria = (cat) => {
    const c = (cat || "").toLowerCase();
    if (c.includes('navidad')) return 'text-red-600 bg-red-50';
    if (c.includes('deporte')) return 'text-orange-600 bg-orange-50';
    if (c.includes('cultura')) return 'text-purple-600 bg-purple-50';
    return 'text-gray-500 bg-gray-50';
  };

  // 4. Función para generar el enlace de WhatsApp
  const handleShare = () => {
    const hora = getHoraFormat();
    // Construimos el mensaje con formato de WhatsApp (*negrita*, _cursiva_)
    const texto = `📅 *${item.titulo}*\n` +
      `⏰ ${hora}\n` +
      `📍 ${item.lugar || 'Ubicación por confirmar'}\n\n` +
      `ℹ️ ${item.descripcion || ''}`;

    // encodeURIComponent asegura que los espacios y tildes funcionen bien
    const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
  };
  return (
    <div className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow mb-3 items-stretch relative overflow-hidden">

      {/* --- COLUMNA 1: HORA (Izquierda) --- */}
      <div className="flex flex-col items-center justify-center min-w-[4rem] border-r border-gray-100 pr-3 my-1">
        <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Hora</span>
        <div className="text-center">
          {/* Divide la hora en dos líneas para mejor lectura */}
          <span className="block text-lg font-black text-slate-800 leading-none">
            {getHoraFormat().split(' ')[0]}
          </span>
          <span className="block text-[10px] font-bold text-gray-400 uppercase mt-0.5">
            {getHoraFormat().split(' ')[1] || ''}
          </span>
        </div>
      </div>

      {/* --- COLUMNA 2: DETALLES (Centro) --- */}
      <div className="flex-1 flex flex-col justify-center py-0.5">
        <h4 className="font-black text-slate-800 leading-tight text-base mb-1 pr-2">
          {item.titulo}
        </h4>

        {item.descripcion && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-2 leading-relaxed">
            {item.descripcion}
          </p>
        )}

        {item.lugar && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            {item.lugar}
          </div>
        )}
      </div>

      {/* --- COLUMNA 3: ESTADO Y CATEGORIA (Derecha) --- */}
      <div className="flex flex-col items-end justify-start gap-2 min-w-[fit-content] pl-2">

        {/* Bloque superior: Estado y Categoría */}
        <div className="flex flex-col items-end gap-2">
          {/* ESTADO (Arriba) */}
          {item.estado && (
            <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide border ${getEstiloEstado(item.estado)}`}>
              {item.estado}
            </span>
          )}

          {/* CATEGORÍA (Abajo) */}
          {item.categoria && (
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${getEstiloCategoria(item.categoria)}`}>
              {item.categoria}
            </span>
          )}
        </div>
      </div>
      {/* Bloque inferior: Botón Compartir (Solo aparece en hover del grupo en PC, o siempre visible en móvil si prefieres) */}
      <button
        onClick={handleShare}
        className="mt-2 p-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 hover:scale-110 transition-all border border-green-100 group-hover:opacity-100 opacity-80"
        title="Compartir en WhatsApp"
      >
        <Share2 size={16} />
      </button>
    </div>

  );
};
// --- PÁGINA PRINCIPAL ---
export default function Noticias() {
  const [activeTab, setActiveTab] = useState('agenda');
  const [items, setItems] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [filtroMes, setFiltroMes] = useState("Todos");

  //Menu hamburguesa
  const [isScrolled, setIsScrolled] = useState(false);
  const [globalMenuOpen, setGlobalMenuOpen] = useState(false);
  //wifi
  const [usingOnlineData, setUsingOnlineData] = useState(false);

  // ... (EFFECTS DE CARGA IGUALES) ...
  // Solo agregaré la función manual de recarga
  const recargarDatos = () => {
    setLoading(true);
    // ... tu lógica de fetch aquí ...
    // Simulación rápida para el ejemplo:
    setTimeout(() => setLoading(false), 1000);
  };
  // Definición de las pestañas principales para el menú  o mainTabs
  const menuPrincipalItems = [
    { id: 'agenda', label: 'Agenda', icon: <Calendar size={18} /> },
    { id: 'noticia', label: 'Novedades', icon: <Newspaper size={18} /> },
    { id: 'video', label: 'Videos', icon: <Video size={18} /> },
  ];

  // Efecto de scroll automático al cambiar de pestaña
  useEffect(() => {
    if (activeTab || busqueda) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeTab, busqueda]);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      if (!URL_HOJA_AGENDA && !URL_HOJA_NOTICIAS && !URL_HOJA_VIDEOS) {
        setItems(datosRespaldo);
        setLoading(false);
        return;
      }
      try {
        const timestamp = new Date().getTime(); // Cache buster
        const [resAgenda, resNoticias, resVideos] = await Promise.all([
          URL_HOJA_AGENDA ? fetch(`${URL_HOJA_AGENDA}&t=${timestamp}`).then(r => r.text()) : Promise.resolve(""),
          URL_HOJA_NOTICIAS ? fetch(`${URL_HOJA_NOTICIAS}&t=${timestamp}`).then(r => r.text()) : Promise.resolve(""),
          URL_HOJA_VIDEOS ? fetch(`${URL_HOJA_VIDEOS}&t=${timestamp}`).then(r => r.text()) : Promise.resolve("")
        ]);
        const agenda = parseCSV(resAgenda, "Agenda");
        const noticias = parseCSV(resNoticias, "Noticia");
        const videos = parseCSV(resVideos, "Video");
        const todos = [...agenda, ...noticias, ...videos];
        setItems(todos.length > 0 ? todos : datosRespaldo);
      } catch (error) {
        setItems(datosRespaldo);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);
  // --- CARGA DE DATOS ---
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const timestamp = new Date().getTime();
        const [resAgenda, resNoticias, resVideos] = await Promise.all([
          fetch(`${URL_HOJA_AGENDA}&t=${timestamp}`).then(r => r.text()),
          fetch(`${URL_HOJA_NOTICIAS}&t=${timestamp}`).then(r => r.text()),
          fetch(`${URL_HOJA_VIDEOS}&t=${timestamp}`).then(r => r.text())
        ]);
        const agenda = parseCSV(resAgenda, "Agenda");
        const noticias = parseCSV(resNoticias, "Noticia");
        const videos = parseCSV(resVideos, "Video");
        const todos = [...agenda, ...noticias, ...videos];
        if (todos.length > 0) {
          setItems(todos);
          setUsingOnlineData(true); // ¡ÉXITO! Wifi verde
        } else {
          throw new Error("Sin datos");
        }
      } catch (error) {
        console.error("Error fetching:", error);
        setItems(datosRespaldo);
        setUsingOnlineData(false); // ¡ERROR! Wifi rojo
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);
  // Scroll Listener
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  // --- CARGA DE DATOS PARA GUÍA DE SERVICIOS ---
  const mesesDisponibles = useMemo(() => {
    const meses = items
      .filter(i => (i.tipo === 'Agenda') && i.fecha)
      .map(i => {
        const f = getFechaObj(i.fecha);
        // Paso 1: Obtener el mes y forzar Primera mayúscula inmediatamente
        if (!f) return null;
        const nombreMes = new Intl.DateTimeFormat('es-BO', { month: 'long' }).format(f);
        return nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1);
      }).filter(Boolean);
    // Paso 2: El Set ahora filtra correctamente porque los textos ya son idénticos ("Marzo", "Marzo")
    // Paso 2: El Set ahora filtra correctamente porque los textos ya son idénticos ("Marzo", "Marzo")
    const unicos = Array.from(new Set(meses));

    // Paso 3: Retornar estructura
    return ["Todos", ...unicos].map((m, index) => ({
      id: m,      // La ID es el nombre del mes
      label: m,
      icon: null,
      key: `tab-${m}-${index}` // Añadimos key explicita interna por seguridad
    }));
  }, [items]);
  //fin meses disponibles

  // --- FILTRADO DE ITEMS SEGÚN ESTADO ACTUAL ---
  const itemsFiltrados = useMemo(() => {
    const filtrados = items.filter(item => {
      const tipoItem = (item.tipo || "").toLowerCase();
      const tituloItem = (item.titulo || "").toLowerCase();
      const descItem = (item.descripcion || "").toLowerCase();
      const catItem = (item.categoria || "").toLowerCase();
      const fechaItem = (item.fecha || "");
      const fechaFormat = formatearFecha(item.fecha || "").toLowerCase();

      let coincideTipo = false;
      if (activeTab === 'agenda') coincideTipo = tipoItem === 'agenda';
      if (activeTab === 'noticia') coincideTipo = tipoItem === 'noticia';
      if (activeTab === 'video') coincideTipo = tipoItem === 'video';

      const textoBusqueda = busqueda.toLowerCase();
      const coincideTexto =
        tituloItem.includes(textoBusqueda) ||
        descItem.includes(textoBusqueda) ||
        catItem.includes(textoBusqueda) ||
        fechaItem.includes(textoBusqueda) ||
        fechaFormat.includes(textoBusqueda);

      let coincideMes = true;
      if (activeTab === 'agenda' && filtroMes !== "Todos" && item.fecha) {
        const f = getFechaObj(item.fecha);
        if (f) {
          const mesItem = new Intl.DateTimeFormat('es-BO', { month: 'long' }).format(f);
          coincideMes = mesItem.charAt(0).toUpperCase() + mesItem.slice(1) === filtroMes;
        } else { coincideMes = false; }
      }
      return coincideTipo && coincideTexto && coincideMes;
    });

    return filtrados.sort((a, b) => {
      const dateA = getFechaObj(a.fecha);
      const dateB = getFechaObj(b.fecha);
      const timeA = dateA ? dateA.getTime() : 0;
      const timeB = dateB ? dateB.getTime() : 0;
      return timeB - timeA;
    });

  }, [items, activeTab, busqueda, filtroMes]);
  //menu hamburguesa scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

// ... dentro de tu componente ...
const [openShareId, setOpenShareId] = useState(null); // Estado para el menú compartir
const [copiedId, setCopiedId] = useState(null);       // Estado para feedback de copiar

// Funciones auxiliares para compartir
const toggleShare = (id) => setOpenShareId(openShareId === id ? null : id);

const handleCopyLink = (text, id) => {
  navigator.clipboard.writeText(text).then(() => {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  });
};

// 1. NUEVA FUNCIÓN DE COPIADO ROBUSTA (Soluciona el TypeError)
const copyToClipboard = async (text, id) => {
  try {
    // Intento A: API Moderna (requiere HTTPS)
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } else {
      throw new Error('Clipboard API no disponible');
    }
  } catch (err) {
    // Intento B: Fallback tradicional (Crea un elemento invisible, copia y lo borra)
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed"; // Evitar scroll
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (errFallback) {
      console.error('No se pudo copiar', errFallback);
      alert('No pudimos copiar el enlace automáticamente. Por favor selecciónalo manualmente.');
    }
    document.body.removeChild(textArea);
  }
};

// 2. FUNCIÓN PARA EXTRAER MINIATURA DE YOUTUBE
const getThumbnail = (link, manualImage) => {
  // Si ya definiste una imagen manual en tu Excel/DB, úsala primero
  if (manualImage && manualImage.length > 5) return manualImage;

  if (!link) return null;

  // Lógica para YouTube (Soporta youtu.be y youtube.com)
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = link.match(youtubeRegex);

  if (match && match[1]) {
    // Retorna la imagen de alta calidad de YouTube
    return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
  }

  // Si es Facebook/Insta y no hay imagen manual, retornamos null para mostrar un placeholder bonito
  return null;
};
  return (
    <main className="min-h-screen bg-slate-50 pb-32 font-sans " style={{ backgroundImage: paperTexture }}>
      {/* --- MENU GLOBAL (OVERLAY) --- */}
      {/* Se sobrepone a TODO el contenido */}
      {globalMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md animate-fadeIn flex justify-end">
          <div className="w-full md:w-96  shadow-2xl animate-slideInRight">
            <div className="p-4 flex justify-between items-center border-b border-slate-100 bg-slate-50">
              <h2 className="text-xl font-black text-slate-800">Menú Global</h2>
              <button
                onClick={() => setGlobalMenuOpen(false)}
                className="p-2 bg-red-100 text-red-500 rounded-full hover:bg-red-200 transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-slate-50 ">
              {globalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={() => setGlobalMenuOpen(false)}
                  className={`flex items-center justify-between p-2 rounded-2xl transition-all font-black text-lg border-2
                                ${link.path === '/noticias'
                      ? 'bg-slate-900 border-slate-900 text-white shadow-lg'

                      : `bg-slate-50 border-transparent text-black ${link.hoverBg} hover:border-slate-200 ${link.color} ${link.border}`}

                            `}
                >
                  <span>{link.name}</span>
                  {link.path === '/noticias' && <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>}
                </Link>
              ))}
            </div>

            <div className="bg-slate-50 p-8 text-center mt-auto border-t border-slate-100">
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
      {/* HEADER STICKY */}
      <div className="sticky top-0 z-50 bg-slate-50/95 backdrop-blur-sm shadow-sm transition-all  pb-2">
        <section className="bg-gradient-to-br from-red-700 via-orange-500 to-red-700 p-2 pt-3 rounded-b-[2.5rem] shadow-lg mb-4 text-center relative overflow-hidden z-20">
          {/* Textura de fondo unificada */}
          <div className="absolute top-0 left-0 w-full h-full opacity-70 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="relative z-10 flex flex-col items-center">
            {/* Indicador Wifi Integrado */}
            <div className="absolute top-0 left-4 p-2 bg-white/10 rounded-b-xl backdrop-blur-sm">
              {usingOnlineData ? <Wifi size={16} className="text-green-200" /> : <WifiOff size={16} className="text-red-300" />}
            </div>
            <div className="bg-white/20 p-2 rounded-full mb-2 backdrop-blur-sm border-2 border-white/30 animate-bounce shadow-inner"><Newspaper className="w-8 h-8 text-white" /></div>
            <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-md">Pizarra Cebra</h1>
            <p className="text-red-100 font-medium text-sm">Noticias y Actualidad.</p>

            <div className="w-full max-w-md relative group mt-2 ">
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

        {/* MENÚ PRINCIPAL (Adaptable) */}
        <div className="container mx-auto px-4 max-w-2xl mb-2 relative z-10">
          <div className="md:hidden">
            <MobileNeutralNavBar items={menuPrincipalItems} activeId={activeTab} setActiveId={setActiveTab} setBusqueda={setBusqueda} />
          </div>
          <div className="hidden md:block">
            <DesktopNavBar items={menuPrincipalItems} activeId={activeTab} setActiveId={setActiveTab} setBusqueda={setBusqueda} />
          </div>
        </div>

        {/* SUBMENÚ ARCOÍRIS PARA FILTRO DE MESES (AGENDA) */}
        {/* {activeTab === 'agenda' && !loading && (
          <div className="container mx-auto px-4 max-w-2xl">
            <RainbowIconTabs
              items={mesesDisponibles}
              activeId={filtroMes}
              setActiveId={setFiltroMes}
              setOpenItem={() => { }} // No necesario aquí
            />
          </div>
        )}*/}
        {/* BOTÓN FLOTANTE MENU HAMBURGUESA */}
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

      {/* LÓGICA: Si es agenda, usa max-w-7xl (muy ancho), si no, usa max-w-lg (estrecho móvil) */}
      <div className={`px-4 space-y-4 mx-auto transition-all duration-500${activeTab === 'noticia' ? 'w-full px-4 md:px-12' : // Noticia: Ancho TOTAL
        activeTab === 'agenda' ? 'max-w-7xl' :             // Agenda: Ancho Grande
          'max-w-3xl'                                        // Video/Otros: Ancho Medio (Mejor que lg)
        }`}>
        {/* --- MENSAJES DE ESTADO --- */}
        {!URL_HOJA_AGENDA && !loading && (
          <div className="mb-4 p-3 bg-blue-50 text-blue-700 text-xs rounded-xl border border-blue-200 text-center">
            Modo Demo: Configura las URLs de Google Sheets.
          </div>
        )}

        {loading && (
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {/* --- VISTA 1: AGENDA (Calendario) --- */}
        {!loading && activeTab === 'agenda' && (
          <div className="mt-4 px-1 md:px-8">
            {/* --- VISTA 1: AGENDA (Calendario) --- 
            <AgendaCalendar items={items.filter((i) => i.tipo === 'Agenda')} /> */}
            <AgendaCalendar
              items={items.filter((i) => i.tipo === 'Agenda')}
              busqueda={busqueda} // <--- AGREGAMOS ESTO
            />
          </div>
        )}

        {/* --- VISTA 2: NOTICIAS (Grid Responsivo) --- */}
        {/* --- VISTA 2: NOTICIAS (FULL WIDTH + SMART SHARE) --- */}
        {!loading && activeTab === 'noticia' && (
          <div className="animate-fadeIn pb-12">
            {/* GRID RESPONSIVO: De 1 col en móvil a 5 en pantallas gigantes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">

              {itemsFiltrados.map((item, index) => {
                const uniqueId = item.id || `noticia-${index}`;
                const urlACompartir = item.link || window.location.href;
                const isMenuOpen = openShareId === uniqueId;

                return (
                  <div
                    key={uniqueId}
                    className="flex flex-col bg-white rounded-[1.5rem] shadow-sm hover:shadow-2xl border border-gray-100 group transition-all duration-300 transform hover:-translate-y-1 overflow-visible relative"
                    onMouseLeave={() => setOpenShareId(null)} // Cierra menú al salir el mouse
                  >
                    {/* IMAGEN */}
                    <div className="relative h-48 w-full overflow-hidden rounded-t-[1.5rem] bg-gray-100">
                      {item.imagen ? (
                        <img
                          src={item.imagen}
                          alt={item.titulo}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300">
                          <ImageIcon size={40} />
                        </div>
                      )}

                      {/* Categoría */}
                      {item.categoria && (
                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-slate-900 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md shadow-sm pointer-events-none">
                          {item.categoria}
                        </div>
                      )}

                      {/* --- BOTÓN Y MENÚ COMPARTIR --- */}
                      <div className="absolute top-3 right-3 z-20">
                        <button
                          onClick={() => toggleShare(uniqueId)}
                          className={`p-2 rounded-full transition-all shadow-sm border backdrop-blur-sm ${isMenuOpen
                              ? 'bg-slate-900 text-white border-slate-900 scale-110'
                              : 'bg-white/90 text-slate-700 border-white/50 hover:text-blue-600 hover:scale-110'
                            }`}
                        >
                          <Share2 size={16} />
                        </button>

                        {/* POPUP MENU */}
                        {isMenuOpen && (
                          <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-30 animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-1">
                            <a
                              href={`https://wa.me/?text=${encodeURIComponent(`${item.titulo} ${urlACompartir}`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors font-medium"
                            >
                              <MessageCircle size={16} /> WhatsApp
                            </a>
                            <button
                              onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlACompartir)}`, '_blank', 'width=600,height=400')}
                              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors font-medium w-full text-left"
                            >
                              <Facebook size={16} /> Facebook
                            </button>
                            <div className="h-px bg-gray-100 my-1"></div>
                            <button
                              onClick={() => handleCopyLink(urlACompartir, uniqueId)}
                              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors font-medium w-full text-left"
                            >
                              {copiedId === uniqueId ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                              {copiedId === uniqueId ? <span className="text-green-600 font-bold">¡Copiado!</span> : "Copiar enlace"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* CONTENIDO TEXTO */}
                    <div className="flex flex-col flex-1 p-5">
                      <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                        <Calendar size={12} />
                        <span>{formatearFecha(item.fecha)}</span>
                      </div>

                      <h3 className="text-lg font-black text-slate-800 mb-2 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                        {item.titulo}
                      </h3>

                      <p className="text-gray-500 text-xs leading-relaxed font-medium line-clamp-3 mb-4 flex-1">
                        {item.descripcion}
                      </p>

                      {item.link ? (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-full py-2.5 px-4 bg-slate-50 text-slate-700 font-bold rounded-xl hover:bg-slate-900 hover:text-white transition-all duration-300 group/btn gap-2 text-xs uppercase tracking-wide"
                        >
                          Leer nota
                          <ExternalLink size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                        </a>
                      ) : (
                        <div className="w-full py-2.5 bg-gray-50 text-gray-300 font-bold rounded-xl text-xs text-center uppercase">
                          Sin enlace
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* --- VISTA 3: VIDEOS (Grid 2 Columnas) --- */}
        {/* --- VISTA 3: VIDEOS (Galería Multimedia) --- */}
{!loading && activeTab === 'video' && (
  <div className="animate-fadeIn pb-12">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {itemsFiltrados.map((item, index) => {
        const uniqueId = item.id || `video-${index}`;
        const urlACompartir = item.link || window.location.href;
        const isMenuOpen = openShareId === uniqueId;
        
        // Detectar Plataforma
        const getPlatformInfo = (link) => {
          const l = (link || '').toLowerCase();
          if (l.includes('youtube') || l.includes('youtu.be')) return { icon: Youtube, color: 'bg-red-600', label: 'YouTube', bgClass: 'bg-red-50' };
          if (l.includes('facebook')) return { icon: Facebook, color: 'bg-blue-600', label: 'Facebook', bgClass: 'bg-blue-50' };
          if (l.includes('instagram')) return { icon: Instagram, color: 'bg-pink-600', label: 'Instagram', bgClass: 'bg-pink-50' };
          if (l.includes('tiktok')) return { icon: Film, color: 'bg-black', label: 'TikTok', bgClass: 'bg-gray-100' };
          return { icon: PlayCircle, color: 'bg-slate-800', label: 'Video', bgClass: 'bg-slate-100' };
        };

        const platform = getPlatformInfo(item.link);
        const PlatformIcon = platform.icon;
        
        // Obtener la imagen correcta (Manual o YouTube automática)
        const displayImage = getThumbnail(item.link, item.imagen);

        return (
          <div
            key={uniqueId}
            className="flex flex-col bg-white rounded-[1.5rem] shadow-sm hover:shadow-2xl border border-gray-100 group transition-all duration-300 transform hover:-translate-y-1 overflow-visible relative"
            onMouseLeave={() => setOpenShareId(null)}
          >
            {/* AREA VISUAL */}
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`relative w-full aspect-video overflow-hidden rounded-t-[1.5rem] group-cursor-pointer block ${!displayImage ? platform.bgClass : 'bg-black'}`}
            >
              {displayImage ? (
                // CASO 1: Tenemos imagen (Manual o de YouTube)
                <>
                  <img
                    src={displayImage}
                    alt={item.titulo}
                    onError={(e) => { e.target.style.display = 'none'; }} // Si falla, oculta la img rota y muestra el fondo
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-75 transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                </>
              ) : (
                // CASO 2: No hay imagen (Facebook/Insta sin foto manual) -> Placeholder Elegante
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                   <PlatformIcon size={48} className="opacity-20" />
                   <span className="text-xs font-bold uppercase tracking-widest opacity-40">Ver video en {platform.label}</span>
                </div>
              )}

              {/* Botón Play Central */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full border border-white/50 shadow-xl group-hover:scale-110 transition-transform duration-300 group-hover:bg-white/30">
                  <PlayCircle className={`w-10 h-10 drop-shadow-md ${displayImage ? 'text-white fill-white/20' : 'text-slate-800 fill-slate-800/10'}`} />
                </div>
              </div>

              {/* Badge Plataforma */}
              <div className={`absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-[10px] font-bold uppercase tracking-wider shadow-lg ${platform.color}`}>
                <PlatformIcon size={12} className="fill-current" />
                <span>{platform.label}</span>
              </div>
            </a>

            {/* BOTÓN COMPARTIR */}
            <div className="absolute top-3 right-3 z-20">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleShare(uniqueId);
                }}
                className={`p-2 rounded-full transition-all shadow-sm border backdrop-blur-md ${
                  isMenuOpen 
                    ? 'bg-slate-900 text-white border-slate-900 scale-110' 
                    : 'bg-white/30 text-white hover:bg-white hover:text-slate-900 border-white/40' // Ajustado para que se vea bien sobre img u fondo claro
                } ${!displayImage && !isMenuOpen ? '!text-slate-500 !bg-white/50' : ''}`} // Ajuste de color si no hay imagen de fondo
              >
                <Share2 size={16} />
              </button>

              {/* MENÚ POPUP */}
              {isMenuOpen && (
                <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-30 animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-1">
                   <a 
                      href={`https://wa.me/?text=${encodeURIComponent(`Mira este video: ${item.titulo} ${urlACompartir}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors font-medium"
                    >
                      <MessageCircle size={16} /> WhatsApp
                    </a>
                    <button 
                       onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlACompartir)}`, '_blank', 'width=600,height=400')}
                       className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors font-medium w-full text-left"
                    >
                      <Facebook size={16} /> Facebook
                    </button>
                    <div className="h-px bg-gray-100 my-1"></div>
                    <button
                      onClick={() => copyToClipboard(urlACompartir, uniqueId)} // <--- USAMOS LA NUEVA FUNCION AQUÍ
                      className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors font-medium w-full text-left"
                    >
                      {copiedId === uniqueId ? <Check size={16} className="text-green-500"/> : <Copy size={16} />}
                      {copiedId === uniqueId ? <span className="text-green-600 font-bold">¡Copiado!</span> : "Copiar enlace"}
                    </button>
                </div>
              )}
            </div>

            {/* CONTENIDO TEXTUAL */}
            <div className="p-5 flex-1 flex flex-col">
              <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-black text-lg text-slate-800 leading-tight mb-2 group-hover:text-blue-600 transition-colors line-clamp-2"
              >
                {item.titulo}
              </a>
              {item.descripcion ? (
                <p className="text-xs text-gray-500 line-clamp-2">{item.descripcion}</p>
              ) : (
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-auto">
                   Publicado el {formatearFecha(item.fecha)}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}
        {/* --- ESTADO VACÍO (SIN RESULTADOS) --- */}
        {!loading && itemsFiltrados.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-fadeIn">
            <div className="bg-white p-6 rounded-full shadow-sm mb-4 border-2 border-gray-100">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-black text-gray-700">
              No encontramos nada 🦓
            </h3>
            <p className="text-gray-500 font-medium text-sm mt-1 max-w-[200px]">
              Intenta con otra palabra clave o cambia el filtro de mes.
            </p>
            {filtroMes !== 'Todos' && (
              <button
                onClick={() => setFiltroMes('Todos')}
                className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 text-sm font-bold rounded-xl hover:bg-blue-100 transition"
              >
                Ver todos los meses
              </button>
            )}
          </div>
        )}

        {/* --- BOTÓN FLOTANTE INFERIOR --- */}
        <div className="fixed bottom-6 right-4 z-50">
          <div className="absolute inset-0 blur-xl opacity-30 bg-gradient-to-br from-red-700 via-orange-500 to-red-700 rounded-full animate-pulse"></div>
          <button
            onClick={() => setModalAbierto(true)}
            className="relative bg-gradient-to-br from-red-700 via-orange-500 to-red-700 hover:from-orange-500 hover:to-red-600 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 transition-all hover:scale-110 active:scale-95 group"
          >
            <PlusCircle className="animate-pulse drop-shadow-md" />
          </button>
        </div>

        <ModalComunidad
          isOpen={modalAbierto}
          onClose={() => setModalAbierto(false)}
        />
      </div>
    </main>
  );
}