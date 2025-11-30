"use client";

import React, { useState } from 'react';
import { 
  ShieldAlert, Clock, FileText, Download, Phone, 
  ChevronDown, ChevronUp, AlertTriangle, Users, 
  School, Footprints, Info, Palette, Gamepad2, MessageCircle,
  BookOpen, FolderOpen
} from 'lucide-react';

// --- 1. DATOS DE PROTOCOLOS (Misma información de antes) ---
const protocolosData = {
  rutina: [
    {
      titulo: "Horarios y Asistencia",
      icono: <Clock className="text-blue-500" />,
      contenido: (
        <div className="space-y-3 text-sm">
          <p><strong>Mañana:</strong> 08:00 A 12:00</p>
          <p><strong>Tarde:</strong> 14:30 a 18:30</p>
          <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
            <p className="font-bold">⚠️ Tolerancia:</p>
            <p>De 5 a 10 minutos (Coordinador-cebra).</p>
          </div>
          <p><strong>Rutina Diaria:</strong></p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Llamada de asistencia por el coordinador.</li>
            <li>Calentamiento obligatorio.</li>
            <li>Revisión de traje (Lunes). Portar 1 Bs.</li>
          </ul>
        </div>
      )
    },
    {
      titulo: "Normas de Convivencia",
      icono: <Users className="text-green-500" />,
      contenido: (
        <ul className="list-disc pl-5 space-y-2 text-sm">
          <li><strong>Prohibido:</strong> Audífonos/Distracción.</li>
          <li><strong>Cero Alcohol:</strong> Baja inmediata.</li>
          <li><strong>Familia Cebra:</strong> Respeto entre compañeros.</li>
        </ul>
      )
    },
    {
      titulo: "Formatos de Informe",
      icono: <FileText className="text-gray-500" />,
      contenido: (
        <div className="space-y-4 text-sm">
          <div className="bg-gray-50 p-3 rounded border border-gray-200">
            <h4 className="font-bold mb-2 border-b pb-1">Informe Semanal</h4>
            <p>NOMBRE / TURNO / FECHAS</p>
            <p>LUGAR / DESCRIPCION / FIRMA</p>
          </div>
          <div className="bg-gray-50 p-3 rounded border border-gray-200">
            <h4 className="font-bold mb-2 border-b pb-1">Informe Actividad</h4>
            <p>INSTITUCION / POBLACION</p>
            <p>RESULTADOS / FIRMA</p>
          </div>
        </div>
      )
    }
  ],
  calle: [
    {
      titulo: "Protocolo Acción en Calles",
      icono: <Footprints className="text-black" />,
      contenido: (
        <div className="space-y-2 text-sm">
          <p><strong>Los 7 Pasos de Análisis:</strong></p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Semáforos (tiempo/ubicación).</li>
            <li>Paso peatonal (pintura).</li>
            <li>Coordinación si no hay semáforo.</li>
            <li>Ubicación estratégica (no estorbar).</li>
            <li>Contenedores basura.</li>
            <li>Paradas transporte.</li>
            <li>Baches/Rompe muelles.</li>
          </ol>
        </div>
      )
    },
    {
      titulo: "Uso de Baños",
      icono: <Info className="text-blue-400" />,
      contenido: (
        <ul className="list-disc pl-5 space-y-2 text-sm">
          <li>Comunicar a compañeros.</li>
          <li><strong>Ir acompañado</strong> (seguridad).</li>
          <li>Máximo 5-10 minutos.</li>
        </ul>
      )
    }
  ],
  riesgos: [
    {
      titulo: "Estado de Ebriedad",
      icono: <AlertTriangle className="text-orange-500" />,
      contenido: (
        <div className="space-y-3 text-sm">
          <div className="p-2 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <strong>Nivel 1 (Diálogo):</strong> Alejarse con actitud cebra.
          </div>
          <div className="p-2 bg-orange-50 border-l-4 border-orange-400 rounded">
            <strong>Nivel 2 (Contacto):</strong> Alejarse sin violencia. Buscar apoyo.
          </div>
          <div className="p-2 bg-red-50 border-l-4 border-red-500 rounded">
            <strong>Nivel 3 (Violencia):</strong> Recurrir a policía, gritar, llamar coordinador.
          </div>
        </div>
      )
    },
    {
      titulo: "Acoso",
      icono: <ShieldAlert className="text-red-600" />,
      contenido: (
        <div className="space-y-3 text-sm">
          <div className="p-2 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <strong>Nivel 1:</strong> Observar intenciones. Tomar distancia.
          </div>
          <div className="p-2 bg-orange-50 border-l-4 border-orange-400 rounded">
            <strong>Nivel 2:</strong> Si toca mano: Alejar, elevar voz, informar.
          </div>
          <div className="p-2 bg-red-50 border-l-4 border-red-500 rounded">
            <strong>Nivel 3 (Toque impúdico):</strong> Sujetar persona, gritar ayuda. <strong>Quitarse cabeza si es necesario.</strong>
          </div>
        </div>
      )
    },
    {
      titulo: "Manifestaciones",
      icono: <Users className="text-purple-500" />,
      contenido: (
        <ul className="list-disc pl-5 space-y-2 text-sm">
          <li>Protegerse en galerías (Máx 10 min).</li>
          <li>Cambiar de punto.</li>
          <li>Cuidar neutralidad política.</li>
        </ul>
      )
    }
  ],
  grupos: [
    {
      titulo: "Protocolo Niños",
      icono: <Users className="text-pink-500" />,
      contenido: (
        <ul className="list-disc pl-5 space-y-2 text-sm">
          <li>Nivel rodillas. Saludo gestual.</li>
          <li><strong>Abrazo:</strong> Pedir permiso a padres.</li>
          <li><strong>Extraviado:</strong> Llevar a policía acompañado.</li>
        </ul>
      )
    },
    {
      titulo: "Personas con Discapacidad",
      icono: <Users className="text-blue-600" />,
      contenido: (
        <div className="space-y-3 text-sm">
          <p><strong>Ciegas:</strong> Ofrecer brazo.</p>
          <p><strong>Silla Ruedas:</strong> Nivel medio. Preguntar ayuda.</p>
          <p><strong>Sordas:</strong> Gestual. Guiar máx 2 cuadras.</p>
        </div>
      )
    }
  ],
  escuelas: [
    {
      titulo: "Protocolo en Unidades Educativas",
      icono: <School className="text-indigo-500" />,
      contenido: (
        <div className="space-y-3 text-sm">
          <ul className="list-disc pl-5 space-y-1 mb-2">
            <li>Ubicar vestidor seguro.</li>
            <li>Siempre con encargado presente.</li>
            <li><strong>NUNCA</strong> a solas con niños.</li>
            <li>No acompañar al baño.</li>
          </ul>
        </div>
      )
    },
    {
      titulo: "Aplicación Artística",
      icono: <Palette className="text-purple-500" />,
      contenido: (
        <div className="space-y-4 text-sm">
          <div className="bg-pink-50 p-3 rounded-lg border border-pink-100">
             <h4 className="font-bold text-pink-700 mb-1 flex items-center gap-2">
               <Users size={16} /> Inicial
             </h4>
             <ul className="list-disc pl-5 text-gray-700">
                <li>Títeres, Cuentos, Canciones.</li>
             </ul>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
             <h4 className="font-bold text-blue-700 mb-1 flex items-center gap-2">
               <Gamepad2 size={16} /> Primaria
             </h4>
             <ul className="list-disc pl-5 text-gray-700">
                <li>Cuentos, Títeres, Dinámicas, Teatro.</li>
             </ul>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
             <h4 className="font-bold text-orange-700 mb-1 flex items-center gap-2">
               <MessageCircle size={16} /> Secundaria
             </h4>
             <ul className="list-disc pl-5 text-gray-700">
                <li>Teatro, Reflexión, Compromiso.</li>
             </ul>
          </div>
        </div>
      )
    }
  ]
};

