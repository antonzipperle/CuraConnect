import React from 'react';
import { User, HeartHandshake, LogIn, ShieldCheck } from 'lucide-react';
import { CuraConnectLogo } from './CuraConnectLogo';
import { ViewType } from '../types';

interface LandingViewProps {
  onSetView: (view: ViewType) => void;
  onSetRole: (role: 'senior' | 'student') => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onSetView, onSetRole }) => (
  <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
    <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-brand-blue/10 rounded-full blur-[120px] animate-pulse" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-brand-yellow/10 rounded-full blur-[120px] animate-pulse" />

    <div className="absolute top-8 right-8">
      <button
        onClick={() => onSetView('login')}
        className="glass-button-secondary px-6 py-2.5 flex items-center gap-2 font-bold text-sm tracking-tight"
      >
        <LogIn className="w-4 h-4" />
        Einloggen
      </button>
    </div>

    <div className="max-w-md w-full text-center space-y-12 relative z-10">
      <div className="flex justify-center">
        <div className="glass-card px-8 py-6 flex items-center gap-4 shadow-2xl scale-110">
          <CuraConnectLogo className="w-14 h-14" />
          <div className="text-left">
            <h1 className="text-3xl font-black tracking-tighter text-brand-dark leading-none">
              CuraConnect
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
              Generationen-Hilfe
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-5xl font-black text-brand-dark leading-[1.05] tracking-tight">
          Hilfe, die von <span className="text-brand-blue">Herzen</span> kommt.
        </h2>
        <p className="text-xl text-slate-600 font-semibold tracking-tight">
          Die soziale Plattform, die Senioren und engagierte Jugendliche verbindet.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 pt-4">
        <button
          onClick={() => {
            onSetRole('senior');
            onSetView('register');
          }}
          className="glass-button py-6 text-xl font-black tracking-tight flex items-center justify-center gap-3 shadow-xl"
        >
          <User className="w-6 h-6 text-brand-yellow" />
          Ich brauche Hilfe
        </button>

        <button
          onClick={() => {
            onSetRole('student');
            onSetView('register');
          }}
          className="glass-button-secondary py-6 text-xl font-black tracking-tight flex items-center justify-center gap-3 border-2 border-white/60 shadow-xl"
        >
          <HeartHandshake className="w-6 h-6 text-brand-blue" />
          Ich möchte helfen
        </button>
      </div>

      <div
        onClick={() => onSetView('insurance')}
        className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-brand-dark/60 glass-button-secondary py-3 px-6 rounded-full inline-flex mx-auto border border-white/40 cursor-pointer hover:scale-105 transition-all"
      >
        <ShieldCheck className="w-5 h-5 text-brand-blue" />
        <span>Mit CuraCare Schutz</span>
      </div>
    </div>
  </div>
);
