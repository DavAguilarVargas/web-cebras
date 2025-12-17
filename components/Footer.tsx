import React from 'react';
import { Facebook, Instagram, Youtube, Heart } from 'lucide-react';

export default function Footer() {
  return (
    // CAMBIOS PRINCIPALES:
    // - bg-amber-50: Fondo crema.
    // - border-t-4 border-dashed border-yellow-400: El borde característico "Cebra".
    // - text-gray-700: Texto oscuro legible.
    <footer className="bg-slate-50 text-gray-700 pt-4 pb-2 border-t-2 border-dashed border-black mt-auto">
      <div className="container mx-auto px-2 text-center">
        
        {/* LOGO - Adaptado a fondo claro */}
        <h2 className="text-4xl font-black mb-2 flex justify-center items-center gap-1 tracking-tighter group cursor-default select-none">
          <span className="text-gray-900">CEBRAS</span>
          {/* L Roja */}
          <span className="text-red-600 group-hover:-translate-y-1 transition duration-300 ml-1 inline-block">L</span>
          {/* P Verde Hoja */}
          <span className="text-green-600 group-hover:-translate-y-1 transition duration-300 delay-75 inline-block">P</span> 
          <span className="text-5xl ml-2 filter drop-shadow-sm">🦓</span>
        </h2>

        {/* FRASE INSPIRADORA - Estilo "Nota de Papel" */}
        <div className="relative inline-block mb-2">
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-800 max-w-lg mx-auto transform rotate-1 hover:rotate-0 transition-transform duration-400">
                <p className="text-gray-800 text-base font-medium italic leading-relaxed font-serif">
                "Actitud Cebra, Espíritu Cebra, Familia Cebra.<br/>
                ¡Por siempre y para siempre Cebra...!!!"
                </p>
                {/* Decoración: Chincheta o Círculo amarillo arriba */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-600 border-2 border-white shadow-sm"></div>
            </div>
        </div>

        {/* REDES SOCIALES - Botones blancos limpios */}
        <div className="flex justify-center gap-4 mb-2">
          
          {/* Facebook */}
          <a 
            href="https://www.facebook.com/LasCebrasDeLaPaz" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="p-3 rounded-full bg-white border-2 border-gray-600 text-gray-600 transition-all duration-300 hover:border-blue-500 hover:text-blue-600 hover:scale-110 hover:shadow-md hover:-translate-y-1"
          >
            <Facebook size={24} />
          </a>

          {/* Instagram */}
          <a 
            href="https://www.instagram.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="p-3 rounded-full bg-white border-2 border-gray-600 text-gray-600 transition-all duration-300 hover:border-pink-500 hover:text-pink-600 hover:scale-110 hover:shadow-md hover:-translate-y-1"
          >
            <Instagram size={24} />
          </a>

          {/* Youtube */}
          <a 
            href="https://www.youtube.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="p-3 rounded-full bg-white border-2 border-gray-600 text-gray-600 transition-all duration-300 hover:border-red-500 hover:text-red-600 hover:scale-110 hover:shadow-md hover:-translate-y-1"
          >
            <Youtube size={24} />
          </a>
        </div>

        {/* COPYRIGHT & CRÉDITOS */}
        {/* Separador discontinuo sutil */}
        <div className="border-t-2 border-dashed border-gray-300 pt-2 text-sm text-gray-800">
          <div className="flex flex-col md:flex-row justify-center items-center gap-2 group">
            
            <span>
              © {new Date().getFullYear()} D.A.V.
            </span>
            <span className="hidden md:inline text-gray-800">•</span>

            <span className="flex items-center gap-1">
              Hecho con 
              <Heart 
                size={14} 
                className="text-red-600 animate-pulse fill-current" 
              /> 
              para su Familia Cebra.
            </span>

          </div>
        </div>

      </div>
    </footer>
  );
}