// Categorías del Submenú
const categoriasMenu = [
  { id: 'rutina', label: 'Rutina' },
  { id: 'calle', label: 'Calle' },
  { id: 'riesgos', label: 'Riesgos' },
  { id: 'grupos', label: 'Grupos' },
  { id: 'escuelas', label: 'Colegios' },
];

export default function Recursos() {
  // ESTADO PRINCIPAL: ¿Qué vista estamos viendo?
  const [vistaPrincipal, setVistaPrincipal] = useState<'protocolos' | 'biblioteca'>('protocolos');
  
  // ESTADOS SECUNDARIOS (Para la vista de protocolos)
  const [activeCat, setActiveCat] = useState('rutina');
  const [openItem, setOpenItem] = useState<string | null>(null);

  const toggleItem = (titulo: string) => {
    setOpenItem(openItem === titulo ? null : titulo);
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      
      {/* 1. CABECERA GLOBAL */}
      <section className="bg-yellow-400 p-8 pt-10 rounded-b-[2.5rem] shadow-lg mb-6 text-center">
        <ShieldAlert className="w-12 h-12 text-black mx-auto mb-2" />
        <h1 className="text-3xl font-black text-black mb-1">Caja de Ayuda</h1>
        <p className="text-black font-medium">Recursos para el voluntario.</p>
      </section>

      {/* 2. SWITCH PRINCIPAL (DOS PESTAÑAS GRANDES) */}
      <div className="container mx-auto px-4 max-w-2xl mb-6">
        <div className="bg-white p-1 rounded-2xl shadow-sm border border-gray-200 flex">
            <button 
                onClick={() => setVistaPrincipal('protocolos')}
                className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
                    ${vistaPrincipal === 'protocolos' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}
                `}
            >
                <BookOpen size={20} /> Protocolos
            </button>
            <button 
                onClick={() => setVistaPrincipal('biblioteca')}
                className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
                    ${vistaPrincipal === 'biblioteca' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}
                `}
            >
                <FolderOpen size={20} /> Biblioteca
            </button>
        </div>
      </div>

      {/* --- VISTA 1: PROTOCOLOS INTERACTIVOS --- */}
      {vistaPrincipal === 'protocolos' && (
        <div className="container mx-auto px-4 max-w-2xl animate-fadeIn">
            
            {/* Submenú de Categorías */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 mb-2">
                {categoriasMenu.map((cat) => (
                    <button
                    key={cat.id}
                    onClick={() => { setActiveCat(cat.id); setOpenItem(null); }}
                    className={`
                        whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold border-2 transition-all flex-shrink-0
                        ${activeCat === cat.id 
                        ? 'bg-yellow-400 text-black border-yellow-400 scale-105' 
                        : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-100'}
                    `}
                    >
                    {cat.label}
                    </button>
                ))}
            </div>

            {/* Lista Acordeón */}
            <div className="space-y-3 pb-10">
                {protocolosData[activeCat as keyof typeof protocolosData].map((item: any, index: number) => (
                    <div 
                    key={index}
                    className={`bg-white rounded-xl border-2 transition-all overflow-hidden
                        ${openItem === item.titulo ? 'border-yellow-400 shadow-md' : 'border-transparent shadow-sm'}
                    `}
                    >
                    <button 
                        onClick={() => toggleItem(item.titulo)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition"
                    >
                        <div className="flex items-center gap-4">
                        <div className="bg-gray-100 p-2 rounded-lg shrink-0">
                            {item.icono}
                        </div>
                        <span className="font-bold text-gray-800 text-lg leading-tight">
                            {item.titulo}
                        </span>
                        </div>
                        {openItem === item.titulo ? <ChevronUp className="text-gray-400"/> : <ChevronDown className="text-gray-400"/>}
                    </button>

                    {openItem === item.titulo && (
                        <div className="px-5 pb-5 pt-0 animate-fadeIn text-gray-700">
                        <div className="h-px bg-gray-100 mb-4 w-full"></div>
                        {item.contenido}
                        </div>
                    )}
                    </div>
                ))}
            </div>
        </div>
      )}

      {/* --- VISTA 2: BIBLIOTECA (DESCARGAS + TELÉFONOS) --- */}
      {vistaPrincipal === 'biblioteca' && (
        <div className="container mx-auto px-4 max-w-2xl animate-fadeIn pb-10">
            
            {/* Sección Descargas */}
            <div className="mb-8">
                <h2 className="text-xl font-black mb-4 flex items-center gap-2">
                    <Download className="text-blue-500" /> Documentos Oficiales
                </h2>
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                    <DescargaItem nombre="Manual del Educador 2025" tipo="PDF" peso="2.5 MB" />
                    <DescargaItem nombre="Reglamento Interno" tipo="PDF" peso="1.2 MB" />
                    <DescargaItem nombre="Guía de Actividades Artísticas" tipo="PDF" peso="3.0 MB" />
                    <DescargaItem nombre="Infografía Señalización" tipo="IMG" peso="500 KB" />
                </div>
                <p className="text-xs text-gray-400 text-center mt-3">* Descarga con WiFi para ahorrar datos.</p>
            </div>

            {/* Sección Teléfonos (Aquí tienen más protagonismo) */}
            <div>
                <h2 className="text-xl font-black mb-4 flex items-center gap-2 text-red-600">
                    <Phone className="text-red-500" /> Directorio de Emergencia
                </h2>
                <div className="bg-white p-6 rounded-2xl shadow-sm border-l-8 border-red-500">
                    <div className="grid grid-cols-2 gap-4">
                        <a href="tel:110" className="bg-red-50 text-red-700 font-bold p-4 rounded-xl text-center border border-red-100 flex flex-col items-center hover:bg-red-100 transition">
                            <span className="text-3xl mb-1">👮</span>
                            <span className="text-xl">110</span>
                            <span className="text-xs uppercase mt-1">Policía</span>
                        </a>
                        <a href="tel:165" className="bg-red-50 text-red-700 font-bold p-4 rounded-xl text-center border border-red-100 flex flex-col items-center hover:bg-red-100 transition">
                            <span className="text-3xl mb-1">🚑</span>
                            <span className="text-xl">165</span>
                            <span className="text-xs uppercase mt-1">Ambulancia</span>
                        </a>
                        <a href="tel:+59100000000" className="col-span-2 bg-black text-yellow-400 font-bold p-4 rounded-xl text-center flex items-center justify-center gap-3 hover:bg-gray-800 transition shadow-lg">
                            <Phone size={24} /> 
                            <div>
                                <span className="block text-sm font-normal text-gray-300">Emergencia Cebra</span>
                                <span className="block text-lg">Llamar Coordinador</span>
                            </div>
                        </a>
                    </div>
                </div>
            </div>

        </div>
      )}

    </main>
  );
}

// Componente auxiliar para item de descarga
function DescargaItem({ nombre, tipo, peso }: any) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className={`
          w-12 h-12 rounded-xl font-bold text-xs flex items-center justify-center shadow-sm
          ${tipo === 'PDF' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}
        `}>
          {tipo}
        </div>
        <div>
          <h4 className="font-bold text-gray-800 text-sm group-hover:text-black">{nombre}</h4>
          <span className="text-xs text-gray-400">{peso}</span>
        </div>
      </div>
      <button className="text-gray-300 hover:text-black transition">
        <Download size={24} />
      </button>
    </div>
  );
}