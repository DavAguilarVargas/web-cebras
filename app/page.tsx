"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Music, Calendar, ShieldAlert, Clock, CheckCircle, Smile, Award, Heart } from "lucide-react";

// --- DATOS DEL SLIDER ---
const testimonios = [
  {
    frase: "No es solo un traje, es una segunda piel que nos enseña a amar la ciudad.",
    autor: "Ex-Voluntario, 2015",
    color: "bg-cyan-600" 
  },
  {
    frase: "Cuando un niño te abraza en el semáforo, entiendes que todo el cansancio vale la pena.",
    autor: "Cebra, Centro",
    color: "bg-green-600" 
  },
  {
    frase: "ser cebra es enseñar y aprender de la ciudad,es ser parte de la ciudad...",
    autor: " Cebra Líder,2014",
    color: "bg-purple-600" 
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonios.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    // CAMBIO 1: Fondo cálido (amber-50) en lugar de gris (zinc-50)
    <main className="min-h-screen items-center pb-10 font-sans">
      
      {/* 1. SECCIÓN HERO */}
      {/* Añadido: border-b-4 border-dashed border-yellow-400 para unir con el estilo del Navbar */}
      <section className="relative h-[500px] w-full bg-black border-b-4  border-yellow-400 shadow-md">
        <Image 
          src="/images/hero-cebras.jpg" 
          alt="Cebras en acción" 
          fill
          className="object-cover opacity-50" 
          priority 
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 container mx-auto z-10">
          <div className="bg-white/20 backdrop-blur-md p-4 rounded-full mb-6 shadow-2xl border-2  border-white/40 animate-pulse">
              <span className="text-6xl filter drop-shadow-lg">🦓</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4 drop-shadow-2xl tracking-tighter">
            EL ALMA DE LA CIUDAD
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 font-medium drop-shadow-md max-w-2xl leading-relaxed">
            Bienvenido al portal oficial del <span className="text-yellow-300 font-bold bg-black/20 px-2 rounded-lg">Educador Urbano</span>.
            <br /> Tu legado empieza hoy.
          </p>
        </div>
      </section>

      {/* 2. SECCIÓN DE IMPACTO Y SENTIMIENTO */}
      <section className="container mx-auto px-4 -mt-20 relative z-20 mb-16">
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          
          {/* A. TARJETAS DE ESTADÍSTICAS */}
          <div className="lg:flex-1 space-y-6">
             {/* Título de sección estilo "Etiqueta" */}
             <div className="bg-white px-6 py-3 rounded-2xl shadow-sm inline-flex items-center gap-2 border-2  border-gray-300 transform -rotate-0">
                <Award className="text-yellow-500 h-6 w-6" />
                <h3 className="text-xl font-black text-gray-800">Huellas que Marcan Historia</h3>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Tarjeta 1: Años - Borde Amarillo */}
              <div className="bg-white p-6 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2  border-yellow-300 group">
                <div className="bg-yellow-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition border border-yellow-100">
                  <Clock className="text-yellow-600 h-8 w-8" />
                </div>
                <span className="block text-5xl font-black text-gray-800 mb-1 leading-none group-hover:text-yellow-500 transition">+23</span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Años Educando</span>
                <p className="text-sm text-gray-500 mt-3 leading-tight font-medium">Transformando las calles desde el 2001.</p>
              </div>
              
              {/* Tarjeta 2: UNESCO - Borde Azul */}
              <div className="bg-white p-6 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2  border-blue-300 group">
                <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition border border-blue-100">
                  <CheckCircle className="text-blue-600 h-8 w-8" />
                </div>
                <span className="block text-4xl font-black text-gray-800 mb-1 leading-tight group-hover:text-blue-600 transition">UNESCO</span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Reconocimiento</span>
                <p className="text-sm text-gray-500 mt-3 leading-tight font-medium">Patrimonio Cultural Inmaterial.</p>
              </div>

              {/* Tarjeta 3: Sonrisas - Borde Rojo */}
              <div className="bg-white p-6 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2  border-red-300 group">
                <div className="bg-red-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition border border-red-100">
                  <Smile className="text-red-500 h-8 w-8" />
                </div>
                <span className="block text-5xl font-black text-gray-800 mb-1 leading-none group-hover:text-red-500 transition">∞</span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Impacto Real</span>
                <p className="text-sm text-gray-500 mt-3 leading-tight font-medium">Millones de sonrisas y cambios de actitud.</p>
              </div>
            </div>
          </div>

          {/* B. CARRUSEL EMOCIONAL */}
          <div className="lg:w-1/3 rounded-[2.5rem] shadow-xl overflow-hidden relative min-h-[320px] flex flex-col border-4  border-white bg-white">
            {/* Contenido del Slide */}
            <div className="absolute inset-0 transition-all duration-700 ease-in-out flex flex-col justify-center p-8 text-center z-10">
               <div className="mb-6 flex justify-center">
                 <div className="bg-white/20 p-3 rounded-full animate-bounce shadow-inner">
                    <Heart className="w-10 h-10 text-white drop-shadow-md" fill="currentColor" />
                 </div>
               </div>
               <p className="text-xl md:text-2xl font-bold  text-white mb-6 leading-relaxed italic drop-shadow-md font-serif">
                 "{testimonios[currentSlide].frase}"
               </p>
               <div className="mt-auto p-2">
                 <span className="text-xs font-bold px-1 py-1  rounded-full uppercase tracking-wider mx-auto shadow-lg bg-white text-gray-800 border-2 border-gray-300">
                   {testimonios[currentSlide].autor}
                 </span>
               </div>
            </div>

            {/* Fondo animado */}
            <div className={`absolute inset-0 opacity-90 ${testimonios[currentSlide].color} transition-colors duration-1000 z-0`}></div>
            {/* Textura de ruido suave (opcional para efecto papel) */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 z-0 mix-blend-overlay"></div>

            {/* Indicadores */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
              {testimonios.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1 rounded-full transition-all duration-500 shadow-sm ${
                    currentSlide === index ? "bg-white w-8" : "bg-white/40 w-2"
                  }`}
                />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 3. SECCIÓN DE HERRAMIENTAS (Panel de Control Pintoresco) */}
      <section className="container mx-auto px-4 relative z-10 mb-12">
        <div className="flex items-center gap-4 mb-6 justify-center">
           <div className="h-0.5 bg-gray-300 w-16 border-b  border-gray-400"></div>
           <span className="bg-white text-gray-500 font-bold uppercase tracking-widest text-xs px-4 py-1.5 rounded-full border border-gray-200 shadow-sm">
             Panel de Control
           </span>
           <div className="h-0.5 bg-gray-300 w-16 border-b border-gray-400"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Tarjeta Cancionero */}
          <Link href="/cancionero" className="group bg-white p-4 rounded-[2rem] shadow-sm hover:shadow-xl border-4  border-orange-300 hover:border-orange-500 transition-all duration-300 flex items-center justify-between relative overflow-hidden h-36 transform hover:-translate-y-1">
            <div className="bg-orange-50 p-4 rounded-2xl text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition shadow-inner z-20 shrink-0 border border-orange-100">
              <Music size={28} />
            </div>
            <div className="flex-1 px-4 z-20">
              <h3 className="font-black text-xl text-gray-800 leading-none mb-1 group-hover:text-orange-600 transition-colors">Cancionero</h3>
              <p className="text-sm text-gray-500 leading-tight font-medium">Repasa letras y ritmos</p>
            </div>
            {/* Imagen decorativa de fondo */}
            <div className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 group-hover:opacity-20 transition-opacity transform rotate-12">
               <Music className="w-full h-full text-orange-500" />
            </div>
          </Link>

          {/* Tarjeta Agenda */}
          <Link href="/noticias" className="group bg-white p-4 rounded-[2rem] shadow-sm hover:shadow-xl border-4  border-yellow-300 hover:border-yellow-500 transition-all duration-300 flex items-center justify-between relative overflow-hidden h-36 transform hover:-translate-y-1">
            <div className="bg-yellow-50 p-4 rounded-2xl text-yellow-600 group-hover:bg-yellow-500 group-hover:text-white transition shadow-inner z-20 shrink-0 border border-yellow-100">
              <Calendar size={28} />
            </div>
            <div className="flex-1 px-4 z-20">
              <h3 className="font-black text-xl text-gray-800 leading-none mb-1 group-hover:text-yellow-600 transition-colors">Agenda</h3>
              <p className="text-sm text-gray-500 leading-tight font-medium">Cronograma semanal</p>
            </div>
            <div className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 group-hover:opacity-20 transition-opacity transform rotate-12">
               <Calendar className="w-full h-full text-yellow-500" />
            </div>
          </Link>

          {/* Tarjeta Caja Ayuda */}
          <Link href="/recursos" className="group bg-white p-4 rounded-[2rem] shadow-sm hover:shadow-xl border-4  border-green-300 hover:border-green-500 transition-all duration-300 flex items-center justify-between relative overflow-hidden h-36 transform hover:-translate-y-1">
            <div className="bg-green-50 p-4 rounded-2xl text-green-600 group-hover:bg-green-600 group-hover:text-white transition shadow-inner z-20 shrink-0 border border-green-100">
              <ShieldAlert size={28} />
            </div>
            <div className="flex-1 px-4 z-20">
              <h3 className="font-black text-xl text-gray-800 leading-none mb-1 group-hover:text-green-600 transition-colors">Caja Ayuda</h3>
              <p className="text-sm text-gray-500 leading-tight font-medium">Protocolos y guías</p>
            </div>
            <div className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 group-hover:opacity-20 transition-opacity transform rotate-12">
               <ShieldAlert className="w-full h-full text-green-500" />
            </div>
          </Link>
        </div>
      </section>

    </main>
  );
}