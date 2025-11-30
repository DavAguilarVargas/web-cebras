import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-yellow-400 flex flex-col items-center justify-center p-6 text-center">
      
      <div className="bg-black text-white p-4 rounded-full mb-6 shadow-xl animate-bounce">
        <span className="text-6xl">🦓</span>
      </div>

      <h1 className="text-5xl font-black text-black mb-2 tracking-tight">¡Alto ahí!</h1>
      
      <div className="flex items-center gap-2 justify-center bg-black text-yellow-400 px-4 py-1 rounded-full font-bold uppercase text-xs tracking-widest mb-6">
        <AlertTriangle size={14} /> Error 404
      </div>

      <p className="text-black text-xl font-medium max-w-md mb-8 leading-relaxed">
        Esta calle no existe. Parece que te saliste del paso de cebra y te perdiste en el caos vehicular.
      </p>

      <Link 
        href="/"
        className="bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 hover:scale-105 transition shadow-lg flex items-center gap-2"
      >
        🔙 Volver al camino seguro
      </Link>
    </div>
  );
}