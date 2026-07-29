import React from "react";
import { X, Smartphone } from "lucide-react";

interface IosInstallModalProps {
  onClose: () => void;
}

export function IosInstallModal({ onClose }: IosInstallModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-6 border border-slate-100 shadow-2xl relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto">
            <Smartphone size={32} />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">Installera på iPhone / iPad</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            För att ta emot Web Push-aviseringar på iOS måste du lägga till denna webbapp på din hemskärm först:
          </p>
        </div>
        <ol className="text-xs text-slate-700 space-y-3 font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <li className="flex gap-2">
            <span className="text-teal-600 font-bold">1.</span>
            <span>Klicka på <strong>Dela-knappen</strong> i Safari (fyrkant med pil uppåt).</span>
          </li>
          <li className="flex gap-2">
            <span className="text-teal-600 font-bold">2.</span>
            <span>Scrolla ner och välj <strong>"Lägg till på hemskärmen"</strong>.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-teal-600 font-bold">3.</span>
            <span>Öppna appen från din hemskärm och anslut aviseringarna igen!</span>
          </li>
        </ol>
        <button
          onClick={onClose}
          className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
        >
          Jag förstår
        </button>
      </div>
    </div>
  );
}
