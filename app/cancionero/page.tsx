"use client";

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';

import {
  Music, ChevronDown, Search, X, PlayCircle, PauseCircle,
  PlusCircle, Send, Sparkles, Smile, Youtube, Clock, Disc,
  User, Heart, Video, FileText, Maximize2, Minimize2, Loader2, AlertCircle, Filter, Grid, Check, Menu
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
// --- CONFIGURACIÓN ---
const GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ3Zwx_f4um49xKZVHWypV5XF2gGAtDgZdTmIpAH-ggays8YUAyWuwE8xdoEty-cmZvgewlmfGeFtEd/pub?gid=273410046&single=true&output=csv";

// --- HELPER: PARSEAR CSV A JSON ---
const csvToJson = (csvText: string) => {
  if (!csvText) return [];
  const lines = csvText.split(/\r?\n/).filter(Boolean);
  if (lines.length <= 1) return [];

  // Detectar separador (Google Sheets suele usar coma)
  const separator = ",";

  // Obtener cabeceras y limpiarlas
  const headers = lines[0]
    .split(separator)
    .map(h => h.trim().toLowerCase().replace(/"/g, ""));

  const result = [];

  // Regex para manejar comas dentro de comillas
  const pattern = new RegExp(
    "(\\,|\\r?\\n|\\r|^)(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|([^\"\\,\\r\\n]*))",
    "gi"
  );

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i];
    // Solución simple para CSV de Google Sheets (asumiendo que no hay saltos de línea dentro de celdas complejos)
    // Para algo más robusto se recomienda librerías como PapaParse, pero esto servirá para tu caso.

    // Simulación de parseo básico respetando comillas
    const row: string[] = [];
    let inQuote = false;
    let temp = "";

    for (let j = 0; j < currentLine.length; j++) {
      const char = currentLine[j];
      if (char === '"' && currentLine[j + 1] === '"') {
        temp += '"'; j++;
      } else if (char === '"') {
        inQuote = !inQuote;
      } else if (char === separator && !inQuote) {
        row.push(temp); temp = "";
      } else {
        temp += char;
      }
    }
    row.push(temp); // Último valor

    const obj: any = {};
    headers.forEach((header, index) => {
      let value = row[index] || "";
      // Limpiar comillas extras si quedaron
      value = value.replace(/^"|"$/g, '').trim();
      obj[header] = value;
    });

    if (!obj.titulo) continue;

    result.push({
      id: Number(obj.id) || Date.now() + Math.random(),
      titulo: obj.titulo,
      categoria: obj.categoria || "General",
      letra: obj.letra ? obj.letra.replace(/\\n/g, '\n') : "", // Convertir \n literales a saltos reales
      url: obj.url || "",
      tipoAudio: obj.tipoaudio || (obj.url?.includes("mp3") ? "mp3" : "youtube"),
      videoUrl: obj.videourl || "",
      duracion: obj.duracion || "",
      ritmo: obj.ritmo || ""
    });
  }
  return result;
};

// --- HELPER: FORMATEAR TIEMPO ---
const formatTime = (time: number) => {
  if (isNaN(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

// --- HELPER: COLORES POR CATEGORÍA ---
const getCategoryStyle = (cat: string) => {
  if (!cat) return 'border-gray-300 bg-gray-50 text-gray-600';
  const c = cat.trim();
  switch (c) {
    case 'Marchas': return 'border-blue-400 bg-blue-50 text-blue-600';
    case 'Dinámicas': return 'border-purple-400 bg-purple-50 text-purple-600';
    case 'Navidad': return 'border-red-400 bg-red-50 text-red-600';
    case 'Folklore': return 'border-orange-400 bg-orange-50 text-orange-600';
    case 'Flashmob': return 'border-pink-400 bg-pink-50 text-pink-600';
    default: return 'border-gray-300 bg-gray-50 text-gray-600';
  }
};

// --- COMPONENTE: PESTAÑAS ARCOÍRIS ---
// --- COMPONENTE: SELECTOR DE CATEGORÍA (MODO PÍLDORA) ---

const CategorySelector = ({ categorias, activo, setActivo }) => {
  const [isOpen, setIsOpen] = useState(false);

  const rainbowColors = [
    { name: 'Todas', style: 'bg-gray-100 text-gray-600 border-gray-200' },
    { name: 'Rojo', style: 'bg-red-50 text-red-600 border-red-200' },
    { name: 'Naranja', style: 'bg-orange-50 text-orange-600 border-orange-200' },
    { name: 'Amarillo', style: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    { name: 'Verde', style: 'bg-green-50 text-green-600 border-green-200' },
    { name: 'Azul', style: 'bg-blue-50 text-blue-600 border-blue-200' },
    { name: 'Indigo', style: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
    { name: 'Violeta', style: 'bg-purple-50 text-purple-600 border-purple-200' },
    { name: 'Rosa', style: 'bg-pink-50 text-pink-600 border-pink-200' },
  ];
  // Función para manejar la selección
  const handleSelect = (cat) => {
    setActivo(cat);
    setIsOpen(false);
    // Scroll suave al inicio de la lista
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  // Encontrar el estilo del activo para pintar el botón principal
  const activeIndex = categorias.indexOf(activo);
  const activeStyleColor = activeIndex === 0
    ? 'bg-white text-gray-800 border-gray-200'
    : rainbowColors[(activeIndex % (rainbowColors.length - 1)) + 1].style.replace('bg-', 'bg-white text-').replace('text-', 'border-'); // Truco visual para mantener coherencia

  return (
    <div className="relative px-4 pb-2 z-50">
      {/* BOTÓN ACTIVADOR (Píldora principal) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white/90 backdrop-blur-md border border-gray-200 shadow-md rounded-full py-3 px-6 flex items-center justify-between group transition-all active:scale-95 hover:shadow-lg"
      >
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-full ${activo === 'Todas' ? 'bg-gray-100' : 'bg-orange-100'} `}>
            <Filter size={16} className={activo === 'Todas' ? 'text-gray-500' : 'text-orange-500'} />
          </div>
          <div className="text-left">
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Categoría</p>
            <p className="font-bold text-gray-800 text-sm leading-none">{activo}</p>
          </div>
        </div>
        <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* MENÚ DESPLEGABLE (Grid de píldoras) */}
      {isOpen && (
        <>
          {/* Fondo oscuro para cerrar al hacer click fuera */}
          <div className="fixed inset-0 bg-black/20 z-10 backdrop-blur-[1px]" onClick={() => setIsOpen(false)}></div>

          {/* Contenedor de las opciones */}
          <div className="absolute top-full left-4 right-4 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-20 animate-fadeIn origin-top">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
              <Grid size={14} className="text-gray-400" />
              <span className="text-xs font-bold text-gray-400 uppercase">Selecciona una categoría</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {categorias.map((cat, index) => {
                const colorObj = index === 0
                  ? rainbowColors[0]
                  : rainbowColors[(index % (rainbowColors.length - 1)) + 1];

                const isActive = activo === cat;

                return (
                  <button
                    key={cat}
                    onClick={() => handleSelect(cat)}
                    className={`
                                    relative px-4 py-2.5 rounded-xl text-sm font-bold border transition-all duration-200 flex-grow text-center
                                    ${isActive
                        ? 'bg-black text-white border-black shadow-md ring-2 ring-gray-200'
                        : `${colorObj.style} hover:brightness-95`
                      }
                                `}
                  >
                    {cat}
                    {isActive && <Check size={14} className="absolute top-1 right-1 text-white/50" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};


// --- COMPONENTE: MODAL DE SUGERENCIAS ---
const ModalSugerencia = ({ isOpen, onClose }: any) => {
  const [enviado, setEnviado] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '', categoria: 'Marcha', link: '', autor: '', mensaje: ''
  });

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const numeroCelular = "59172069451";
    const mensajeWhatsApp = `Hola Cebra 🦓, quiero sugerir una canción:
🎵 *Título:* ${formData.titulo}
📂 *Categoría:* ${formData.categoria}
👤 *De parte de:* ${formData.autor || "Anónimo"}
🔗 *Link:* ${formData.link || "Sin link"}
💬 *Mensaje:* ${formData.mensaje || "Sin mensaje adicional"}`;

    const url = `https://wa.me/${numeroCelular}?text=${encodeURIComponent(mensajeWhatsApp)}`;
    window.open(url, '_blank');
    setEnviado(true);
    setTimeout(() => {
      setEnviado(false);
      setFormData({ titulo: '', categoria: 'Marcha', link: '', autor: '', mensaje: '' });
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
                    <Sparkles size={32} className="animate-pulse" />
                  </div>
                </div>
                <h2 className="text-2xl font-black text-gray-800">¡Sugerir Canción!</h2>
                <p className="text-gray-500 text-sm mt-1">Te enviaremos al WhatsApp para añadirla.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <User size={12} /> Sobre ti
                  </h3>
                  <input required name="autor" value={formData.autor} onChange={handleChange} type="text" placeholder="Tu nombre" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-yellow-400 focus:outline-none text-sm" />
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Título</label>
                    <input required name="titulo" value={formData.titulo} onChange={handleChange} type="text" placeholder="Ej: La cebra bailarina" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-400 focus:outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Categoría</label>
                      <select name="categoria" value={formData.categoria} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-400 focus:outline-none">
                        <option>Marcha</option><option>Dinámica</option><option>Navidad</option><option>Folklore</option><option>Flashmob</option><option>Otra</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Enlace</label>
                      <input name="link" value={formData.link} onChange={handleChange} type="text" placeholder="YouTube..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-400 focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Mensaje</label>
                    <textarea name="mensaje" value={formData.mensaje} onChange={handleChange} rows={2} placeholder="Letra o comentario..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-400 focus:outline-none"></textarea>
                  </div>
                </div>
                <button type="submit" className="w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 group shadow-lg">
                  <Send size={18} /> Enviar Sugerencia
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
            <p className="text-gray-600">Revisaremos tu sugerencia.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- COMPONENTE: TARJETA DE CANCIÓN (ACTUALIZADO) ---
const SongCard = ({
  cancion, abierto, toggleAbierto,
  playingId, setPlayingId,
  isFavorite, toggleFavorite
}: any) => {

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [karaokeMode, setKaraokeMode] = useState(false);
  
  // Referencia al audio
  const audioRef = useRef<HTMLAudioElement>(null)
  const [audioWarning, setAudioWarning] = useState(false);
// --- VALIDACIONES DE CONTENIDO ---
  // Verificamos si realmente hay texto útil en los campos
  const hasVideo = cancion.videoUrl && cancion.videoUrl.trim().length > 0;
  const hasAudio = cancion.url && cancion.url.trim().length > 0;
  const colorClass = getCategoryStyle(cancion.categoria);
  const borderColor = colorClass.split(' ')[0];

  // Controlar reproducción externa (cuando se da play a otra)
  useEffect(() => {
    if (playingId !== cancion.id) {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [playingId, cancion.id]);

  const togglePlay = (e: any) => {
    e.stopPropagation();
  // Si no hay audio, no hacemos nada (ni error, ni warning)
    if (!hasAudio) return;
    const audio = audioRef.current;
    if (!audio) return;
    // VALIDACIÓN PARA AUDIO VACÍO
    if (!cancion.url || cancion.url.trim() === "") {
      setAudioWarning(true);
      return;
    }

    if (audio.paused) {
      setPlayingId(cancion.id);
      // Promesa de play para evitar errores de interrupción
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(err => console.error("Error reproducción:", err));
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => { if (audioRef.current) setCurrentTime(audioRef.current.currentTime); };
  const handleLoadedMetadata = () => { if (audioRef.current) setDuration(audioRef.current.duration); };
  const handleSeek = (e: any) => {
    const time = Number(e.target.value);
    if (audioRef.current) { audioRef.current.currentTime = time; setCurrentTime(time); }
  };

  const isYoutubeVideo = (url: string) => url && (url.includes('youtube.com') || url.includes('youtu.be'));
return (
    <>
      <div className={`bg-white rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden group ${abierto ? `${borderColor} shadow-lg ring-4 ring-opacity-20 ring-gray-200` : 'border-gray-200 hover:border-gray-300 shadow-sm'}`}>
        
        {/* CABECERA DE LA TARJETA (Siempre visible) */}
        <div onClick={toggleAbierto} className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-4 flex-1 overflow-hidden">
            {/* Icono (Si tiene audio muestra Music/Disc, si no, muestra FileText) */}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-sm shrink-0 ${colorClass}`}>
              {hasAudio ? (
                 isPlaying ? <Music size={20} className="animate-pulse" /> : <Disc size={20} />
              ) : (
                 <FileText size={20} />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-800 text-lg leading-tight group-hover:text-black transition-colors truncate pr-2">
                {cancion.titulo}
              </h3>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-md">{cancion.ritmo || 'Ritmo'}</span>
                {/* Solo mostrar duración si hay audio real */}
                {hasAudio && cancion.duracion && (
                   <span className="text-xs text-gray-400 font-medium flex items-center gap-1"><Clock size={10} /> {cancion.duracion}</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 ml-2">
            <button onClick={(e) => { e.stopPropagation(); toggleFavorite(cancion.id); }} className={`p-2 rounded-full hover:bg-gray-100 transition-all ${isFavorite ? 'text-red-500' : 'text-gray-300 hover:text-red-400'}`}>
              <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
            </button>
            <ChevronDown className={`text-gray-400 transition-transform duration-300 ${abierto ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {/* CONTENIDO DESPLEGABLE */}
        <div className={`border-t border-dashed border-gray-200 bg-gray-50/50 transition-all duration-300 ${abierto ? 'block animate-fadeIn' : 'hidden'}`}>
          <div className="p-4">
            
            {/* BOTONES DE ACCIÓN (Video y Karaoke) */}
            <div className="flex flex-wrap gap-2 mb-4">
              
              {/* CONDICIONAL: Solo mostrar botón Coreografía si hasVideo es true */}
              {hasVideo && (
                <button onClick={() => setShowVideo(!showVideo)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${showVideo ? 'bg-black text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'}`}>
                  {showVideo ? <FileText size={14} /> : <Video size={14} />}
                  {showVideo ? "Ocultar Video" : "Coreografía"}
                </button>
              )}

              {/* Botón Karaoke (Siempre visible) */}
              <button onClick={() => setKaraokeMode(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors">
                <Maximize2 size={14} /> Karaoke
              </button>
            </div>

            {/* ZONA DEL REPRODUCTOR / VIDEO */}
            {showVideo && hasVideo ? (
              <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg bg-black mb-4">
                {isYoutubeVideo(cancion.videoUrl) ? (
                  <iframe src={cancion.videoUrl} className="w-full h-full" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                ) : (
                  <video controls className="w-full h-full"><source src={cancion.videoUrl} type="video/mp4" /></video>
                )}
              </div>
            ) : (
              // Si NO se está mostrando video, mostramos el reproductor de audio (SOLO SI HAY AUDIO)
              <>
                 {hasAudio && (
                   <div className="bg-zinc-900 rounded-xl p-3 flex flex-col sm:flex-row items-center gap-4 shadow-xl text-white mb-4">
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex items-center justify-between text-xs text-zinc-400 mt-0.5 mb-1">
                        <span>{formatTime(currentTime)}</span><span>{formatTime(duration || 0)}</span>
                      </div>
                      
                      {cancion.tipoAudio === 'mp3' ? (
                        <div className="flex items-center gap-3">
                          <button onClick={togglePlay} className="hover:scale-105 transition-transform shrink-0">
                            {isPlaying ? <PauseCircle className="w-8 h-8 text-green-500 fill-current" /> : <PlayCircle className="w-8 h-8 text-white hover:text-green-500 transition-colors" />}
                          </button>
                          <input type="range" min={0} max={duration || 0} value={currentTime} onChange={handleSeek} className="flex-1 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-green-500 [&::-webkit-slider-thumb]:rounded-full" />
                        </div>
                      ) : (
                        // Fallback para audio tipo link externo (no mp3 directo)
                        <a href={cancion.url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white py-1.5 px-3 rounded-full w-full justify-center">
                          <Youtube size={16} /> Escuchar Audio Externo
                        </a>
                      )}
                    </div>
                  </div>
                 )}
                 
                 {/* Si no hay audio, no mostramos nada aquí arriba, pasamos directo a la letra */}
              </>
            )}

            {/* LETRA (Siempre visible) */}
            <div className="px-2">
              <h4 className="text-xs font-black text-gray-400 uppercase mb-3 tracking-wider flex items-center gap-1">
                <FileText size={12}/> Letra
              </h4>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed font-medium font-sans pl-4 border-l-4 border-yellow-400">
                {cancion.letra || "Letra no disponible."}
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* COMPONENTE AUDIO OCULTO (Solo se renderiza si hay URL) */}
      {hasAudio && cancion.tipoAudio === 'mp3' && (
        <audio
          ref={audioRef}
          src={cancion.url}
          preload="metadata"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      )}

      {/* MODAL KARAOKE */}
    {/* MODAL KARAOKE */}
      {karaokeMode && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col animate-fadeIn">
          <div className="p-2 flex justify-between items-center border-b border-white/10">
            <div className="text-white">
              <h3 className="font-bold text-lg">{cancion.titulo}</h3>
              <p className="text-sm text-gray-400">Modo Ensayo {hasAudio ? '' : '(A Capela)'}</p>
            </div>
            <button onClick={() => setKaraokeMode(false)} className="bg-white/10 p-1 rounded-full text-white hover:bg-white/20 transition"><Minimize2 size={24} /></button>
          </div>
          
          {/* AQUÍ ESTÁ EL CAMBIO: Cambié 'items-center' por 'items-start' */}
          <div className="flex-1 overflow-y-auto p-6 flex items-start justify-center no-scrollbar">
            <p className="text-white text-xl sm:text-2xl md:text-2xl font-bold text-center whitespace-pre-line leading-relaxed tracking-wide py-1">
              {cancion.letra}
            </p>
          </div>

          {/* CONTROL PLAY EN KARAOKE (Solo si existe audio) */}
          {hasAudio && cancion.tipoAudio === 'mp3' && (
            <div className="p-2 pb-8 bg-gradient-to-t from-black to-transparent flex justify-center sticky bottom-0">
              <button type="button" onClick={togglePlay} className="bg-white text-black p-2 rounded-full hover:scale-110 transition shadow-lg hover:bg-gray-200">
                {isPlaying ? <PauseCircle size={25} className="fill-black" /> : <PlayCircle size={25} className="fill-black" />}
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};
// --- APP PRINCIPAL ---
export default function CancioneroApp() {
  const [cancionesData, setCancionesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [abierto, setAbierto] = useState<number | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [favoritos, setFavoritos] = useState<number[]>([]);
  //Menu hamburguesa
  const [isScrolled, setIsScrolled] = useState(false);
  const [globalMenuOpen, setGlobalMenuOpen] = useState(false);
  // --- EFECTO: CARGAR DATOS DE GOOGLE SHEETS ---
  useEffect(() => {
    setLoading(true);
    fetch(GOOGLE_SHEET_URL)
      .then(response => {
        if (!response.ok) throw new Error("Error al conectar con Google Sheets");
        return response.text();
      })
      .then(csvText => {
        const data = csvToJson(csvText);
        setCancionesData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("No se pudieron cargar las canciones.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Cargar favoritos del localStorage
    try {
      const stored = JSON.parse(localStorage.getItem('cebraFavoritos') || '[]');
      setFavoritos(stored);
    } catch (e) {
      setFavoritos([]);
    }
  }, []);

  const toggleFavorite = (id: number) => {
    const newFavs = favoritos.includes(id) ? favoritos.filter(favId => favId !== id) : [...favoritos, id];
    setFavoritos(newFavs);
    localStorage.setItem('cebraFavoritos', JSON.stringify(newFavs));
  };

  const categorias = useMemo(() => {
    const cats = new Set(cancionesData.map(c => c.categoria).filter(Boolean));
    return ['Todas', ...Array.from(cats)];
  }, [cancionesData]);

  const cancionesFiltradas = cancionesData.filter(cancion => {
    const texto = busqueda.toLowerCase();
    const tituloMatch = cancion.titulo?.toLowerCase().includes(texto);
    const letraMatch = cancion.letra?.toLowerCase().includes(texto);
    const matchCat = filtroCategoria === 'Todas' || cancion.categoria === filtroCategoria;
    return (tituloMatch || letraMatch) && matchCat;
  });
  //menu hamburguesa scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans">
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

            <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-slate-50">
              {globalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={() => setGlobalMenuOpen(false)}
                  className={`flex items-center justify-between p-2 rounded-2xl transition-all font-black text-lg border-2
                                ${link.path === '/cancionero'
                      ? 'bg-slate-900 border-slate-900 text-white shadow-lg'

                      : `bg-slate-50 border-transparent text-black ${link.hoverBg} hover:border-slate-200 ${link.color} ${link.border}`}

                            `}
                >
                  <span>{link.name}</span>
                  {link.path === '/cancionero' && <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>}
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
      <div className="sticky top-0 z-50 bg-slate-50/95 backdrop-blur-sm shadow-sm transition-all pb-2">
        <div className="bg-gradient-to-br from-orange-700 via-yellow-500 to-orange-700 p-2 pt- rounded-b-[2.5rem] shadow-lg mb-4 text-center relative overflow-hidden z-20">
          {/* Textura de fondo unificada */}
          <div className="absolute top-0 left-0 w-full h-full opacity-80 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-white/20 p-2 rounded-full mb-2 backdrop-blur-sm border-2 border-white/30 animate-bounce">
              <Music className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-md">Cancionero Cebra</h1>
            <p className="text-yellow-100 font-medium text-sm">Ritmo y corazón urbano.</p>
          
          <div className="w-full max-w-md relative group mt-2 ">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
                          <Search className="h-5 w-5 text-white/70 group-focus-within:text-white " />
                        </div>
                        <input
                          type="text"
                          placeholder="Buscar canción o letra..."
                          value={busqueda}
                          onChange={(e) => setBusqueda(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2 border-none rounded-full leading-5 bg-white/20 text-white placeholder-white/90 focus:outline-none focus:bg-white/30 focus:ring-2 focus:ring-white/50 focus:placeholder-white transition duration-150 ease-in-out sm:text-sm shadow-inner backdrop-blur-md"
                        />
                        {busqueda && (
                          <button onClick={() => setBusqueda("")} className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/70 hover:text-white">
                            <X size={16} />
                          </button>
                        )}
                      </div>
                        </div>
        </div>

        <div className="relative z-40 -mt-2 max-w-md mx-auto">
          <CategorySelector categorias={categorias} activo={filtroCategoria} setActivo={setFiltroCategoria} />
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

      <div className="container mx-auto px-4 max-w-2xl space-y-4 pt-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-orange-400">
            <Loader2 className="w-12 h-12 animate-spin mb-4" />
            <p className="font-bold text-gray-500">Cargando cancionero...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10 bg-red-50 rounded-2xl border border-red-200 mx-4">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-2" />
            <p className="text-red-600 font-bold">{error}</p>
            <p className="text-xs text-gray-500 mt-2">Revisa que el link del CSV esté publicado correctamente.</p>
          </div>
        ) : cancionesFiltradas.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white p-4 rounded-full inline-block shadow-sm mb-4 border-2 border-orange-200"><Search className="w-8 h-8 text-orange-300" /></div>
            <p className="text-gray-500 font-medium">No encontramos canciones con esos criterios 🦓</p>
          </div>
        ) : (
          cancionesFiltradas.map((cancion) => (
            <SongCard
              key={cancion.id}
              cancion={cancion}
              abierto={abierto === cancion.id}
              toggleAbierto={() => setAbierto(abierto === cancion.id ? null : cancion.id)}
              playingId={playingId}
              setPlayingId={setPlayingId}
              isFavorite={favoritos.includes(cancion.id)}
              toggleFavorite={toggleFavorite}
            />
          ))
        )}
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <div className="absolute inset-0 blur-xl opacity-30 bg-gradient-to-r from-blue-700 via-teal-600 to-emerald-600 rounded-full animate-pulse"></div>
        <button onClick={() => setModalAbierto(true)} className="relative bg-gradient-to-r from-yellow-600 via-orange-600 to-orange-600 hover:from-yellow-600 hover:via-orange-600 hover:to-orange-600 text-white p-4 rounded-full backdrop-blur-xl flex items-center gap-2 transition-all hover:scale-110 active:scale-95 group shadow-xl">
          <PlusCircle className="animate-pulse drop-shadow-md" />
          <span className="font-bold pr-1 hidden group-hover:inline-block animate-fadeIn">Sugerir</span>
        </button>
      </div>

      <ModalSugerencia isOpen={modalAbierto} onClose={() => setModalAbierto(false)} />
    </div>
  );
}