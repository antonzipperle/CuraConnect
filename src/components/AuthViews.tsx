import React from 'react';
import { ChevronLeft, LogIn, UserPlus, User } from 'lucide-react';
import { ViewType } from '../types';

interface AuthForm {
  name: string;
  email: string;
  password: string;
  role: 'senior' | 'student';
  avatarUrl: string;
}

interface LoginViewProps {
  authForm: AuthForm;
  authError: string;
  onSetView: (view: ViewType) => void;
  onAuthFormChange: (form: AuthForm) => void;
  onLogin: (e: React.FormEvent) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  authForm,
  authError,
  onSetView,
  onAuthFormChange,
  onLogin,
}) => (
  <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
    <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-brand-blue/5 rounded-full blur-[150px]" />
    <div className="max-w-md w-full space-y-6 relative z-10">
      <button onClick={() => onSetView('landing')} className="glass-button-secondary p-3">
        <ChevronLeft className="w-6 h-6" />
      </button>

      <div className="glass-card p-10 shadow-2xl">
        <div className="flex justify-center mb-8">
          <div className="bg-brand-blue/10 p-5 rounded-3xl">
            <LogIn className="w-10 h-10 text-brand-blue" />
          </div>
        </div>
        <h2 className="text-3xl font-black text-center text-brand-dark mb-2 tracking-tight">
          Willkommen zurück
        </h2>
        <p className="text-center text-slate-500 font-bold mb-8">Schön, dass Sie wieder da sind.</p>

        {authError && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm font-black text-center border border-red-100">
            {authError}
          </div>
        )}

        <form onSubmit={onLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-black text-slate-700 ml-1 uppercase tracking-wider">
              E-Mail Adresse
            </label>
            <input
              type="email"
              required
              className="w-full p-4 bg-white/50 border border-white/60 rounded-2xl focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue outline-none transition-all font-semibold"
              value={authForm.email}
              onChange={(e) => onAuthFormChange({ ...authForm, email: e.target.value })}
              placeholder="name@beispiel.de"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-black text-slate-700 ml-1 uppercase tracking-wider">
              Passwort
            </label>
            <input
              type="password"
              required
              className="w-full p-4 bg-white/50 border border-white/60 rounded-2xl focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue outline-none transition-all font-semibold"
              value={authForm.password}
              onChange={(e) => onAuthFormChange({ ...authForm, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="glass-button w-full py-5 text-lg font-black tracking-tight mt-4">
            Einloggen
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => onSetView('register')}
            className="text-slate-500 font-bold hover:text-brand-blue transition-colors"
          >
            Noch keinen Account?{' '}
            <span className="text-brand-blue">Registrieren</span>
          </button>
        </div>
      </div>
    </div>
  </div>
);

interface RegisterViewProps {
  authForm: AuthForm;
  authError: string;
  onSetView: (view: ViewType) => void;
  onAuthFormChange: (form: AuthForm) => void;
  onRegister: (e: React.FormEvent) => void;
  onProfileImageUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (url: string) => void
  ) => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({
  authForm,
  authError,
  onSetView,
  onAuthFormChange,
  onRegister,
  onProfileImageUpload,
}) => (
  <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
    <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-yellow/5 rounded-full blur-[150px]" />
    <div className="max-w-md w-full space-y-6 relative z-10">
      <button onClick={() => onSetView('landing')} className="glass-button-secondary p-3">
        <ChevronLeft className="w-6 h-6" />
      </button>

      <div className="glass-card p-10 shadow-2xl">
        <div className="flex justify-center mb-8">
          <div className="bg-brand-blue/10 p-5 rounded-3xl">
            <UserPlus className="w-10 h-10 text-brand-blue" />
          </div>
        </div>
        <h2 className="text-3xl font-black text-center text-brand-dark mb-2 tracking-tight">
          Konto erstellen
        </h2>
        <p className="text-center text-slate-500 font-bold mb-8">
          Werden Sie Teil unserer Gemeinschaft.
        </p>

        {authError && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm font-black text-center border border-red-100">
            {authError}
          </div>
        )}

        <form onSubmit={onRegister} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-black text-slate-700 ml-1 uppercase tracking-wider">
              Ich bin...
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onAuthFormChange({ ...authForm, role: 'senior' })}
                className={`p-4 rounded-2xl border-2 font-black transition-all ${
                  authForm.role === 'senior'
                    ? 'border-brand-blue bg-brand-blue/5 text-brand-blue'
                    : 'border-white/60 bg-white/30 text-slate-500 hover:border-brand-blue/30'
                }`}
              >
                Senior/in
              </button>
              <button
                type="button"
                onClick={() => onAuthFormChange({ ...authForm, role: 'student' })}
                className={`p-4 rounded-2xl border-2 font-black transition-all ${
                  authForm.role === 'student'
                    ? 'border-brand-blue bg-brand-blue/5 text-brand-blue'
                    : 'border-white/60 bg-white/30 text-slate-500 hover:border-brand-blue/30'
                }`}
              >
                Helfer/in
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-black text-slate-700 ml-1 uppercase tracking-wider">
              Name
            </label>
            <input
              type="text"
              required
              className="w-full p-4 bg-white/50 border border-white/60 rounded-2xl focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue outline-none transition-all font-semibold"
              value={authForm.name}
              onChange={(e) => onAuthFormChange({ ...authForm, name: e.target.value })}
              placeholder="Max Mustermann"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-black text-slate-700 ml-1 uppercase tracking-wider">
              E-Mail Adresse
            </label>
            <input
              type="email"
              required
              className="w-full p-4 bg-white/50 border border-white/60 rounded-2xl focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue outline-none transition-all font-semibold"
              value={authForm.email}
              onChange={(e) => onAuthFormChange({ ...authForm, email: e.target.value })}
              placeholder="name@beispiel.de"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-black text-slate-700 ml-1 uppercase tracking-wider">
              Passwort
            </label>
            <input
              type="password"
              required
              className="w-full p-4 bg-white/50 border border-white/60 rounded-2xl focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue outline-none transition-all font-semibold"
              value={authForm.password}
              onChange={(e) => onAuthFormChange({ ...authForm, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-black text-slate-700 ml-1 uppercase tracking-wider">
              Profilbild (Optional)
            </label>
            <div className="flex items-center space-x-6 bg-white/30 p-4 rounded-2xl border border-white/40">
              {authForm.avatarUrl ? (
                <img
                  src={authForm.avatarUrl}
                  alt="Vorschau"
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-white/50 flex items-center justify-center border-2 border-white shadow-sm">
                  <User className="w-8 h-8 text-slate-400" />
                </div>
              )}
              <label className="glass-button-secondary px-4 py-2 text-[10px] font-black cursor-pointer uppercase tracking-widest">
                BILD WÄHLEN
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    onProfileImageUpload(e, (url) => onAuthFormChange({ ...authForm, avatarUrl: url }))
                  }
                />
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="glass-button w-full py-5 text-lg font-black tracking-tight mt-4"
          >
            Registrieren
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => onSetView('login')}
            className="text-slate-500 font-bold hover:text-brand-blue transition-colors"
          >
            Bereits einen Account?{' '}
            <span className="text-brand-blue">Einloggen</span>
          </button>
        </div>
      </div>
    </div>
  </div>
);
