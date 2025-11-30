"use client";

import React, { useState } from 'react';
import Image from 'next/image'; // Importamos componente de imagen
import { 
  Heart, Star, User, Home, Award, ChevronRight, CheckCircle2 
} from 'lucide-react';

export default function QuienesSomos() {
  const [activeTab, setActiveTab] = useState('adn');
  const [selectedSkin, setSelectedSkin] = useState(0); // Para la evolución del traje

  const tabs = [
    { id: 'adn', label: 'ADN Cebra' },
    { id: 'origen', label: 'Origen y Evolución' },
    { id: 'vida', label: 'Vida y Personajes' },
    { id: 'logros', label: 'Logros' },
  ];

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      
      {/* --- 1. PORTADA --- */}
      <section className="bg-yellow-400 p-8 pt-12 text-center rounded-b-[2.5rem] shadow-lg mb-6">
        <h1 className="text-4xl font-black text-black mb-2">Nuestra Identidad</h1>
        <p className="text-black font-medium text-lg">Conoce la esencia, historia y vida del Educador Urbano.</p>
      </section>

      {/* --- 2. TABS NAVEGACIÓN --- */}
      <div className="sticky top-0 z-40 bg-gray-50/95 backdrop-blur py-4 px-4 shadow-sm mb-6">
        <div className="flex gap-2 overflow-x-auto no-scrollbar md:justify-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap px-6 py-2 rounded-full text-sm font-bold border-2 transition-all
                ${activeTab === tab.id 
                  ? 'bg-black text-white border-black scale-105' 
                  : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-100'}
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* ============================================================
            TAB 1: ADN CEBRA (Misión, Visión, 10 Filosofías, 10 Valores)
           ============================================================ */}
        {activeTab === 'adn' && (
          <div className="space-y-12 animate-fadeIn">
            
            {/* SECCIÓN: Misión y Visión (Cajas separadas + Imagen lateral) */}
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              {/* Columna Izquierda: Cajas */}
              <div className="flex-1 w-full space-y-6">
                <div className="bg-white p-8 rounded-3xl shadow-sm border-l-[10px] border-yellow-400 relative overflow-hidden group hover:shadow-md transition">
                  <h2 className="font-black text-2xl mb-3 flex items-center gap-2">
                    <span className="text-4xl">🎯</span> Misión
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {/* TRANSCRIBIR AQUÍ */}
                    Promover cambios de actitud y comportamiento en la ciudadanía paceña a través de la educación urbana con amor, respeto y alegría.
                  </p>
                </div>
                
                <div className="bg-white p-8 rounded-3xl shadow-sm border-l-[10px] border-black relative overflow-hidden group hover:shadow-md transition">
                  <h2 className="font-black text-2xl mb-3 flex items-center gap-2">
                    <span className="text-4xl">👁️</span> Visión
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {/* TRANSCRIBIR AQUÍ */}
                    Consolidar a La Paz como una ciudad educadora, ordenada y segura, donde el ciudadano es el protagonista del cambio.
                  </p>
                </div>
              </div>

              {/* Columna Derecha: Imagen fuera del recuadro */}
              <div className="w-full lg:w-1/3 h-80 relative rounded-3xl overflow-hidden shadow-xl rotate-2 hover:rotate-0 transition duration-500">
                {/* REEMPLAZAR SRC CON TU IMAGEN */}
                <div className="bg-gray-300 w-full h-full flex items-center justify-center text-gray-500 font-bold">
                   [FOTO Misión/Visión]
                   {/* <Image src="/images/mision-vision.jpg" fill className="object-cover" /> */}
                </div>
              </div>
            </div>

            {/* SECCIÓN: Pilares Educativos y Sociales */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                    <h3 className="font-black text-xl text-blue-800 mb-3">Pilar Educativo</h3>
                    <p className="text-blue-700 text-sm">Formación constante en cultura ciudadana y vialidad.</p>
                </div>
                <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                    <h3 className="font-black text-xl text-green-800 mb-3">Pilar Social</h3>
                    <p className="text-green-700 text-sm">Empatía, inclusión y ayuda al ciudadano vulnerable.</p>
                </div>
            </div>

            {/* SECCIÓN: 10 Filosofías Cebra (Lista + Imagen Lateral) */}
            <div className="bg-white p-8 rounded-3xl shadow-sm">
               <h2 className="text-3xl font-black text-center mb-8">Filosofía Cebra (Decálogo)</h2>
               <div className="flex flex-col md:flex-row gap-8">
                  {/* Lista de 10 */}
                  <ul className="flex-1 space-y-3">
                    {[1,2,3,4,5,6,7,8,9,10].map((num) => (
                        <li key={num} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded transition">
                            <span className="bg-black text-white font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">{num}</span>
                            <span className="text-gray-700 font-medium">
                                {/* TRANSCRIBIR AQUÍ CADA PUNTO */}
                                Principio filosófico número {num} (Transcribir aquí).
                            </span>
                        </li>
                    ))}
                  </ul>
                  {/* Imagen Lateral */}
                  <div className="w-full md:w-1/3 min-h-[300px] bg-gray-200 rounded-2xl flex items-center justify-center">
                     [FOTO FILOSOFÍA]
                  </div>
               </div>
            </div>

            {/* SECCIÓN: 10 Valores (Grid) */}
            <div>
               <h2 className="text-3xl font-black text-center mb-8">Nuestros 10 Valores</h2>
               <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                      "Amor", "Respeto", "Honestidad", "Alegría", "Empatía",
                      "Solidaridad", "Responsabilidad", "Tolerancia", "Paciencia", "Humildad"
                  ].map((valor, i) => (
                      <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center hover:bg-yellow-50 transition hover:-translate-y-1">
                          <Heart className="w-6 h-6 mx-auto mb-2 text-pink-500" />
                          <h3 className="font-bold text-gray-800">{valor}</h3>
                      </div>
                  ))}
               </div>
            </div>

          </div>
        )}

        {/* ============================================================
            TAB 2: ORIGEN Y EVOLUCIÓN (Piel Interactiva + Historia)
           ============================================================ */}
        {activeTab === 'origen' && (
          <div className="space-y-12 animate-fadeIn">
            
            {/* SECCIÓN: Evolución de la Piel (Interactivo Horizontal) */}
            <div className="bg-white p-6 rounded-3xl shadow-sm">
                <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
                    <User /> Evolución de la Piel Cebra
                </h2>
                
                {/* 1. Imagen Horizontal de Referencia (Todas las pieles) */}
                <div className="w-full h-40 bg-gray-200 rounded-xl mb-6 flex items-center justify-center relative overflow-hidden">
                    <span className="text-gray-500 font-bold">[IMAGEN HORIZONTAL: TODAS LAS PIELES EN FILA]</span>
                    {/* <Image src="/images/todas-las-pieles.jpg" fill className="object-cover" /> */}
                </div>

                {/* 2. Botones de Años */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
                    {pielesData.map((piel, index) => (
                        <button 
                            key={index}
                            onClick={() => setSelectedSkin(index)}
                            className={`px-4 py-2 rounded-lg font-bold transition whitespace-nowrap
                                ${selectedSkin === index ? 'bg-black text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                            `}
                        >
                            {piel.anio}
                        </button>
                    ))}
                </div>

                {/* 3. Información Dinámica */}
                <div className="bg-gray-50 p-6 rounded-2xl border-l-4 border-yellow-400 flex flex-col md:flex-row gap-6 animate-fadeIn">
                    <div className="flex-1">
                        <h3 className="text-xl font-black mb-2">{pielesData[selectedSkin].titulo}</h3>
                        <p className="text-gray-600">{pielesData[selectedSkin].descripcion}</p>
                    </div>
                     <div className="w-32 h-32 bg-gray-300 rounded-lg shrink-0 flex items-center justify-center text-xs text-center">
                        [FOTO DE LA PIEL {pielesData[selectedSkin].anio}]
                    </div>
                </div>
            </div>

            {/* SECCIÓN: Historia Horizontal (Scroll) */}
            <div>
                <h2 className="text-2xl font-black mb-6">Línea de Tiempo Histórica</h2>
                <div className="flex gap-6 overflow-x-auto pb-8 pt-4 px-2 no-scrollbar">
                    {/* Tarjeta de Historia 1 */}
                    <div className="min-w-[280px] bg-white p-5 rounded-2xl shadow-md border-t-8 border-black relative mt-4">
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-white font-bold px-3 py-1 rounded-full text-sm">
                            2001
                        </div>
                        <div className="h-32 bg-gray-200 rounded-lg mb-3 flex items-center justify-center text-xs">
                            [FOTO 2001]
                        </div>
                        <h3 className="font-bold text-lg mb-1">Nacimiento</h3>
                        <p className="text-sm text-gray-600">Inicio del programa con 24 jóvenes y trajes de tela.</p>
                    </div>

                    {/* Tarjeta de Historia 2 */}
                    <div className="min-w-[280px] bg-white p-5 rounded-2xl shadow-md border-t-8 border-yellow-400 relative mt-4">
                         <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-400 text-black font-bold px-3 py-1 rounded-full text-sm">
                            2010
                        </div>
                        <div className="h-32 bg-gray-200 rounded-lg mb-3 flex items-center justify-center text-xs">
                            [FOTO 2010]
                        </div>
                        <h3 className="font-bold text-lg mb-1">Educadores</h3>
                        <p className="text-sm text-gray-600">Cambio de enfoque: de reguladores a educadores urbanos.</p>
                    </div>

                    {/* Tarjeta de Historia 3 (Agregar más copiando este bloque) */}
                    <div className="min-w-[280px] bg-white p-5 rounded-2xl shadow-md border-t-8 border-gray-400 relative mt-4">
                         <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-400 text-white font-bold px-3 py-1 rounded-full text-sm">
                            2015
                        </div>
                        <div className="h-32 bg-gray-200 rounded-lg mb-3 flex items-center justify-center text-xs">
                            [FOTO UNESCO]
                        </div>
                        <h3 className="font-bold text-lg mb-1">UNESCO</h3>
                        <p className="text-sm text-gray-600">Declaración como Patrimonio Cultural Inmaterial.</p>
                    </div>
                </div>
            </div>

          </div>
        )}

        {/* ============================================================
            TAB 3: VIDA Y PERSONAJES (Tríptico + Casa Cebra Panorámica)
           ============================================================ */}
        {activeTab === 'vida' && (
          <div className="space-y-16 animate-fadeIn">
            
            {/* SECCIÓN: Personajes (Diseño Centro) */}
            <div className="relative">
                <h2 className="text-3xl font-black text-center mb-10">Protagonistas de la Calle</h2>
                
                {/* Diseño Desktop: Texto Izq | IMAGEN | Texto Der */}
                <div className="flex flex-col md:flex-row items-center gap-8">
                    
                    {/* Lado Cebra */}
                    <div className="flex-1 text-center md:text-right p-6 bg-white rounded-2xl shadow-sm md:bg-transparent md:shadow-none">
                        <h3 className="text-2xl font-black mb-2 text-black">LA CEBRA 🦓</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            El símbolo de orden, amor y respeto. <br/>
                            Siempre amable, nunca se enoja. <br/>
                            Es el ejemplo a seguir.
                        </p>
                    </div>

                    {/* Imagen Central (Ambos) */}
                    <div className="w-64 h-80 bg-gray-200 rounded-full border-8 border-yellow-400 shrink-0 shadow-2xl flex items-center justify-center overflow-hidden z-10">
                         <span className="text-xs font-bold text-center px-2">
                             [FOTO JUNTOS: <br/>CEBRA Y BURRO]
                         </span>
                         {/* <Image src="..." fill /> */}
                    </div>

                    {/* Lado Burro */}
                    <div className="flex-1 text-center md:text-left p-6 bg-white rounded-2xl shadow-sm md:bg-transparent md:shadow-none">
                        <h3 className="text-2xl font-black mb-2 text-gray-500">EL BURRO 🐴</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            El ciudadano distraído y caótico. <br/>
                            No es malo, solo necesita aprender. <br/>
                            Representa lo que debemos corregir.
                        </p>
                    </div>
                </div>
            </div>

            {/* SECCIÓN: Casa Cebra (Zig Zag con Fotos Panorámicas) */}
            <div>
                <h2 className="text-3xl font-black text-center mb-10 flex items-center justify-center gap-2">
                    <Home className="text-yellow-500" /> La Casa Cebra
                </h2>

                <div className="space-y-12">
                    {/* Espacio 1: Comedor/Sala */}
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        <div className="w-full md:w-1/2 h-64 bg-gray-300 rounded-2xl shadow-lg border-4 border-white/50 flex items-center justify-center">
                             [FOTO PANORÁMICA SALA]
                        </div>
                        <div className="flex-1 space-y-2">
                            <h3 className="font-bold text-xl border-l-4 border-yellow-400 pl-3">El Comedor</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-green-500"/> Compartimos el almuerzo.</li>
                                <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-green-500"/> Reforzamos la familia.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Espacio 2: Auditorio (Invertido) */}
                    <div className="flex flex-col md:flex-row-reverse gap-6 items-center">
                        <div className="w-full md:w-1/2 h-64 bg-gray-300 rounded-2xl shadow-lg border-4 border-white/50 flex items-center justify-center">
                             [FOTO PANORÁMICA AUDITORIO]
                        </div>
                        <div className="flex-1 space-y-2">
                            <h3 className="font-bold text-xl border-l-4 border-black pl-3">El Auditorio</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-green-500"/> Capacitaciones semanales.</li>
                                <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-green-500"/> Teatro y dinámicas.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

          </div>
        )}

        {/* ============================================================
            TAB 4: LOGROS (Diseño Radial / Satelital)
           ============================================================ */}
        {activeTab === 'logros' && (
          <div className="animate-fadeIn pb-10">
             <h2 className="text-3xl font-black text-center mb-12">Nuestros Galardones</h2>
             
             {/* Contenedor Radial */}
             <div className="relative max-w-4xl mx-auto min-h-[600px] flex justify-center items-center">
                 
                 {/* IMAGEN CENTRAL */}
                 <div className="w-48 h-48 md:w-64 md:h-64 bg-yellow-400 rounded-full shadow-[0_0_40px_rgba(250,204,21,0.5)] z-10 flex items-center justify-center border-8 border-white text-center p-4">
                     <div className="font-black text-black leading-tight">
                         <span className="text-4xl block mb-2">🏆</span>
                         ORGULLO PACEÑO
                     </div>
                 </div>

                 {/* SATÉLITES (Premios alrededor) */}
                 {/* Nota: Usamos grid responsive que simula un círculo en desktop */}
                 <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pointer-events-none">
                     
                     {/* Premio 1 (Arriba Izquierda) */}
                     <div className="flex justify-center md:justify-end items-end p-4 pointer-events-auto">
                         <AwardCard title="Patrimonio UNESCO" year="2015" desc="Declaratoria de Patrimonio Cultural Inmaterial." />
                     </div>

                     {/* Espacio vacío arriba centro (donde está la imagen central) */}
                     <div className="hidden lg:block"></div>

                     {/* Premio 2 (Arriba Derecha) */}
                     <div className="flex justify-center md:justify-start items-end p-4 pointer-events-auto">
                         <AwardCard title="Innovación Guangzhou" year="2016" desc="Premio internacional de innovación urbana en China." />
                     </div>

                     {/* Premio 3 (Centro Izquierda) */}
                     <div className="flex justify-center md:justify-end items-center p-4 pointer-events-auto">
                         <AwardCard title="Bienal Iberoamericana" year="2018" desc="Mención honorífica en diseño social." />
                     </div>

                     {/* Espacio vacío centro (Imagen) */}
                     <div className="hidden lg:block"></div>

                     {/* Premio 4 (Centro Derecha) */}
                     <div className="flex justify-center md:justify-start items-center p-4 pointer-events-auto">
                         <AwardCard title="Personaje del Año" year="Varios" desc="Reconocimiento por prensa local y nacional." />
                     </div>
                     
                     {/* ... Puedes agregar más abajo */}
                 </div>
             </div>
          </div>
        )}

      </div>
    </main>
  );
}

// --- DATOS Y COMPONENTES AUXILIARES ---

// Datos de las pieles (Transcribir aquí)
const pielesData = [
    { anio: 2001, titulo: "Primera Generación", descripcion: "Traje de tela simple, dos piezas. Cabeza pequeña." },
    { anio: 2005, titulo: "Mejora Estética", descripcion: "Se añaden detalles a la máscara y mejor tela." },
    { anio: 2010, titulo: "El Overol", descripcion: "Nace el traje entero acolchado para mayor seguridad." },
    { anio: 2024, titulo: "Actualidad", descripcion: "Materiales ligeros, lavables y diseño de sonrisa estándar." },
];

function AwardCard({ title, year, desc }: { title: string, year: string, desc: string }) {
    return (
        <div className="bg-white p-5 rounded-xl shadow-lg border-b-4 border-yellow-400 w-64 text-center transform hover:scale-105 transition">
            <div className="bg-black text-yellow-400 text-xs font-bold px-3 py-1 rounded-full inline-block mb-2">
                {year}
            </div>
            <h4 className="font-bold text-gray-900 leading-tight mb-2">{title}</h4>
            <p className="text-xs text-gray-500">{desc}</p>
        </div>
    );
}