"use client"; // <--- ¡ESTA ES LA LÍNEA MÁGICA QUE FALTABA!

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // ORDEN OPERATIVO: Herramientas primero
  const menuItems = [
    { name: 'Inicio', path: '/' },
    { name: 'Agenda', path: '/noticias' },
    { name: 'Cancionero', path: '/cancionero' },
    { name: 'Recursos', path: '/recursos' },
    { name: 'Galería', path: '/galeria' },
    { name: 'Identidad', path: '/quienes-somos' },
  ];

  return (
    <nav className="bg-black text-white sticky top-0 z-50 border-b-4 border-yellow-400 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          {/* LOGO */}
          <Link href="/" className="text-2xl font-black tracking-tighter hover:text-yellow-400 transition flex items-center gap-1">
            CEBRAS <span className="text-yellow-400">LP</span> <span className="text-3xl">🦓</span>
          </Link>
          
          {/* MENÚ DESKTOP (Pantallas grandes) */}
          <div className="hidden md:flex space-x-1 lg:space-x-4">
            {menuItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.path} 
                className={`
                  px-3 py-2 rounded-md text-sm font-bold uppercase tracking-wide transition
                  ${['Agenda', 'Cancionero', 'Recursos'].includes(item.name) 
                    ? 'hover:bg-yellow-400 hover:text-black'  // Resaltamos las herramientas
                    : 'hover:text-yellow-400'}                // Estilo normal para el resto
                `}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* BOTÓN HAMBURGUESA (Móvil) */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-white hover:text-yellow-400 focus:outline-none p-2"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* MENÚ MÓVIL (Desplegable) */}
      {isOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 animate-fadeIn">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {menuItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.path}
                onClick={() => setIsOpen(false)} // Cierra el menú al hacer clic
                className="block px-3 py-3 rounded-md text-base font-bold uppercase hover:bg-yellow-400 hover:text-black transition text-center"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;