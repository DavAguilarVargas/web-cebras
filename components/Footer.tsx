import React from 'react';
import { Facebook, Instagram, Youtube, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-10 border-t-8 border-yellow-400 mt-auto">
      <div className="container mx-auto px-6 text-center">
        
        {/* Logo y Nombre */}
        <h2 className="text-2xl font-black mb-4 flex justify-center items-center gap-2 tracking-tighter">
          CEBRAS <span className="text-yellow-400">LP</span> 🦓
        </h2>

        {/* Frase Inspiradora */}
        <p className="text-gray-400 text-sm max-w-md mx-auto mb-8 font-medium">
          "Educadores Urbanos construyendo una ciudad con cultura, amor y respeto. Tu actitud cambia La Paz."
        </p>

        {/* Redes Sociales */}
        <div className="flex justify-center gap-8 mb-8">
          <a href="https://www.facebook.com/LasCebrasDeLaPaz" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-3 rounded-full hover:bg-blue-600 hover:text-white transition transform hover:-translate-y-1">
            <Facebook size={20} />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-3 rounded-full hover:bg-pink-600 hover:text-white transition transform hover:-translate-y-1">
            <Instagram size={20} />
          </a>
          <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-3 rounded-full hover:bg-red-600 hover:text-white transition transform hover:-translate-y-1">
            <Youtube size={20} />
          </a>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6 text-xs text-gray-500">
          <p className="mb-2">© {new Date().getFullYear()} D.A.V.</p>
          <p className="flex justify-center items-center gap-1">
            Hecho con <Heart size={10} className="text-red-500 fill-current" /> por Voluntarios para Voluntarios.
          </p>
        </div>

      </div>
    </footer>
  );
}