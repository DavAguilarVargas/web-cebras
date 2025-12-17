"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';

import {
    ShieldAlert, Clock, FileText, Download, Phone,
    ChevronDown, ChevronUp, AlertTriangle, Users,
    School, Footprints, Info, Palette, Gamepad2, MessageCircle,
    BookOpen, FolderOpen, Search, X, Siren, Send, CheckSquare, Square,
    Heart, Star, Lightbulb, Sparkles, TrendingUp, History, Award, PlusCircle, Smile,
    MapPin, Bus, CableCar, Compass, CarFront, Landmark, CreditCard, Loader2, Wifi, WifiOff, ExternalLink,
    LayoutGrid, Menu
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
// --- CONFIGURACIÓN DE GOOGLE SHEETS ---
const GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ3Zwx_f4um49xKZVHWypV5XF2gGAtDgZdTmIpAH-ggays8YUAyWuwE8xdoEty-cmZvgewlmfGeFtEd/pub?gid=1577705977&single=true&output=csv";

// --- DATOS POR DEFECTO (FALLBACK) ---
const defaultGuia = {
    lugares: [
        { nombre: "Terminal de Buses", ref: "Zona Norte / Challapampa", tip: "Minibuses con cartel 'Terminal' o 'Autopista'." },
        { nombre: "Plaza Murillo", ref: "Centro / Km 0", tip: "Cualquier transporte al 'Centro' o 'Comercio'." },
    ],
    bancos: [
        { nombre: "Banco Unión", ref: "Agencias Múltiples", tip: "Suele tener filas largas para rentas." },
    ],
    teleferico: [
        { linea: "Rojo", ruta: "Zona Norte (Cementerio) - El Alto (16 de Julio)", color: "bg-red-500 text-white" },
        { linea: "Amarillo", ruta: "Sopocachi - Ciudad Satélite", color: "bg-yellow-400 text-black" },
    ],
    pumakatari: [
        { ruta: "Chasquipampa", clave: "Eje troncal hacia Zona Sur." },
    ],
    micros: [
        { linea: "323", ruta: "Alto Chijini - Villa Fátima", clave: "Pte. Topater, Camacho, Stadium.", colorBadge: "bg-blue-700 text-white", tipo: "Mini" },
    ]
};

const defaultConsejos = [
    { texto: "Si hace mucho sol, hidrátate cada 20 minutos aunque no tengas sed.", autor: "Cebra Veterana" },
    { texto: "Tu sonrisa se siente incluso a través de la máscara. Usa tus manos para expresarla.", autor: "Cebra Guía" }
];

const defaultDocumentos = [
    { nombre: "Dossier Cebra 2024", tipo: "PDF", peso: "2.5 MB", url: "#" },
    { nombre: "Reglamento Interno", tipo: "PDF", peso: "1.2 MB", url: "#" }
];

// --- HELPER: PARSEAR CSV A JSON ---
const csvToJson = (csvText) => {
    const lines = csvText.split(/\r\n|\n/);
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const row = [];
        let inQuote = false;
        let temp = "";
        for (let char of lines[i]) {
            if (char === '"') { inQuote = !inQuote; continue; }
            if (char === ',' && !inQuote) { row.push(temp); temp = ""; continue; }
            temp += char;
        }
        row.push(temp);

        let obj = {};
        headers.forEach((header, index) => {
            let value = row[index] || "";
            value = value.replace(/\\n/g, '\n').trim();
            obj[header] = value;
        });

        if (obj.categoria && obj.titulo) {
            result.push(obj);
        }
    }
    return result;
};

// --- HELPER: NORMALIZAR TEXTO PARA BÚSQUEDA ---
const normalizeText = (text) => {
    return text ? text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";
};

// --- COMPONENTE: BARRA DE ICONOS ARCOÍRIS (MÓVIL - SUBMENÚS) ---
// Modificado para usar flex-wrap y centrado, eliminando el scroll horizontal
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
                {!items.find((i: any) => i.id === activeId)?.label.includes(activeLabel) && (
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-0.5">{activeLabel}</span>
                )}
            </div>
        </div>
    );
};

