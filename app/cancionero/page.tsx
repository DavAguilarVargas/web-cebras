"use client";

import React, { useState, useMemo } from 'react';
import { Music, PlayCircle, ChevronDown, ChevronUp, Search, X } from 'lucide-react';

// 1. DEFINICIÓN DE CATEGORÍAS
type Categoria = 'Todas' | 'Marchas' | 'Dinámicas' | 'Navidad' | 'Folklore' | 'Flashmob';

// 2. BASE DE DATOS DE CANCIONES (Con Categorías)
const canciones = [
  {
    id: 1,
    titulo: "La Cebra de Verdad",
    categoria: "Marchas",
    ritmo: "Alegre / Marcha",
    audio: "/audios/cebra-verdad.mp3",
    letra: `Soy una cebra de verdad
    Que busca la seguridad
    Cruza por la franja, no lo dudes más
    El paso de cebra debes respetar.`
  },
  {
    id: 2,
    titulo: "Semáforo Amigo",
    categoria: "Dinámicas",
    ritmo: "Cumbia Lenta",
    audio: "/audios/semaforo.mp3",
    letra: `Rojo para parar
    Amarillo reflexionar
    Verde para avanzar
    Respetemos la ciudad.`
  },
  {
    id: 3,
    titulo: "Rodolfo el Reno (Versión Cebra)",
    categoria: "Navidad",
    ritmo: "Villancico",
    audio: "/audios/rodolfo.mp3",
    letra: `Era Rodolfo una cebra
    que tenía la nariz
    roja como un tomate
    y de un brillo singular.`
  },
  {
    id: 4,
    titulo: "Cueca de la Paz",
    categoria: "Folklore",
    ritmo: "Cueca",
    audio: "/audios/cueca.mp3",
    letra: `La paz maravillosa
    tus cebras te saludan hoy
    con pañuelo blanco en mano
    educando con amor.`
  },
  {
    id: 5,
    titulo: "Mix Electrónico",
    categoria: "Flashmob",
    ritmo: "Electrónica / Rápido",
    audio: "/audios/flashmob.mp3",
    letra: `(Instrumental - Pasos de baile)
    1. Paso lateral
    2. Vuelta en sitio
    3. Salto Cebra!`
  }
];

export default function Cancionero() {
  const [abierto, setAbierto] = useState<number | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState<Categoria>('Todas');

  const categorias: Categoria[] = ['Todas', 'Marchas', 'Dinámicas', 'Navidad', 'Folklore', 'Flashmob'];

  // Lógica de Filtrado (Busca en título Y letra)
  const cancionesFiltradas = useMemo(() => {
    return canciones.filter(cancion => {
      const coincideTexto = 
        cancion.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        cancion.letra.toLowerCase().includes(busqueda.toLowerCase());
      
      const coincideCategoria = 
        filtroCategoria === 'Todas' || cancion.categoria === filtroCategoria;

      return coincideTexto && coincideCategoria;
    });
  }, [busqueda, filtroCategoria]);

  const toggleCancion = (id: number) => {
    setAbierto(abierto === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      
      {/* CABECERA CON BUSCADOR */}
      <div className="bg-black text-white p-6 pb-10 rounded-b-3xl shadow-lg sticky top-0 z-30">
        <div className="container mx-auto max-w-2xl">
          <h1 className="text-2xl font-black mb-4 flex items-center gap-2">
            <Music className="text-pink-500" /> Cancionero
          </h1>

          {/* Barra de Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Buscar por título o letra..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full bg-gray-800 text-white pl-10 pr-10 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-500"
            />
            {busqueda && (
              <button 
                onClick={() => setBusqueda("")}
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FILTROS (CHIPS) - Scroll horizontal en móviles */}
      <div className="container mx-auto max-w-2xl px-4 -mt-5 mb-6 relative z-40">
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setFiltroCategoria(cat)}
              className={`
                whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold shadow-sm border transition-all
                ${filtroCategoria === cat 
                  ? 'bg-yellow-400 text-black border-yellow-500 scale-105' 
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'}
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* LISTA DE RESULTADOS */}
      <div className="container mx-auto px-4 max-w-2xl space-y-3">
        
        {cancionesFiltradas.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            <p>No encontré ninguna canción con "{busqueda}" 🦓</p>
          </div>
        )}

        {cancionesFiltradas.map((cancion) => (
          <div 
            key={cancion.id} 
            className={`
              bg-white rounded-xl shadow-sm overflow-hidden border-2 transition-all duration-200
              ${abierto === cancion.id ? 'border-yellow-400 ring-2 ring-yellow-100' : 'border-transparent'}
            `}
          >
            <button 
              onClick={() => toggleCancion(cancion.id)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                {/* Icono dinámico según categoría */}
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 font-bold text-xs
                  ${cancion.categoria === 'Navidad' ? 'bg-red-500' : ''}
                  ${cancion.categoria === 'Marchas' ? 'bg-blue-600' : ''}
                  ${cancion.categoria === 'Dinámicas' ? 'bg-purple-500' : ''}
                  ${cancion.categoria === 'Folklore' ? 'bg-orange-500' : ''}
                  ${cancion.categoria === 'Flashmob' ? 'bg-pink-500' : ''}
                `}>
                  {cancion.categoria.substring(0,2).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 truncate pr-2">{cancion.titulo}</h3>
                  <div className="flex items-center gap-2">
                     <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                       {cancion.categoria}
                     </span>
                     <span className="text-xs text-gray-400 truncate">
                       {cancion.ritmo}
                     </span>
                  </div>
                </div>
              </div>
              
              {abierto === cancion.id ? <ChevronUp size={20} className="text-gray-400"/> : <ChevronDown size={20} className="text-gray-400"/>}
            </button>

            {abierto === cancion.id && (
              <div className="bg-gray-50 p-5 border-t border-gray-100">
                <div className="bg-white p-3 rounded-lg shadow-sm mb-4 flex items-center gap-3 border border-gray-200">
                   <PlayCircle className="text-pink-500 w-8 h-8" />
                   <div className="flex-1 overflow-hidden">
                     <p className="text-xs text-gray-400 mb-1">Guía de audio:</p>
                     <audio controls className="w-full h-8 block">
                        <source src={cancion.audio} type="audio/mpeg" />
                     </audio>
                   </div>
                </div>

                <div className="prose prose-sm">
                  <h4 className="font-bold text-gray-900 mb-2 text-sm uppercase">Letra:</h4>
                  <p className="whitespace-pre-line text-gray-700 leading-relaxed text-base font-medium">
                    {/* Resaltamos la palabra buscada si existe */}
                    {cancion.letra.split(new RegExp(`(${busqueda})`, 'gi')).map((part, i) => 
                      part.toLowerCase() === busqueda.toLowerCase() && busqueda !== "" ? 
                        <span key={i} className="bg-yellow-300 text-black px-1 rounded">{part}</span> : part
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}