"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Camera, Filter } from 'lucide-react';

// 1. DATOS DE LA GALERÍA
// Aquí irás agregando tus fotos reales.
// src: "/images/tu-foto.jpg" (Debes ponerlas en public/images)
const fotos = [
  { id: 1, categoria: "Vialidad", src: "https://placehold.co/600x400/222/FFF?text=Cruce+Peatonal", desc: "Control en el Prado" },
  { id: 2, categoria: "Social", src: "https://placehold.co/400x600/fbbf24/000?text=Abrazo+Cebra", desc: "Campaña de abrazos gratis" },
  { id: 3, categoria: "Desfiles", src: "https://placehold.co/600x800/ef4444/FFF?text=Navidad", desc: "Carro alegórico navideño" },
  { id: 4, categoria: "Capacitación", src: "https://placehold.co/500x500/3b82f6/FFF?text=Taller", desc: "Nuevos voluntarios" },
  { id: 5, categoria: "Vialidad", src: "https://placehold.co/600x400/000/FFF?text=Pare", desc: "Respeto al semáforo" },
  { id: 6, categoria: "Social", src: "https://placehold.co/400x500/10b981/FFF?text=Escuelas", desc: "Visita a unidad educativa" },
];

const categorias = ["Todas", "Vialidad", "Social", "Desfiles", "Capacitación"];

export default function Galeria() {
  const [filtro, setFiltro] = useState("Todas");
  const [imagenSeleccionada, setImagenSeleccionada] = useState<any>(null);

  // Filtrar fotos
  const fotosVisibles = fotos.filter(foto => 
    filtro === "Todas" ? true : foto.categoria === filtro
  );

  return (
    <main className="min-h-screen bg-white pb-10">
      
      {/* CABECERA */}
      <section className="bg-black text-white p-8 rounded-b-3xl shadow-lg mb-8">
        <div className="container mx-auto text-center">
          <Camera className="w-10 h-10 mx-auto mb-2 text-yellow-400" />
          <h1 className="text-3xl font-black mb-1">Galería Cebra</h1>
          <p className="text-gray-400">Momentos que construyen ciudad.</p>
        </div>
      </section>

      {/* FILTROS */}
      <div className="container mx-auto px-4 mb-8">
        <div className="flex flex-wrap justify-center gap-2">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setFiltro(cat)}
              className={`
                px-4 py-2 rounded-full text-sm font-bold transition border-2
                ${filtro === cat 
                  ? 'bg-yellow-400 text-black border-yellow-400' 
                  : 'bg-white text-gray-500 border-gray-200 hover:border-black'}
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* GRILLA TIPO MASONRY (Pinterest) */}
      <div className="container mx-auto px-4">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          
          {fotosVisibles.map((foto) => (
            <div 
              key={foto.id} 
              className="break-inside-avoid group relative rounded-xl overflow-hidden cursor-zoom-in"
              onClick={() => setImagenSeleccionada(foto)}
            >
              {/* Usamos <img> normal por ahora para usar placeholders externos. 
                  Cuando uses tus fotos locales, usa <Image /> de Next.js */}
              <img 
                src={foto.src} 
                alt={foto.desc} 
                className="w-full h-auto rounded-xl transform group-hover:scale-105 transition duration-500"
              />
              
              {/* Overlay con texto al pasar el mouse */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-end p-4">
                <div>
                  <span className="text-yellow-400 text-xs font-bold uppercase tracking-wider block">
                    {foto.categoria}
                  </span>
                  <p className="text-white font-medium">
                    {foto.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}

        </div>

        {fotosVisibles.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            No hay fotos en esta categoría todavía. 📸
          </div>
        )}
      </div>

      {/* LIGHTBOX (MODAL ZOOM) */}
      {imagenSeleccionada && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn"
          onClick={() => setImagenSeleccionada(null)}
        >
          <button className="absolute top-4 right-4 text-white hover:text-yellow-400 p-2">
            <X size={40} />
          </button>
          
          <div className="max-w-4xl max-h-[90vh] relative" onClick={(e) => e.stopPropagation()}>
            <img 
              src={imagenSeleccionada.src} 
              alt={imagenSeleccionada.desc}
              className="max-w-full max-h-[85vh] rounded shadow-2xl"
            />
            <div className="bg-white p-4 rounded-b mt-[-4px]">
               <h3 className="font-bold text-lg">{imagenSeleccionada.desc}</h3>
               <span className="text-xs bg-yellow-400 px-2 py-1 rounded font-bold text-black">
                 {imagenSeleccionada.categoria}
               </span>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}