// --- COMPONENTE: BARRA DE NAVEGACIÓN MÓVIL NEUTRA (MobileNeutralNavBar) ---
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
                        {/* Icono */}
                        {React.cloneElement(item.icon, { size: 18 })}
                        {/* Texto pequeño */}
                        <span className="text-[9px] uppercase tracking-wide">{item.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

// --- COMPONENTE: BARRA DE NAVEGACIÓN PC (ESTÁTICA) ---
const DesktopNavBar = ({ items, activeId, setActiveId, setBusqueda }: any) => {
    return (
        <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 flex justify-center gap-1 w-full">
            {items.map((item: any) => (
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
// --- CHECKLIST ---
const InteractiveChecklist = ({ items }) => {
    const [checkedState, setCheckedState] = useState(new Array(items.length).fill(false));
    const handleOnChange = (position) => {
        const updatedCheckedState = checkedState.map((item, index) => index === position ? !item : item);
        setCheckedState(updatedCheckedState);
    };
    return (
        <div className="space-y-2">
            {items.map((item, index) => (
                <div key={index} onClick={() => handleOnChange(index)} className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all border ${checkedState[index] ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'}`}>
                    <div className={`mt-0.5 ${checkedState[index] ? 'text-green-500' : 'text-gray-400'}`}>{checkedState[index] ? <CheckSquare size={20} /> : <Square size={20} />}</div>
                    <span className={`text-sm ${checkedState[index] ? 'text-gray-500 line-through' : 'text-gray-700'}`}>{item}</span>
                </div>
            ))}
            <p className="text-xs text-center text-gray-400 mt-2">Toca para marcar como completado</p>
        </div>
    );
};

// --- MODAL ---
const ModalConsejo = ({ isOpen, onClose }) => {
    const [consejo, setConsejo] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();
        const numero = "59172069451";
        const mensaje = `🦓 *Nuevo Consejo para la Manada* 🦓\n\n"${consejo}"\n\n_(Por favor, agregar al Sheet de Consejos)_`;
        window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`, '_blank');
        setConsejo("");
        onClose();
    };
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden relative">
                <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-red-500"><X size={24} /></button>
                <div className="p-6">
                    <div className="text-center mb-4"><div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2 text-yellow-500"><Lightbulb size={28} /></div><h3 className="text-xl font-black text-gray-800">Compartir Consejo</h3><p className="text-xs text-gray-500">Tu experiencia ayuda a las nuevas Cebras.</p></div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <textarea value={consejo} onChange={(e) => setConsejo(e.target.value)} required placeholder="Escribe tu consejo aquí..." className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 h-32 resize-none"></textarea>
                        <button type="submit" className="w-full bg-yellow-500 text-white font-bold py-3 rounded-xl hover:bg-yellow-600 transition flex items-center justify-center gap-2"><Send size={18} /> Enviar Aporte</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// --- APP PRINCIPAL ---
export default function RecursosCebra() {
    const [vistaPrincipal, setVistaPrincipal] = useState('protocolos');
    const [activeCat, setActiveCat] = useState('rutina');
    const [activeGuiaCat, setActiveGuiaCat] = useState('todos');
    const [openItem, setOpenItem] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [sosOpen, setSosOpen] = useState(false);
    const [gestionSeleccionada, setGestionSeleccionada] = useState("2024");
    const [modalConsejoOpen, setModalConsejoOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [usingOnlineData, setUsingOnlineData] = useState(false);

    // Estados de datos
    const [guiaData, setGuiaData] = useState(defaultGuia);
    const [consejos, setConsejos] = useState(defaultConsejos);
    const [documentos, setDocumentos] = useState(defaultDocumentos);

    const [isScrolled, setIsScrolled] = useState(false);
    const [globalMenuOpen, setGlobalMenuOpen] = useState(false);

    // --- EFECTO DE SCROLL AUTOMÁTICO ---
    useEffect(() => {
        if (activeCat || activeGuiaCat || vistaPrincipal || busqueda) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [activeCat, activeGuiaCat, vistaPrincipal, busqueda]);

    // --- CARGA DE DATOS ---
    useEffect(() => {
        if (GOOGLE_SHEET_URL === "TU_ENLACE_CSV_AQUI") {
            setLoading(false);
            setUsingOnlineData(false);
            return;
        }

        setLoading(true);
        const timestamp = new Date().getTime();
        const urlConCacheBuster = `${GOOGLE_SHEET_URL}&t=${timestamp}`;

        fetch(urlConCacheBuster)
            .then(res => res.ok ? res.text() : Promise.reject(res.statusText))
            .then(csvText => {
                const data = csvToJson(csvText);

                const newGuia = { ...defaultGuia };
                Object.keys(newGuia).forEach(k => newGuia[k] = []);
                const newConsejos = [];
                const newDocumentos = [];

                data.forEach(item => {
                    const cat = item.categoria?.toLowerCase().trim();

                    if (cat === 'lugares') newGuia.lugares.push({ nombre: item.titulo, ref: item.subtitulo, tip: item.detalle });
                    else if (cat === 'bancos') newGuia.bancos.push({ nombre: item.titulo, ref: item.subtitulo, tip: item.detalle });
                    else if (cat === 'teleferico') {

                        const linea = item.titulo?.trim();
                        const extraColor = item.extra?.trim();

                        // Mapa de colores seguros para Tailwind
                        const coloresPorLinea = {
                            "roja": "bg-red-500 text-white",
                            "amarilla": "bg-yellow-400 text-black",
                            "verde": "bg-green-600 text-white",
                            "azul": "bg-blue-600 text-white",
                            "plateado": "bg-gray-400 text-black",
                            "morada": "bg-purple-400 text-white",
                            "naranja": "bg-orange-500 text-white",
                            "cafe": "bg-amber-800 text-white",
                            "celeste": "bg-sky-500 text-white",
                            "blanca": "bg-gray-300 text-white",
                        };

                        // Normalizamos el nombre de la línea
                        const key = linea.toLowerCase();

                        // 1. Si el extra está vacío → usar color por defecto
                        // 2. Si extra tiene un valor NO permitido por Tailwind → ignorarlo
                        const colorFinal = extraColor && extraColor.startsWith("bg-")
                            ? extraColor
                            : coloresPorLinea[key] || "bg-gray-400 text-white";

                        newGuia.teleferico.push({
                            linea: linea,
                            ruta: item.subtitulo,
                            color: colorFinal
                        });
                    }


                    else if (cat === 'pumakatari')
                        newGuia.pumakatari.push({
                            ruta: item.titulo,
                            clave: item.detalle,
                            imagen: item.extra   // ← IMPORTANTE
                        });

                    else if (cat === 'micros') newGuia.micros.push({
                        linea: item.titulo,
                        ruta: item.subtitulo,
                        clave: item.detalle,
                        colorBadge: item.extra || 'bg-gray-500 text-white',
                        tipo: item.titulo.toLowerCase().includes('micro') ? 'Micro' : 'Mini'
                    });
                    else if (cat === 'consejos') newConsejos.push({ texto: item.titulo, autor: item.subtitulo });
                    else if (cat === 'documentos') newDocumentos.push({
                        nombre: item.titulo,
                        tipo: item.subtitulo || 'PDF',
                        peso: item.detalle,
                        url: item.extra
                    });
                });

                if (newConsejos.length > 0) setConsejos(newConsejos);
                if (newDocumentos.length > 0) setDocumentos(newDocumentos);
                const hasGuiaData = Object.values(newGuia).some(arr => arr.length > 0);
                if (hasGuiaData) setGuiaData(newGuia);

                setUsingOnlineData(true);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error cargando Sheet:", err);
                setUsingOnlineData(false);
                setLoading(false);
            });
    }, []);

    // --- VALORES Y FILOSOFÍA ---
    const valoresCebra = [
        { valor: "Bondad", filosofia: "Educar no es prohibir.", color: "from-yellow-400 to-orange-500" },
        { valor: "Sinceridad", filosofia: "Disfruto de lo que hago.", color: "from-blue-400 to-cyan-500" },
        { valor: "Empatía", filosofia: "Estar siempre alerta.", color: "from-green-400 to-emerald-600" },
        { valor: "Amor", filosofia: "Lograr la reflexión del ciudadano.", color: "from-red-400 to-pink-600" },
        { valor: "Paciencia", filosofia: "Ser responsable.", color: "from-purple-400 to-indigo-600" },
        { valor: "Gratitud", filosofia: "Amar el lugar que habito.", color: "from-pink-400 to-rose-500" },
        { valor: "Perdón", filosofia: "Ponerse en el lugar del otro.", color: "from-teal-400 to-green-500" },
        { valor: "Humildad", filosofia: "Conquistar con amor a la gente.", color: "from-orange-400 to-red-500" },
        { valor: "Responsabilidad", filosofia: "Tocar la emoción de la gente.", color: "from-indigo-400 to-blue-600" },
        { valor: "Solidaridad", filosofia: "Ser considerado con todos.", color: "from-cyan-400 to-blue-500" },
    ];

    const [valorActual, setValorActual] = useState(valoresCebra[0]);

    useEffect(() => {
        const calcularSemana = () => {
            const now = new Date();
            const start = new Date(now.getFullYear(), 0, 0);
            const diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
            const oneDay = 1000 * 60 * 60 * 24;
            const week = Math.floor(Math.floor(diff / oneDay) / 7);
            setValorActual(valoresCebra[week % valoresCebra.length]);
        };
        calcularSemana();
    }, []);

    // --- DATOS ESTÁTICOS (Protocolos) ---
    const protocolosData = {
        rutina: [{ titulo: "Horarios y Asistencia", icono: <Clock size={20} className="text-blue-500" />, tipo: "checklist", contenido: ["Llamada de asistencia.", "Calentamiento.", "Revisión traje (Lunes)."], extraInfo: <div className="mt-3 text-sm bg-blue-50 p-3 rounded-lg border border-blue-100"><p><strong>Mañana:</strong> 08:00 A 12:00</p><p><strong>Tarde:</strong> 14:00 a 18:00</p></div> }, { titulo: "Normas de Convivencia", icono: <Users size={20} className="text-green-500" />, tipo: "texto", contenido: <ul className="list-disc pl-5 text-sm"><li>Prohibido celulares.</li><li>Cero Alcohol.</li></ul> }, { titulo: "Formatos de Informe", icono: <FileText size={20} className="text-gray-500" />, tipo: "texto", contenido: <p className="text-sm">Entrega semanal al coordinador.</p> }],
        calle: [{ titulo: "Acción en Calles", icono: <Footprints size={20} />, tipo: "checklist", contenido: ["Semáforos.", "Pasos cebra.", "Ubicación segura."] }, { titulo: "Uso de Baños", icono: <Info size={20} />, tipo: "texto", contenido: "Ir acompañado." }],
        riesgos: [{ titulo: "Estado de Ebriedad", icono: <AlertTriangle size={20} className="text-orange-500" />, tipo: "texto", contenido: "Alejarse. Nivel 3: Llamar 110." }, { titulo: "Acoso", icono: <ShieldAlert size={20} className="text-red-500" />, tipo: "texto", contenido: "Gritar ayuda. Quitarse cabeza si es grave." }, { titulo: "Manifestaciones", icono: <Users size={20} className="text-purple-500" />, tipo: "texto", contenido: "Resguardarse en tiendas." }],
        grupos: [{ titulo: "Niños", icono: <Users size={20} className="text-pink-500" />, tipo: "texto", contenido: "Nivel ojos. No abrazar sin permiso." }, { titulo: "Discapacidad", icono: <Users size={20} className="text-blue-500" />, tipo: "texto", contenido: "Ofrecer brazo a ciegos." }],
        escuelas: [{ titulo: "En Colegios", icono: <School size={20} className="text-indigo-500" />, tipo: "texto", contenido: "Nunca a solas con alumnos." }, { titulo: "Aplicación Artística", icono: <Palette size={20} className="text-purple-500" />, tipo: "texto", contenido: "Títeres, Teatro, Dinámicas." }]
    };

    const historialGestiones = {
        2024: { hito: "Expansión a nuevos macrodistritos.", voluntarios: "~450", lema: "Cebras de Hierro" },
        2023: { hito: "Campaña masiva 'Cruza Seguro'.", voluntarios: "~420", lema: "Pasión Urbana" },
        2022: { hito: "Retorno post-pandemia a las calles.", voluntarios: "~380", lema: "Resiliencia Cebra" },
        2021: { hito: "Educación virtual y apoyo social.", voluntarios: "~300", lema: "Conectados" },
        2020: { hito: "Apoyo en canastas solidarias.", voluntarios: "~250", lema: "Solidaridad Pura" },
    };

    // --- MENÚS CON ICONOS ---
    const categoriasMenu = [
        { id: 'rutina', label: 'Rutina', icon: <Clock size={20} /> },
        { id: 'calle', label: 'Calle', icon: <Footprints size={20} /> },
        { id: 'riesgos', label: 'Riesgos', icon: <AlertTriangle size={20} /> },
        { id: 'grupos', label: 'Grupos', icon: <Users size={20} /> },
        { id: 'escuelas', label: 'Colegios', icon: <School size={20} /> },
    ];

    const categoriasGuiaMenu = [
        { id: 'todos', label: 'Todo', icon: <LayoutGrid size={20} /> },
        { id: 'lugares', label: 'Lugares', icon: <MapPin size={20} /> },
        { id: 'bancos', label: 'Bancos', icon: <Landmark size={20} /> },
        { id: 'teleferico', label: 'Teleférico', icon: <CableCar size={20} /> },
        { id: 'pumakatari', label: 'PumaKatari', icon: <Bus size={20} /> },
        { id: 'micros', label: 'Sindicatos', icon: <CarFront size={20} /> },
    ];

    const menuPrincipalItems = [
        { id: 'protocolos', label: 'Protocolos', icon: <BookOpen size={18} /> },
        { id: 'guia', label: 'Guía', icon: <Compass size={18} /> },
        { id: 'biblioteca', label: 'Biblioteca', icon: <FolderOpen size={18} /> },
        { id: 'comunidad', label: 'Comunidad', icon: <Heart size={18} /> },
    ];

    const toggleItem = (titulo) => {
        setOpenItem(openItem === titulo ? null : titulo);
    };

    // --- LÓGICA DE BÚSQUEDA ---
    const resultadosBusqueda = useMemo(() => {
        if (!busqueda) return [];
        const term = normalizeText(busqueda);
        const resultados = [];

        // Protocolos
        if (vistaPrincipal === 'protocolos') {
            Object.entries(protocolosData).forEach(([catKey, items]) => {
                items.forEach(item => {
                    let match = false;
                    if (normalizeText(item.titulo).includes(term)) match = true;
                    if (Array.isArray(item.contenido)) { if (item.contenido.some(i => typeof i === 'string' && normalizeText(i).includes(term))) match = true; }
                    else if (typeof item.contenido === 'string' && normalizeText(item.contenido).includes(term)) match = true;
                    if (match) resultados.push({ ...item, categoriaOriginal: catKey });
                });
            });
        }

        // Guía Urbana
        if (vistaPrincipal === 'guia') {
            const cat = activeGuiaCat;
            if (cat === 'todos' || cat === 'lugares') guiaData.lugares.forEach(l => { if (normalizeText(l.nombre).includes(term) || normalizeText(l.ref).includes(term)) resultados.push({ titulo: l.nombre, icono: <MapPin className="text-red-500" />, contenido: `${l.ref} - ${l.tip}`, tipo: 'texto', categoriaOriginal: 'Lugares' }); });
            if (cat === 'todos' || cat === 'bancos') guiaData.bancos.forEach(b => { if (normalizeText(b.nombre).includes(term) || normalizeText(b.ref).includes(term)) resultados.push({ titulo: b.nombre, icono: <Landmark className="text-green-700" />, contenido: `${b.ref} - ${b.tip}`, tipo: 'texto', categoriaOriginal: 'Bancos' }); });
            if (cat === 'todos' || cat === 'teleferico') guiaData.teleferico.forEach(t => { if (normalizeText(t.linea).includes(term) || normalizeText(t.ruta).includes(term)) resultados.push({ titulo: `Teleférico ${t.linea}`, icono: <CableCar className="text-blue-500" />, contenido: t.ruta, tipo: 'texto', categoriaOriginal: 'Teleférico' }); });
            if (cat === 'todos' || cat === 'pumakatari') guiaData.pumakatari.forEach(p => {
                if (normalizeText(p.ruta).includes(term) || normalizeText(p.clave).includes(term) || normalizeText(p.imagen).includes(term)) resultados.push({
                    titulo: `PumaKatari ${p.ruta}`, icono: <Bus className="text-blue-500" />, contenido: p.clave, tipo: 'texto', categoriaOriginal: 'La Paz BUS'
                });
            });
            if (cat === 'todos' || cat === 'micros') guiaData.micros.forEach(m => { if (normalizeText(m.linea).includes(term) || normalizeText(m.ruta).includes(term) || normalizeText(m.clave).includes(term) || normalizeText(m.tipo || '').includes(term)) resultados.push({ titulo: `Línea ${m.linea}`, icono: <CarFront className="text-green-600" />, contenido: `${m.ruta} (${m.clave})`, tipo: 'texto', categoriaOriginal: 'Sindicato', badge: { text: m.tipo || 'Mini', color: m.colorBadge } }); });
        }

        // Biblioteca
        if (vistaPrincipal === 'biblioteca') {
            documentos.forEach(d => {
                if (normalizeText(d.nombre).includes(term)) {
                    resultados.push({
                        titulo: d.nombre,
                        icono: <FileText className="text-blue-500" />,
                        contenido: `${d.tipo} - ${d.peso}`,
                        tipo: 'descarga',
                        categoriaOriginal: 'Biblioteca',
                        url: d.url
                    });
                }
            });
        }

        return resultados;
    }, [busqueda, vistaPrincipal, activeGuiaCat, guiaData, documentos]);

    const getSearchPlaceholder = () => {
        if (vistaPrincipal === 'guia') {
            if (activeGuiaCat === 'todos') return "Buscar en toda la Guía...";
            const catLabel = categoriasGuiaMenu.find(c => c.id === activeGuiaCat)?.label;
            return `Buscar en ${catLabel}...`;
        }
        if (vistaPrincipal === 'biblioteca') {
            return "Buscar documentos...";
        }
        return "Buscar protocolo...";
    };

    const reportarIncidente = () => {
        window.open(`https://wa.me/59172069451?text=${encodeURIComponent("🚨 *Reporte de Incidente Cebra* 🚨\n\nNecesito apoyo:")}`, '_blank');
    };
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <main className="min-h-screen bg-slate-50 pb-24 font-sans relative">
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
                                ${link.path === '/recursos'
                                            ? 'bg-slate-900 border-slate-900 text-white shadow-lg'

                                            : `bg-slate-50 border-transparent text-black ${link.hoverBg} hover:border-slate-200 ${link.color} ${link.border}`}

                            `}
                                >
                                    <span>{link.name}</span>
                                    {link.path === '/recursos' && <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>}
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
            <div className="sticky top-0 z-50 bg-slate-50/95 backdrop-blur-sm shadow-sm transition-all pb-2">
                <section className="bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700 p-2 pt-3 rounded-b-[2.5rem] shadow-lg mb-4 text-center relative overflow-hidden z-20">
                           {/* Portada Mini */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-50 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]"> </div>
                    <div className="relative z-10 flex flex-col items-center">
                        {/* Indicador Wifi Integrado */}
                        <div className="absolute top-0 left-4 p-2 bg-white/10 rounded-b-xl backdrop-blur-sm">
                            {usingOnlineData ? <Wifi size={16} className="text-green-200" /> : <WifiOff size={16} className="text-red-300" />}
                        </div>

                        <div className="bg-white/20 p-2 rounded-full mb-2 backdrop-blur-sm border-2 border-white/30 animate-bounce shadow-inner">
                            <ShieldAlert className="w-8 h-8 text-white/90" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-md">Caja de Herramientas</h1>
                        <p className="text-emerald-100 font-medium text-sm">Recursos para el voluntario.</p>
                         <div className="w-full max-w-md relative group  ">
                    {(vistaPrincipal !== 'comunidad') && (
                        <div className="mt-2 relative max-w-md mx-auto z-10 w-full group">
                            <Search className="absolute left-4 top-3.5 text-emerald-700/50 w-5 h-5 group-focus-within:text-emerald-600 transition-colors" />
                            <input type="text"
                             placeholder={getSearchPlaceholder()} 
                             value={busqueda} onChange={(e) => setBusqueda(e.target.value)}  className="block w-full pl-10 pr-3 py-2 border-none rounded-full leading-5 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:bg-white/30 focus:ring-2 focus:ring-white/50 focus:placeholder-white transition duration-150 ease-in-out sm:text-sm shadow-inner backdrop-blur-md" />
                            {busqueda && <button onClick={() => setBusqueda("")} className="absolute right-3 top-3 text-gray-400 hover:text-red-500"><X size={20} /></button>}
                        </div>
                    )}
                    </div>
                    </div>
                </section>

                {/* MENÚ PRINCIPAL (MÓVIL / PC) */}
                <div className="container mx-auto px-4 max-w-2xl mb-4 relative z-10">
                    {/* MÓVIL: NEUTRO Y COMPACTO */}
                    <div className="md:hidden">
                        <MobileNeutralNavBar
                            items={menuPrincipalItems}
                            activeId={vistaPrincipal}
                            setActiveId={setVistaPrincipal}
                            setBusqueda={setBusqueda}
                        />
                    </div>
                    {/* PC: CLÁSICO Y GRANDE */}
                    <div className="hidden md:block">
                        <DesktopNavBar
                            items={menuPrincipalItems}
                            activeId={vistaPrincipal}
                            setActiveId={setVistaPrincipal}
                            setBusqueda={setBusqueda}
                        />
                    </div>
                </div>

                {/* SUBMENÚS ARCOÍRIS (OPTIMIZADOS PARA MÓVIL) */}
                <div className="container mx-auto px-4 max-w-2xl">
                    {vistaPrincipal === 'protocolos' && !busqueda && (
                        <RainbowIconTabs items={categoriasMenu} activeId={activeCat} setActiveId={setActiveCat} setOpenItem={setOpenItem} />
                    )}
                    {vistaPrincipal === 'guia' && (
                        <RainbowIconTabs items={categoriasGuiaMenu} activeId={activeGuiaCat} setActiveId={setActiveGuiaCat} setOpenItem={() => { }} />
                    )}
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

            {loading && <div className="text-center py-10"><Loader2 className="w-8 h-8 animate-spin mx-auto text-green-500" /><p className="text-xs text-gray-400 mt-2">Sincronizando datos...</p></div>}

            {/* --- CONTENIDO PRINCIPAL --- */}
            <div className="container mx-auto px-4 max-w-2xl animate-fadeIn pt-2">

                {/* RESULTADOS DE BÚSQUEDA GENERAL */}
                {busqueda ? (
                    <div className="space-y-4 pb-20">
                        <h3 className="font-bold text-gray-400 text-sm uppercase tracking-wider ml-1">
                            Resultados de "{busqueda}"
                        </h3>
                        {resultadosBusqueda.length > 0 ? (
                            resultadosBusqueda.map((item, index) => (
                                <div key={index} className="bg-white rounded-xl border-l-4 border-yellow-400 shadow-sm p-4 animate-slideUp">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            {item.icono}
                                            <h4 className="font-bold text-gray-800">{item.titulo}</h4>
                                        </div>
                                        {item.badge && <span className={`text-xs font-bold px-2 py-1 rounded ${item.badge.color}`}>{item.badge.text}</span>}
                                    </div>
                                    <div className="text-sm text-gray-600 pl-8">
                                        {item.tipo === 'checklist' ? <ul className="list-disc pl-4">{item.contenido.map((c, i) => <li key={i}>{c}</li>)}</ul>
                                            : item.tipo === 'descarga' ? (
                                                <div className="flex justify-between items-center">
                                                    <span>{item.contenido}</span>
                                                    {item.url && item.url !== '#' && (
                                                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-green-600 font-bold text-xs flex items-center gap-1 hover:underline">
                                                            Descargar <ExternalLink size={12} />
                                                        </a>
                                                    )}
                                                </div>
                                            )
                                                : <div className="opacity-90">{item.contenido}</div>}
                                    </div>
                                    <div className="mt-2 text-right"><span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded uppercase font-bold">{item.categoriaOriginal}</span></div>
                                </div>
                            ))
                        ) : (<div className="text-center py-10 text-gray-400"><p>No encontré resultados 🦓</p></div>)}
                    </div>
                ) : (
                    /* CONTENIDO NORMAL POR PESTAÑAS */
                    <>
                        {/* 1. PROTOCOLOS */}
                        {vistaPrincipal === 'protocolos' && !loading && (
                            <div className="space-y-4 pb-20">
                                {protocolosData[activeCat].map((item, index) => (
                                    <div key={index} className={`bg-white rounded-2xl border-2 transition-all overflow-hidden ${openItem === item.titulo ? 'border-green-400 shadow-lg ring-4 ring-green-50' : 'border-transparent shadow-sm hover:shadow-md'}`}>
                                        <button onClick={() => toggleItem(item.titulo)} className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition">
                                            <div className="flex items-center gap-4"><div className={`p-3 rounded-xl shrink-0 transition-colors ${openItem === item.titulo ? 'bg-green-100' : 'bg-gray-100'}`}>{item.icono}</div><span className={`font-bold text-lg leading-tight ${openItem === item.titulo ? 'text-green-700' : 'text-gray-800'}`}>{item.titulo}</span></div>
                                            {openItem === item.titulo ? <ChevronUp className="text-green-500" /> : <ChevronDown className="text-gray-300" />}
                                        </button>
                                        {openItem === item.titulo && <div className="px-6 pb-6 pt-0 animate-fadeIn text-gray-700"><div className="h-px bg-gray-100 mb-4 w-full"></div>{item.tipo === 'checklist' ? <><InteractiveChecklist items={item.contenido} />{item.extraInfo}</> : item.contenido}</div>}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* 2. GUÍA URBANA */}
                        {vistaPrincipal === 'guia' && !loading && (
                            <div className="space-y-6 pb-20">
                                {(activeGuiaCat === 'todos' || activeGuiaCat === 'lugares') && guiaData.lugares.length > 0 && <div><h3 className="text-lg font-black text-gray-800 mb-3 flex items-center gap-2"><MapPin className="text-red-500" /> Lugares Frecuentes</h3><div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">{guiaData.lugares.map((lugar, i) => (<div key={i} className="p-4 flex items-start gap-3 hover:bg-gray-50 transition"><div className="mt-1 text-red-400"><MapPin size={18} /></div><div><h4 className="font-bold text-gray-800">{lugar.nombre}</h4><p className="text-xs text-gray-500 font-bold uppercase mb-1">{lugar.ref}</p><p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100 inline-block">🚌 {lugar.tip}</p></div></div>))}</div></div>}
                                {(activeGuiaCat === 'todos' || activeGuiaCat === 'bancos') && guiaData.bancos.length > 0 && <div><h3 className="text-lg font-black text-gray-800 mb-3 flex items-center gap-2"><Landmark className="text-green-700" /> Bancos y Cajeros</h3><div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">{guiaData.bancos.map((banco, i) => (<div key={i} className="p-4 flex items-start gap-3 hover:bg-gray-50 transition"><div className="mt-1 text-green-600"><CreditCard size={18} /></div><div><h4 className="font-bold text-gray-800">{banco.nombre}</h4><p className="text-xs text-gray-500 font-bold uppercase mb-1">{banco.ref}</p><p className="text-sm text-gray-600 italic">💡 {banco.tip}</p></div></div>))}</div></div>}
                                {(activeGuiaCat === 'todos' || activeGuiaCat === 'teleferico') && guiaData.teleferico.length > 0 && <div><h3 className="text-lg font-black text-gray-800 mb-3 flex items-center gap-2"><CableCar className="text-blue-500" /> Líneas de Teleférico</h3><div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{guiaData.teleferico.map((linea, i) => (<div key={i} className={`p-4 rounded-xl shadow-sm text-white ${linea.color} flex flex-col justify-between`}><div className="flex justify-between items-start mb-2"><span className="font-black text-lg">Línea {linea.linea}</span><div className="bg-white/20 p-1 rounded-full"><CableCar size={16} /></div></div><p className="text-xs font-medium opacity-90">{linea.ruta}</p></div>))}</div></div>}
                                {(activeGuiaCat === 'todos' || activeGuiaCat === 'pumakatari') && guiaData.pumakatari.length > 0 && <div><h3 className="text-lg font-black text-gray-800 mb-3 flex items-center gap-2"><Bus className="text-orange-500" /> La Paz BUS (PumaKatari)</h3><div className="space-y-2">{guiaData.pumakatari.map((bus, i) => (<div key={i} className="bg-white border-l-4 border-orange-500 p-4 rounded-r-xl shadow-sm flex justify-between items-center"><div><h4 className="font-bold text-gray-800">Ruta {bus.ruta}</h4><p className="text-xs text-gray-500">{bus.clave}</p></div><button onClick={() => window.open(bus.imagen, '_blank')}>
                                    <Bus className="text-red-500" size={22} />
                                </button></div>))}</div></div>}

                                {(activeGuiaCat === 'todos' || activeGuiaCat === 'micros') && guiaData.micros.length > 0 && <div><h3 className="text-lg font-black text-gray-800 mb-3 flex items-center gap-2"><CarFront className="text-green-600" /> Transporte Público (Sindicatos)</h3><div className="space-y-2">{guiaData.micros.map((micro, i) => (<div key={i} className="bg-white border-l-4 border-green-600 p-4 rounded-r-xl shadow-sm flex flex-col gap-1"><div className="flex justify-between items-start"><h4 className="font-bold text-gray-800">Línea {micro.linea}</h4><span className={`text-xs font-bold px-2 py-1 rounded ${micro.colorBadge || 'bg-gray-200 text-gray-700'}`}>{micro.tipo || 'Mini'}</span></div><p className="text-sm font-medium text-gray-700">{micro.ruta}</p><p className="text-xs text-gray-500 mt-1">🚩 {micro.clave}</p></div>))}</div></div>}
                            </div>
                        )}

                        {/* 3. BIBLIOTECA (Lista directa) */}
                        {vistaPrincipal === 'biblioteca' && !loading && (
                            <div className="pb-20">
                                <div className="mb-4">
                                    <h2 className="text-xl font-black mb-4 flex items-center gap-2 text-gray-800"><Download className="text-blue-500" /> Documentos Oficiales</h2>
                                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 divide-y divide-gray-100">
                                        {documentos.map((doc, i) => <DescargaItem key={i} nombre={doc.nombre} tipo={doc.tipo} peso={doc.peso} url={doc.url} />)}
                                        {documentos.length === 0 && <p className="p-4 text-center text-gray-400 text-sm">No hay documentos disponibles.</p>}
                                    </div>
                                </div>
                               
                            </div>
                        )}

                        {/* 4. COMUNIDAD */}
                        {vistaPrincipal === 'comunidad' && !loading && (
                            <div className="pb-24 space-y-6">
                                <div className={`bg-gradient-to-br ${valorActual.color} rounded-2xl p-5 shadow-lg text-white relative overflow-hidden transition-all duration-500`}>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 animate-pulse-slow"></div>
                                    <div className="relative z-10 flex flex-col items-center text-center">
                                        <div className="bg-white/20 p-2 rounded-full shadow-inner mb-3 backdrop-blur-sm"><Star className="text-white w-8 h-8" fill="currentColor" /></div>
                                        <span className="text-white/80 font-bold text-xs uppercase tracking-wider mb-1">Filosofía Cebra (Semana Actual)</span>
                                        <h2 className="text-3xl font-black mb-2">{valorActual.valor}</h2>
                                        <p className="text-white font-medium text-lg italic">"{valorActual.filosofia}"</p>
                                    </div>
                                </div>
                           
                                <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                                    <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-blue-800 flex items-center gap-2"><Lightbulb className="text-blue-600" size={20} /> Consejos de la Manada</h3><button onClick={() => setModalConsejoOpen(true)} className="bg-white text-blue-600 p-2 rounded-full shadow-sm hover:bg-blue-100 transition"><PlusCircle size={20} /></button></div>
                                    <div className="space-y-3">{consejos.map((c, i) => (<div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-blue-100 text-sm italic relative"><Sparkles size={14} className="absolute top-2 right-2 text-yellow-400" /><p className="text-gray-600">"{c.texto}"</p><p className="text-xs text-right text-gray-400 mt-2">- {c.autor}</p></div>))}</div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* --- MODAL Y SOS --- */}
            <ModalConsejo isOpen={modalConsejoOpen} onClose={() => setModalConsejoOpen(false)} />
            <div className="fixed bottom-6 right-6 z-50">
                <button onClick={() => setSosOpen(!sosOpen)} className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 relative z-20 ${sosOpen ? 'bg-gray-800 rotate-45' : 'bg-red-600 animate-pulse-slow hover:scale-110'}`}>
                    {sosOpen ? <X className="text-white" size={32} /> : <Siren className="text-white" size={32} />}
                </button>
                <div className={`absolute bottom-20 right-0 flex flex-col gap-3 transition-all duration-300 ${sosOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                    <a href="tel:165" className="bg-white text-gray-800 p-3 pr-6 rounded-full shadow-xl flex items-center gap-3 hover:bg-red-50 border-r-4 border-red-500 group whitespace-nowrap"><div className="bg-red-100 p-2 rounded-full group-hover:bg-red-200 text-red-600"><span className="text-xl">🚑</span></div><div className="text-right"><p className="font-bold text-sm">Ambulancia</p><p className="text-xs text-gray-500 font-mono">165</p></div></a>
                    <a href="tel:110" className="bg-white text-gray-800 p-3 pr-6 rounded-full shadow-xl flex items-center gap-3 hover:bg-blue-50 border-r-4 border-blue-500 group whitespace-nowrap"><div className="bg-blue-100 p-2 rounded-full group-hover:bg-blue-200 text-blue-600"><span className="text-xl">👮</span></div><div className="text-right"><p className="font-bold text-sm">Policía</p><p className="text-xs text-gray-500 font-mono">110</p></div></a>
                    <div className="bg-black text-white px-4 py-2 rounded-xl text-center shadow-lg mb-1"><p className="font-bold text-xs">EMERGENCIA</p></div>
                </div>
            </div>
        </main>
    );
}

function DescargaItem({ nombre, tipo, peso, url }) {
    const isDownloadable = url && url !== '#' && url !== '';
    return (
        <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition cursor-pointer group">
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg font-bold text-[10px] flex items-center justify-center shadow-sm border ${tipo === 'PDF' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>{tipo}</div>
                <div><h4 className="font-bold text-gray-700 text-sm group-hover:text-black">{nombre}</h4><span className="text-xs text-gray-400">{peso}</span></div>
            </div>
            {isDownloadable ? (
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-green-600 transition bg-white p-2 rounded-full border border-transparent hover:border-gray-200 shadow-sm">
                    <Download size={18} />
                </a>
            ) : (
                <button disabled className="text-gray-200 bg-gray-50 p-2 rounded-full cursor-not-allowed">
                    <Download size={18} />
                </button>
            )}
        </div>
    );
}