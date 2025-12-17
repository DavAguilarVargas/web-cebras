"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Inicio", path: "/", hoverColor: "hover:text-red-600 hover:bg-red-100" },
    { name: "Agenda", path: "/noticias", hoverColor: "hover:text-orange-600 hover:bg-orange-100" },
    { name: "Cancionero", path: "/cancionero", hoverColor: "hover:text-yellow-600 hover:bg-yellow-100" },
    { name: "Recursos", path: "/recursos", hoverColor: "hover:text-green-600 hover:bg-green-100" },
    { name: "Galería", path: "/galeria", hoverColor: "hover:text-cyan-600 hover:bg-cyan-100" },
    { name: "Identidad", path: "/quienes-somos", hoverColor: "hover:text-indigo-600 hover:bg-indigo-100" },
  ];

  /* 🔒 Bloquear scroll cuando el menú está abierto */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  return (
    <>
      {/* NAVBAR */}
      <nav className="bg-slate-50/90 backdrop-blur-md text-gray-800 sticky top-0 z-50 border-b-2 border-dashed border-black shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-12">

            {/* LOGO */}
            <Link href="/" className="text-3xl font-black tracking-tighter flex items-center gap-1">
              <span>CEBRAS</span>
              <span className="text-red-600">L</span>
              <span className="text-green-600">P</span>
              <span className="ml-1">🦓</span>
            </Link>

            {/* DESKTOP */}
            <div className="hidden md:flex space-x-2 ">
              {menuItems.map(item => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`px-4 py-2 rounded-xl text-sm font-bold uppercase transition ${item.hoverColor}`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* HAMBURGUESA */}
            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden animate-slide-in flex flex-col"
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </nav>

      {/* ================= MENÚ MÓVIL OVERLAY ================= */}
      {isOpen && (
        <div className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm md:hidden">

          {/* PANEL */}
          <div className="absolute top-0 right-0 w-full h-full bg-slate-50 animate-slide-in flex flex-col">

            {/* CERRAR */}
            <div className="p-2 flex justify-between items-center border-b border-slate-100 bg-slate-50">
              <h2 className="text-center  items-center font-black text-red-500">MENÚ</h2>
              <button onClick={() => setIsOpen(false)}                 className="p-2 bg-red-100 text-red-500 rounded-full hover:bg-red-200 transition "
>
                <X size={28} />
              </button>
            </div>

            {/* LINKS */}
            <div className="px-4 py-4 space-y-2 flex-1 border-t border-slate-900 ">
              {menuItems.map(item => (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-4 rounded-xl text-lg font-black uppercase text-center transition ${item.hoverColor} border-2 border-black-100`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* FOOTER */}
            <div className="p-8 text-center border-t border-slate-500">
              <h2 className="text-3xl font-black flex justify-center gap-1">
                CEBRAS
                <span className="text-red-500">L</span>
                <span className="text-green-500">P</span>
                <span className="ml-2">🦓</span>
              </h2>
              <p className="text-xs uppercase tracking-widest font-bold text-slate-500 mt-2">
                La Paz - Bolivia
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
