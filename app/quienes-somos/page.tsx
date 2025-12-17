"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  // Iconos generales
  Heart, Star, User, Home, Award, ChevronDown, CheckCircle2, Menu, X,
  Dna, History, Smile, Trophy, Target, BookOpen, Sparkles, LayoutGrid,

  // Iconos Valores
  HandHeart, UsersRound, Hourglass, Gift, Handshake, Sprout, ClipboardCheck, LifeBuoy,
} from 'lucide-react';

// --- CONFIGURACIÓN DE DATOS ---
// --- DATOS GLOBALES (Menú Hamburguesa) ---

const globalLinks = [
  { name: 'Inicio', path: '/', color: 'text-red-600', hoverBg: 'hover:bg-red-50', border: 'hover:border-red-200' },
  { name: 'Agenda', path: '/noticias', color: 'text-orange-600', hoverBg: 'hover:bg-orange-50', border: 'hover:border-orange-200' },
  { name: 'Cancionero', path: '/cancionero', color: 'text-yellow-600', hoverBg: 'hover:bg-yellow-50', border: 'hover:border-yellow-200' },
  { name: 'Recursos', path: '/recursos', color: 'text-green-600', hoverBg: 'hover:bg-green-50', border: 'hover:border-green-200' },
  { name: 'Galería', path: '/galeria', color: 'text-cyan-600', hoverBg: 'hover:bg-cyan-50', border: 'hover:border-cyan-200' },
  { name: 'Identidad', path: '/quienes-somos', color: 'text-indigo-600', hoverBg: 'hover:bg-indigo-50', border: 'hover:border-indigo-200' },
];

const menuItems = [
  {
    id: 'adn',
    label: 'ADN Cebra',
    icon: <Dna size={18} />,
    subItems: [
      { id: 'mision', label: 'Misión/Visión', icon: <Target size={14} /> },
      { id: 'filosofia', label: '10 Filosofías', icon: <BookOpen size={14} /> },
      { id: 'valores', label: '10 Valores', icon: <Sparkles size={14} /> },
    ]
  },
  {
    id: 'origen',
    label: 'Origen',
    icon: <History size={18} />,
    subItems: [
      { id: 'piel', label: 'Evolución Piel', icon: <User size={14} /> },
      { id: 'historia', label: 'Línea Tiempo', icon: <History size={14} /> },
    ]
  },
  {
    id: 'vida',
    label: 'Vida Cebra',
    icon: <Smile size={18} />,
    subItems: [
      { id: 'personajes', label: 'Personajes', icon: <Smile size={14} /> },
      { id: 'casa', label: 'Casa Cebra', icon: <Home size={14} /> },
    ]
  },
  {
    id: 'logros',
    label: 'Logros',
    icon: <Trophy size={18} />,
    subItems: [
      { id: 'galardones', label: 'Galardones', icon: <Award size={14} /> },
    ]
  },
];

const paperTexture = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E")`;

// --- COMPONENTES UI (ESTILO UNIFICADO) ---

