/*import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
*/
import Link from "next/link";
import Image from "next/image";
import { Music, Calendar, ShieldAlert } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 pb-10">
      
      {/* 1. SECCIÓN DE IMAGEN PRINCIPAL (HERO) */}
      <section className="relative h-[300px] md:h-[400px] w-full bg-black">
        <Image 
          src="/images/hero-cebras.jpg" 
          alt="Cebras en acción" 
          fill
          className="object-cover opacity-50"
          priority 
        />

        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 container mx-auto">
          <div className="bg-white/20 backdrop-blur-md p-4 rounded-full mb-4 shadow-lg border border-white/30">
             <span className="text-5xl">🦓</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-3 drop-shadow-xl tracking-tight">
            ¡Hola, Cebra!
          </h1>
          <p className="text-xl md:text-2xl text-white font-medium drop-shadow-md max-w-lg leading-relaxed">
            ¿Listo para ponerle actitud a la ciudad hoy?
          </p>
        </div>
      </section>

      {/* 2. SECCIÓN DE HERRAMIENTAS */}
      <section className="container mx-auto px-4 relative z-10">
        
        {/* Título Flotante */}
        <div className="-mt-14 mb-4 text-center md:text-left pl-2"> 
             <span className="bg-yellow-400 text-black font-bold uppercase tracking-widest text-xs px-4 py-2 rounded shadow-md inline-block">
                Herramientas del Día
             </span>
        </div>

        {/* GRID DE 3 COLUMNAS CON GAP REDUCIDO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          
          {/* --- Botón Cancionero --- */}
          <Link href="/cancionero" className="group bg-white p-4 rounded-2xl shadow-lg border-2 border-white hover:border-yellow-400 transition flex items-center justify-between relative overflow-hidden h-32">
            
            {/* 1. Icono Izquierda (Lucide) */}
            <div className="bg-pink-100 p-3 rounded-xl text-pink-600 group-hover:bg-pink-500 group-hover:text-white transition shadow-sm z-20 shrink-0">
              <Music size={24} />
            </div>

            {/* 2. Texto Centro (Flexible) */}
            <div className="flex-1 px-3 z-20">
              <h3 className="font-bold text-lg text-gray-900 leading-none mb-1">Cancionero</h3>
              <p className="text-xs text-gray-500 leading-tight">Repasa letras y ritmos</p>
            </div>

            {/* 3. Imagen PNG Derecha (Más grande) */}
            <div className="relative w-24 h-24 -mr-4 transform group-hover:scale-110 transition z-10 opacity-90">
               <Image 
                 src="/icons/cancionero.png" 
                 alt="Música" 
                 fill 
                 className="object-contain" 
               />
            </div>
          </Link>

          {/* --- Botón Agenda --- */}
          <Link href="/noticias" className="group bg-white p-4 rounded-2xl shadow-lg border-2 border-white hover:border-yellow-400 transition flex items-center justify-between relative overflow-hidden h-32">
            
            <div className="bg-blue-100 p-3 rounded-xl text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition shadow-sm z-20 shrink-0">
              <Calendar size={24} />
            </div>

            <div className="flex-1 px-3 z-20">
              <h3 className="font-bold text-lg text-gray-900 leading-none mb-1">Agenda</h3>
              <p className="text-xs text-gray-500 leading-tight">Cronograma semanal</p>
            </div>

            <div className="relative w-24 h-24 -mr-4 transform group-hover:scale-110 transition z-10 opacity-90">
               <Image 
                 src="/icons/agenda.png" 
                 alt="Calendario" 
                 fill 
                 className="object-contain" 
               />
            </div>
          </Link>

          {/* --- Botón Recursos --- */}
          <Link href="/recursos" className="group bg-white p-4 rounded-2xl shadow-lg border-2 border-white hover:border-yellow-400 transition flex items-center justify-between relative overflow-hidden h-32">
            
            <div className="bg-yellow-100 p-3 rounded-xl text-yellow-700 group-hover:bg-yellow-500 group-hover:text-white transition shadow-sm z-20 shrink-0">
              <ShieldAlert size={24} />
            </div>

            <div className="flex-1 px-3 z-20">
              <h3 className="font-bold text-lg text-gray-900 leading-none mb-1">Caja Ayuda</h3>
              <p className="text-xs text-gray-500 leading-tight">Protocolos y guías</p>
            </div>

            <div className="relative w-24 h-24 -mr-4 transform group-hover:scale-110 transition z-10 opacity-90">
               <Image 
                 src="/icons/recursos (2).png" 
                 alt="Ayuda" 
                 fill 
                 className="object-contain" 
               />
            </div>
          </Link>

        </div>
      </section>

      {/* 3. FOOTER */}
      <section className="container mx-auto px-6 mt-10">
        <div className="bg-black border-l-8 border-yellow-400 text-white p-6 rounded-r-2xl shadow-lg">
          <h3 className="text-yellow-400 font-bold mb-1 text-sm uppercase tracking-widest">Filosofía Cebra</h3>
          <p className="text-lg font-medium italic">
            "La sonrisa debajo de la máscara es tu herramienta más poderosa."
          </p>
        </div>
      </section>

    </main>
  );
}