// 1. Barra de Iconos Arcoíris Compacta (Submenús sin slider)
const RainbowIconTabs = ({ items, onSubItemClick }) => {
  const rainbowColors = [
    { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200', active: 'bg-blue-600 text-white' },
    { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200', active: 'bg-purple-600 text-white' },
    { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200', active: 'bg-green-600 text-white' },
    { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200', active: 'bg-yellow-500 text-white' },
    { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200', active: 'bg-orange-500 text-white' },
    { bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-200', active: 'bg-indigo-600 text-white' },
    { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200', active: 'bg-red-600 text-white' },
  ];

  return (
    <div className="flex flex-col items-center w-full px-1">
      <div className="flex flex-wrap justify-center items-center gap-2 w-full">
        {items.map((item: any, index: number) => {
          const colorObj = rainbowColors[index % rainbowColors.length];
          return (
            <button
              key={item.id}
              onClick={() => onSubItemClick(item.id)}
              className={`
                relative rounded-full transition-all duration-300 flex items-center justify-center shrink-0 border
                ${colorObj.bg} ${colorObj.text} ${colorObj.border} opacity-90 hover:opacity-100 hover:scale-105
                px-4 py-1.5 
              `}
            >
              {item.icon}
              <span className="ml-1.5 text-[10px] font-bold whitespace-nowrap leading-none uppercase tracking-wide">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// 2. Barra de Navegación Móvil Neutra
const MobileNeutralNavBar = ({ items, activeId, setActiveId }) => {
  return (
    <div className="bg-white p-1 rounded-2xl shadow-sm border border-gray-100 flex justify-center gap-1 w-full max-w-sm mx-auto">
      {items.map((item) => {
        const isActive = activeId === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveId(item.id)}
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
export default function QuienesSomos() {
  const [activeTab, setActiveTab] = useState('adn');
  const [globalMenuOpen, setGlobalMenuOpen] = useState(false);
  //const [selectedSkin, setSelectedSkin] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // Manejar el scroll a la sección
  // Manejar scroll a secciones
  const handleScrollTo = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 180;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  // Scroll automático al cambiar de pestaña principal
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  // Obtener submenús de la pestaña activa
  const currentSubItems = menuItems.find(item => item.id === activeTab)?.subItems || [];

  // Estado local para la evolución de piel (Solo visual)
  const [selectedSkin, setSelectedSkin] = useState(0);


  return (
    <main className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-800" style={{ backgroundImage: paperTexture }}>
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
                                ${link.path === '/quienes-somos'
                      ? 'bg-slate-900 border-slate-900 text-white shadow-lg'

                      : `bg-slate-50 border-transparent text-black ${link.hoverBg} hover:border-slate-200 ${link.color} ${link.border}`}

                            `}
                >
                  <span>{link.name}</span>
                  {link.path === '/quienes-somos' && <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>}
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

      {/* --- HEADER STICKY (Navegación Unificada) --- */}
      <div className="sticky top-0 z-50 bg-slate-50/90 backdrop-blur-sm shadow-sm transition-all pb-2">
        {/* Portada Mini */}
        <section className="bg-gradient-to-br from-slate-900 via-purple-800 to-slate-900 p-2 pt-3 rounded-b-[2.5rem] shadow-lg mb-4 text-center relative overflow-hidden z-20">
          <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[url('https://www.transparenttextures.com/patterns/gplay.png')]"></div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-white/20 p-2 rounded-full mb-2 backdrop-blur-sm border-2 border-white/30 animate-bounce">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 tracking-tight drop-shadow-sm">Nuestra Identidad</h1>
            <p className="text-slate-300 font-medium text-sm">El corazón del Educador Urbano.</p>
          </div>
        </section>
        

        {/* Menú Principal */}
        <div className="container mx-auto px-4 max-w-2xl mb-2 relative z-10 ">
          <div className="md:hidden ">
            <MobileNeutralNavBar items={menuItems} activeId={activeTab} setActiveId={setActiveTab} />
          </div>
          <div className="hidden md:block">
            <DesktopNavBar items={menuItems} activeId={activeTab} setActiveId={setActiveTab} />
          </div>
        </div>

        {/* Submenú de Categorías (Arcoíris Compacto) */}
        {currentSubItems.length > 0 && (
          <div className="container mx-auto px-4 max-w-2xl">
            <RainbowIconTabs items={currentSubItems} onSubItemClick={handleScrollTo} />
          </div>
        )}

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

      <div className="container mx-auto px-4 max-w-5xl mt-6">



        {/* ============================================================
            TAB 1: ADN CEBRA
           ============================================================ */}
        {activeTab === 'adn' && (
          <div className="space-y-16 animate-fadeIn">

            {/* ID PARA SCROLL: Misión */}
            <div id="mision" className="flex flex-col lg:flex-row gap-8 items-center scroll-mt-32">
              <div className="flex-1 w-full space-y-6">
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-xl transition-all duration-500">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Target size={100} />
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                      <Target size={24} />
                    </div>
                    <h2 className="font-black text-2xl text-slate-800">Misión</h2>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-lg">
                    Educar y generar procesos de reflexión en comunidad, mediante acciones destinadas a lograr el cambio y fortalecimiento de actitudes, poniendo en práctica valores, derechos y obligaciones.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-xl transition-all duration-500">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Star size={100} />
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
                      <Star size={24} />
                    </div>
                    <h2 className="font-black text-2xl text-slate-800">Visión</h2>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-lg">
                    Ser referente de una cultura ciudadana a nivel nacional e internacional, con el ejercicio pleno de valores, alcanzando la unidad en la diversidad.
                  </p>
                </div>
              </div>

              <div className="w-full lg:w-1/3 h-96 relative rounded-[2.5rem] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition duration-500 group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                {/* Reemplaza con tu imagen */}
                <div className="bg-slate-200 w-full h-full flex items-center justify-center text-slate-500">
                  <Image src="/images/IMG-20200306-WA0011.jpg" fill className="object-cover group-hover:scale-110 transition duration-700" alt="Misión Cebra" />
                </div>
                <div className="absolute bottom-6 left-6 z-20 text-white">
                  <p className="font-bold text-lg">Educación Urbana</p>
                  <p className="text-sm opacity-90">Construyendo comunidad</p>
                </div>
              </div>
            </div>

            {/* ID PARA SCROLL: Filosofía */}
            <div id="filosofia" className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-slate-100 scroll-mt-32">
              <div className="text-center mb-10">
                <span className="bg-cyan-100 text-cyan-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block">Decálogo</span>
                <h2 className="text-3xl md:text-4xl font-black text-slate-800">Filosofía Cebra</h2>
              </div>

              <div className="flex flex-col md:flex-row gap-10">
                <ul className="flex-1 space-y-3">
                  {[
                    "Educar no es prohibir.",
                    "Disfruto de lo que hago.",
                    "Estar siempre alerta.",
                    "Lograr la reflexión del ciudadano",
                    "Ser responsable",
                    "Amar el lugar que habito",
                    "Ponerse en el lugar del otro",
                    "Conquistar con amor a la gente",
                    "Tocar la emoción de la gente",
                    "Ser considerado con todos"
                  ].map((texto, index) => {
                    const num = index + 1;
                    return (
                      <li
                        key={num}
                        className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-cyan-50 border border-transparent hover:border-cyan-100 transition-all duration-300"
                      >
                        <span className="bg-slate-100 text-slate-500 group-hover:bg-cyan-500 group-hover:text-white font-black w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors">
                          {num}
                        </span>
                        <span className="text-slate-600 font-medium group-hover:text-cyan-900">
                          {texto}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <div className="w-full md:w-1/3 min-h-[400px] bg-slate-100 rounded-3xl relative overflow-hidden flex items-center justify-center">
                  <div className="text-slate-400 text-sm font-bold">[FOTO FILOSOFÍA]</div>
                  {/* <Image src="..." fill className="object-cover" /> */}
                </div>
              </div>
            </div>

            {/* ID PARA SCROLL: Valores */}
            <div id="valores" className="py-8 scroll-mt-32">
              <h2 className="text-3xl font-black text-center mb-10 text-slate-800">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-600">
                  Nuestros 10 Valores
                </span>
              </h2>

              {(() => {
                const valoresData = [
                  { nombre: "Bondad", icon: HandHeart, colorStyle: "bg-rose-100 text-rose-600 hover:bg-rose-50 border-rose-200" },
                  { nombre: "Sinceridad", icon: Sparkles, colorStyle: "bg-blue-100 text-blue-600 hover:bg-blue-50 border-blue-200" },
                  { nombre: "Empatía", icon: UsersRound, colorStyle: "bg-purple-100 text-purple-600 hover:bg-purple-50 border-purple-200" },
                  { nombre: "Amor", icon: Heart, colorStyle: "bg-red-100 text-red-600 hover:bg-red-50 border-red-200" },
                  { nombre: "Paciencia", icon: Hourglass, colorStyle: "bg-amber-100 text-amber-600 hover:bg-amber-50 border-amber-200" },
                  { nombre: "Gratitud", icon: Gift, colorStyle: "bg-teal-100 text-teal-600 hover:bg-teal-50 border-teal-200" },
                  { nombre: "Perdón", icon: Handshake, colorStyle: "bg-indigo-100 text-indigo-600 hover:bg-indigo-50 border-indigo-200" },
                  { nombre: "Humildad", icon: Sprout, colorStyle: "bg-green-100 text-green-600 hover:bg-green-50 border-green-200" },
                  { nombre: "Responsabilidad", icon: ClipboardCheck, colorStyle: "bg-cyan-100 text-cyan-600 hover:bg-cyan-50 border-cyan-200" },
                  { nombre: "Solidaridad", icon: LifeBuoy, colorStyle: "bg-orange-100 text-orange-600 hover:bg-orange-50 border-orange-200" },
                ];

                return (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    {valoresData.map((valor, i) => {
                      const [bgClass, textClass, hoverClass, borderClass] = valor.colorStyle.split(" ");
                      return (
                        <div
                          key={i}
                          className={`group flex flex-col items-center p-5 rounded-3xl bg-white border border-dashed ${borderClass} shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-default`}
                        >
                          <div className={`w-14 h-14 mb-4 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${bgClass} ${textClass}`}>
                            <valor.icon className="w-7 h-7" />
                          </div>
                          <h3 className="font-bold text-slate-700 text-lg">{valor.nombre}</h3>
                        </div>
                      )
                    })}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* === TAB 2: ORIGEN (Animaciones Contextuales) === */}
        {activeTab === 'origen' && (
          <div className="space-y-16 animate-fadeIn">

            {/* Evolución Piel (Animada) */}
            <div id="piel" className="bg-white p-6 md:p-12 rounded-[3rem] shadow-xl border border-slate-100 text-center scroll-mt-48 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-yellow-400"></div>

              <h2 className="text-3xl font-black text-slate-800 mb-8 flex items-center justify-center gap-3">
                <User className="text-orange-500" /> Evolución de la Piel
              </h2>

              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-1/2">
                  <div className="relative aspect-square bg-slate-100 rounded-[2.5rem] flex items-center justify-center overflow-hidden border-4 border-white shadow-inner group">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/fabric-of-squares.png')] opacity-10"></div>
                    <div key={selectedSkin} className="text-center animate-fadeScale z-10 transition-all duration-500">
                      <span className="text-6xl mb-4 block transform group-hover:scale-110 transition-transform duration-500">🦓</span>
                      <div className="text-slate-400 font-bold text-xs uppercase tracking-widest border border-slate-300 px-3 py-1 rounded-full inline-block">
                        Modelo {pielesData[selectedSkin].anio}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-1/2 text-left space-y-6">
                  <div className="flex flex-wrap gap-2">
                    {pielesData.map((piel, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedSkin(index)}
                        className={`px-4 py-2 rounded-xl font-bold text-sm transition-all border-2
                                        ${selectedSkin === index
                            ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-200 transform scale-105'
                            : 'bg-white border-slate-100 text-slate-400 hover:border-orange-200 hover:text-orange-500'}
                                    `}
                      >
                        {piel.anio}
                      </button>
                    ))}
                  </div>

                  <div key={selectedSkin} className="animate-slideInRight">
                    <h3 className="text-2xl font-black text-slate-800 mb-2">{pielesData[selectedSkin].titulo}</h3>
                    <p className="text-slate-600 text-lg leading-relaxed">{pielesData[selectedSkin].descripcion}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Línea de Tiempo */}
            <div id="historia" className="scroll-mt-48">
              <h2 className="text-3xl font-black text-center mb-8">Nuestra Historia</h2>
              <div className="flex gap-4 overflow-x-auto pb-10 px-4 no-scrollbar snap-x snap-mandatory">
                {[{ año: 2001, t: "Nace el Programa", d: "24 jóvenes inician el sueño." }, { año: 2010, t: "Educadores Urbanos", d: "Cambio de enfoque pedagógico." }, { año: 2015, t: "Patrimonio Cultural", d: "Declaratoria UNESCO." }].map((h, i) => (
                  <div key={i} className="min-w-[280px] snap-center bg-white p-8 rounded-[2rem] shadow-sm border-t-8 border-orange-400 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300">
                    <span className="bg-orange-100 text-orange-800 px-4 py-1.5 rounded-full text-sm font-black mb-6">{h.año}</span>
                    <h3 className="font-black text-xl mb-2 text-slate-800">{h.t}</h3>
                    <p className="text-slate-500 font-medium">{h.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* === TAB 3: VIDA (Interacción Amigable) === */}
        {activeTab === 'vida' && (
          <div className="space-y-20 animate-fadeIn">

            {/* Personajes Interactivos */}
            <div id="personajes" className="grid md:grid-cols-2 gap-8 items-center scroll-mt-48">
              <div className="order-2 md:order-1 space-y-4">
                <div className="group bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-default">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-4 rounded-2xl text-4xl group-hover:scale-110 transition-transform">🦓</div>
                    <div>
                      <h3 className="text-xl font-black text-slate-800">LA CEBRA</h3>
                      <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">El Ejemplo</p>
                    </div>
                  </div>
                  <p className="mt-4 text-slate-600 leading-relaxed">
                    Símbolo de amor y respeto. Siempre busca soluciones pacíficas y educa con el ejemplo.
                  </p>
                </div>

                <div className="group bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 hover:border-gray-300 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-default">
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-100 p-4 rounded-2xl text-4xl group-hover:scale-110 transition-transform">🐴</div>
                    <div>
                      <h3 className="text-xl font-black text-slate-600">EL BURRO</h3>
                      <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">El Ciudadano</p>
                    </div>
                  </div>
                  <p className="mt-4 text-slate-600 leading-relaxed">
                    El ciudadano distraído. No es malo, solo necesita aprender con paciencia y guía.
                  </p>
                </div>
              </div>

              <div className="order-1 md:order-2 flex justify-center">
                <div className="relative w-80 h-80">
                  <div className="absolute inset-0 bg-gradient-to-tr from-green-300 to-blue-300 rounded-full blur-[60px] opacity-40 animate-pulse"></div>
                  <div className="relative w-full h-full bg-white rounded-[3rem] flex items-center justify-center shadow-2xl border-4 border-white rotate-3 hover:rotate-0 transition-all duration-500 overflow-hidden">
                    <div className="text-center">
                      <p className="text-slate-400 font-bold text-xs mt-2 uppercase tracking-widest">[FOTO CEBRA/BURRO]</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Casa Cebra */}
            <div id="casa" className="bg-white p-8 rounded-[3rem] shadow-lg text-center scroll-mt-48 border border-slate-100">
              <div className="inline-block p-4 bg-green-50 rounded-full mb-6">
                <Home className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-3xl font-black text-slate-800 mb-8">La Casa Cebra</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="group h-56 bg-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-slate-400 font-bold border-2 border-dashed border-slate-200 hover:border-green-400 hover:bg-green-50 transition-all cursor-pointer relative overflow-hidden">
                  <span className="relative z-10 group-hover:scale-110 transition-transform duration-300"> VESTIDOR</span>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-30 transition-opacity"></div>
                </div>
                <div className="group h-56 bg-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-slate-400 font-bold border-2 border-dashed border-slate-200 hover:border-green-400 hover:bg-green-50 transition-all cursor-pointer relative overflow-hidden">
                  <span className="relative z-10 group-hover:scale-110 transition-transform duration-300">AUDITORIO</span>
                </div>
                 <div className="group h-56 bg-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-slate-400 font-bold border-2 border-dashed border-slate-200 hover:border-green-400 hover:bg-green-50 transition-all cursor-pointer relative overflow-hidden">
                  <span className="relative z-10 group-hover:scale-110 transition-transform duration-300">CASTILLO</span>
                </div>
                   <div className="group h-56 bg-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-slate-400 font-bold border-2 border-dashed border-slate-200 hover:border-green-400 hover:bg-green-50 transition-all cursor-pointer relative overflow-hidden">
                  <span className="relative z-10 group-hover:scale-110 transition-transform duration-300">HUERTO</span>
                </div>
              </div>
              <p className="mt-8 text-slate-500 max-w-xl mx-auto font-medium">
                "Nuestro refugio donde recargamos energías, compartimos alimentos y fortalecemos nuestros lazos familiares."
              </p>
            </div>
          </div>
        )}
        {/* ============================================================
            TAB 4: LOGROS
           ============================================================ */}
        {activeTab === 'logros' && (
          <div id="galardones" className="animate-fadeIn pb-10 scroll-mt-48 text-center">
            <h2 className="text-3xl font-black mb-10 relative inline-block">
              Nuestros Galardones
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-yellow-400 mt-2 rounded-full"></span>
            </h2>

            <div className="flex flex-col items-center gap-6">
                  <div className="w-100 h-54 z-8 flex flex-col items-center justify-center border-2 border-white p-2">
                <div className="relative w-80 h-80">
                  <div className="absolute inset-0 bg-gradient-to-tr from-green-300 to-blue-300 rounded-full blur-[60px] opacity-40 animate-pulse"></div>
                  <div className="relative w-full h-full bg-white rounded-[3rem] flex items-center justify-center shadow-2xl border-4 border-white rotate-3 hover:rotate-0 transition-all duration-500 overflow-hidden">
                    <div className="text-center">
                      <p className="text-slate-400 font-bold text-xs mt-2 uppercase tracking-widest">[FOTO PREMIOS]</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* LISTA DE PREMIOS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ">
                <AwardCard title="Patrimonio UNESCO" year="2015" desc="Declaratoria de Patrimonio Cultural." />
                <AwardCard title="Innovación Guangzhou" year="2016" desc="Premio internacional en China." />
                <AwardCard title="Bienal Iberoamericana" year="2018" desc="Mención honorífica en diseño." />
                <AwardCard title="Personaje del Año" year="Varios" desc="Reconocimiento prensa nacional." />
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}

// --- COMPONENTES AUXILIARES ---

const pielesData = [
  { anio: 2001, titulo: "Primera Generación", descripcion: "Traje de tela simple, dos piezas. Cabeza pequeña." },
  { anio: 2005, titulo: "Mejora Estética", descripcion: "Se añaden detalles a la máscara y mejor tela." },
  { anio: 2010, titulo: "El Overol", descripcion: "Nace el traje entero acolchado para mayor seguridad." },
  { anio: 2024, titulo: "Actualidad", descripcion: "Materiales ligeros, lavables y diseño de sonrisa estándar." },
];

function AwardCard({ title, year, desc }: { title: string, year: string, desc: string }) {
  return (
    <div className="bg-white/80 backdrop-blur p-4 rounded-2xl shadow-md border-l-4 border-yellow-400 text-left hover:bg-white transition-colors">
      <div className="flex justify-between items-start mb-1">
        <h4 className="font-bold text-slate-800 text-sm">{title}</h4>
        <span className="bg-slate-900 text-yellow-400 text-[10px] font-black px-2 py-0.5 rounded-full">{year}</span>
      </div>
      <p className="text-xs text-slate-500 font-medium">{desc}</p>
    </div>
  );

}