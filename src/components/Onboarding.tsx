import React, { useState } from 'react';
import { Camera, CheckCircle, MapPin, Calendar, Star, ShieldCheck, Coins, Heart, Phone, Sparkles } from 'lucide-react';

interface OnboardingProps {
  user: any;
  onComplete: (updatedData: any) => void;
}

export function Onboarding({ user, onComplete }: OnboardingProps) {
  const isStudent = user.role === 'student';
  const [step, setStep] = useState(1);
  
  // Student State
  const [bio, setBio] = useState(user.bio || '');
  const [skills, setSkills] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string[]>([]);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Senior State
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState(5);
  const [needs, setNeeds] = useState<string[]>([]);
  const [preference, setPreference] = useState<'same' | 'change_ok'>('change_ok');
  const [emergencyContact, setEmergencyContact] = useState('');

  const availableSkills = ['Einkaufen', 'Gartenarbeit', 'Technikhilfe', 'Haushalt', 'Gesellschaft', 'Hunde ausführen'];
  const availableNeeds = ['Wöchentlicher Einkauf', 'Rasenmähen', 'Smartphone erklären', 'Fenster putzen', 'Spazieren gehen', 'Schwere Dinge heben'];
  const availableTimes = ['Vormittags', 'Nachmittags', 'Abends', 'Wochenende'];

  const toggleSelection = (item: string, list: string[], setList: (l: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleFinish = () => {
    if (isStudent) {
      onComplete({
        bio,
        skills,
        availability,
        avatarUrl,
        verified: true, // Simulate verification for demo
        curaCoins: 0,
        rating: 5.0, // Start with a perfect rating for the demo
        reviewCount: 0
      });
    } else {
      onComplete({
        bio,
        location,
        radius,
        needs,
        preference,
        emergencyContact,
        avatarUrl,
        curaPlus: false
      });
    }
  };

  if (isStudent) {
    return (
      <div className="min-h-screen flex flex-col items-center py-12 px-4 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-blue/5 rounded-full blur-[120px]" />
        
        <div className="max-w-2xl w-full glass-card shadow-2xl overflow-hidden relative z-10">
          <div className="bg-brand-blue/90 backdrop-blur-md p-10 text-white text-center border-b border-white/20">
            <h1 className="text-4xl font-black mb-2 tracking-tight">Willkommen, {user.name}!</h1>
            <p className="text-blue-100 font-bold">Lass uns dein Helfer-Profil einrichten.</p>
          </div>
          
          <div className="p-10">
            {/* Progress Bar */}
            <div className="flex gap-3 mb-10">
              {[1, 2, 3].map(i => (
                <div key={i} className={`h-2.5 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-brand-blue shadow-[0_0_15px_rgba(0,122,255,0.5)]' : 'bg-slate-100'}`} />
              ))}
            </div>

            {step === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-brand-dark flex items-center gap-3 tracking-tight">
                    <Camera className="w-8 h-8 text-brand-blue" />
                    Vorstellung & Foto
                  </h2>
                  <p className="text-slate-500 font-bold">Ein freundliches Profilbild schafft Vertrauen.</p>
                </div>
                
                <div className="flex justify-center">
                  <label className="relative w-40 h-40 bg-white/50 rounded-full flex items-center justify-center border-4 border-dashed border-white shadow-inner cursor-pointer hover:bg-white/80 transition-all overflow-hidden group">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Profilbild" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="text-center">
                        <Camera className="w-10 h-10 text-slate-300 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Foto hochladen</span>
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-black text-slate-700 ml-1 uppercase tracking-wider">Über mich</label>
                  <textarea 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full p-5 bg-white/50 border border-white/60 rounded-[2rem] focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue outline-none transition-all resize-none h-40 font-medium"
                    placeholder="Erzähle etwas über dich, deine Hobbys und warum du gerne helfen möchtest..."
                  />
                </div>
                
                <button onClick={() => setStep(2)} className="glass-button w-full py-5 text-lg font-black tracking-tight">
                  Weiter
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-brand-dark flex items-center gap-3 tracking-tight">
                    <Star className="w-8 h-8 text-brand-yellow" />
                    Fähigkeiten & Zeit
                  </h2>
                  <p className="text-slate-500 font-bold">Wobei kannst du helfen und wann hast du Zeit?</p>
                </div>
                
                <div className="space-y-4">
                  <label className="block text-sm font-black text-slate-700 ml-1 uppercase tracking-wider">Meine Fähigkeiten</label>
                  <div className="flex flex-wrap gap-3">
                    {availableSkills.map(skill => (
                      <button
                        key={skill}
                        onClick={() => toggleSelection(skill, skills, setSkills)}
                        className={`px-6 py-3 rounded-2xl text-sm font-black transition-all border-2 ${
                          skills.includes(skill) 
                            ? 'bg-brand-blue text-white border-brand-blue shadow-lg scale-105' 
                            : 'bg-white/50 text-slate-500 border-white/60 hover:border-brand-blue/30'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-black text-slate-700 ml-1 uppercase tracking-wider">Verfügbarkeit</label>
                  <div className="flex flex-wrap gap-3">
                    {availableTimes.map(time => (
                      <button
                        key={time}
                        onClick={() => toggleSelection(time, availability, setAvailability)}
                        className={`px-6 py-3 rounded-2xl text-sm font-black transition-all border-2 flex items-center gap-2 ${
                          availability.includes(time) 
                            ? 'bg-brand-yellow text-brand-dark border-brand-yellow shadow-lg scale-105' 
                            : 'bg-white/50 text-slate-500 border-white/60 hover:border-brand-yellow/30'
                        }`}
                      >
                        <Calendar className="w-4 h-4" />
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button onClick={() => setStep(1)} className="glass-button-secondary px-8 py-5 font-black">
                    Zurück
                  </button>
                  <button onClick={() => setStep(3)} className="glass-button flex-1 py-5 text-lg font-black tracking-tight">
                    Weiter
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-brand-dark flex items-center gap-3 tracking-tight">
                    <ShieldCheck className="w-8 h-8 text-emerald-500" />
                    Profil-Vorschau
                  </h2>
                  <p className="text-slate-500 font-bold">So sehen Senioren dein Profil.</p>
                </div>
                
                <div className="bg-white/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/60 shadow-xl space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-2xl font-black text-brand-blue overflow-hidden shadow-md border-2 border-white">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Profilbild" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        user.name.charAt(0)
                      )}
                    </div>
                    <div>
                      <h3 className="font-black text-2xl tracking-tight flex items-center gap-2">
                        {user.name}
                        <ShieldCheck className="w-6 h-6 text-emerald-500" />
                      </h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1 text-brand-yellow font-black text-sm">
                          <Star className="w-4 h-4 fill-current" /> 5.0
                        </span>
                        <span className="flex items-center gap-1 text-slate-400 font-black text-sm uppercase tracking-widest">
                          <Coins className="w-4 h-4" /> 0 CC
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 font-medium italic leading-relaxed">"{bio || 'Keine Beschreibung.'}"</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {skills.map(s => (
                      <span key={s} className="px-3 py-1.5 bg-white/60 border border-white rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-emerald-50/50 backdrop-blur-sm text-emerald-700 p-5 rounded-2xl border border-emerald-100 flex gap-4">
                  <CheckCircle className="w-6 h-6 shrink-0" />
                  <p className="text-sm font-bold leading-relaxed">Deine Identität wird im nächsten Schritt verifiziert. Danach kannst du sofort loslegen!</p>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button onClick={() => setStep(2)} className="glass-button-secondary px-8 py-5 font-black">
                    Zurück
                  </button>
                  <button onClick={handleFinish} className="glass-button flex-1 py-5 text-lg font-black tracking-tight">
                    Profil erstellen
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Senior Onboarding
  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 relative overflow-hidden">
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-yellow/5 rounded-full blur-[120px]" />

      <div className="max-w-2xl w-full glass-card shadow-2xl overflow-hidden relative z-10">
        <div className="bg-brand-blue/90 backdrop-blur-md p-10 text-white text-center border-b border-white/20">
          <h1 className="text-4xl font-black mb-2 tracking-tight">Willkommen, {user.name}!</h1>
          <p className="text-blue-100 font-bold">Wir finden die passende Hilfe für Sie.</p>
        </div>
        
        <div className="p-10">
          {/* Progress Bar */}
          <div className="flex gap-3 mb-10">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-2.5 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-brand-blue shadow-[0_0_15px_rgba(0,122,255,0.5)]' : 'bg-slate-100'}`} />
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-brand-dark flex items-center gap-3 tracking-tight">
                  <MapPin className="w-8 h-8 text-brand-blue" />
                  Standort
                </h2>
                <p className="text-slate-500 font-bold">Wo benötigen Sie Hilfe?</p>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-black text-slate-700 ml-1 uppercase tracking-wider">Ihr Wohnort</label>
                <input 
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-5 bg-white/50 border border-white/60 rounded-2xl focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue outline-none transition-all font-semibold"
                  placeholder="z.B. München, Schwabing"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-black text-slate-700 ml-1 uppercase tracking-wider flex justify-between">
                  <span>Suchradius</span>
                  <span className="text-brand-blue">{radius} km</span>
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="20" 
                  value={radius}
                  onChange={(e) => setRadius(parseInt(e.target.value))}
                  className="w-full h-3 bg-white/50 rounded-full appearance-none cursor-pointer accent-brand-blue border border-white/60"
                />
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                  <span>1 km</span>
                  <span>20 km</span>
                </div>
              </div>
              
              <button onClick={() => setStep(2)} className="glass-button w-full py-5 text-lg font-black tracking-tight">
                Weiter
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-brand-dark flex items-center gap-3 tracking-tight">
                  <Heart className="w-8 h-8 text-brand-yellow" />
                  Bedarfsprofil
                </h2>
                <p className="text-slate-500 font-bold">Wobei benötigen Sie Unterstützung?</p>
              </div>
              
              <div className="flex justify-center">
                <label className="relative w-40 h-40 bg-white/50 rounded-full flex items-center justify-center border-4 border-dashed border-white shadow-inner cursor-pointer hover:bg-white/80 transition-all overflow-hidden group">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Profilbild" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="text-center">
                      <Camera className="w-10 h-10 text-slate-300 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Foto hochladen</span>
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageUpload}
                  />
                </label>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-black text-slate-700 ml-1 uppercase tracking-wider">Aufgaben</label>
                <div className="flex flex-wrap gap-3">
                  {availableNeeds.map(need => (
                    <button
                      key={need}
                      onClick={() => toggleSelection(need, needs, setNeeds)}
                      className={`px-6 py-3 rounded-2xl text-sm font-black transition-all border-2 ${
                        needs.includes(need) 
                          ? 'bg-brand-blue text-white border-brand-blue shadow-lg scale-105' 
                          : 'bg-white/50 text-slate-500 border-white/60 hover:border-brand-blue/30'
                      }`}
                    >
                      {need}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-black text-slate-700 ml-1 uppercase tracking-wider">Beschreibung</label>
                <textarea 
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-5 bg-white/50 border border-white/60 rounded-[2rem] focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue outline-none transition-all resize-none h-32 font-medium"
                  placeholder="Beschreiben Sie kurz Ihre Situation..."
                />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button onClick={() => setStep(1)} className="glass-button-secondary px-8 py-5 font-black">
                  Zurück
                </button>
                <button onClick={() => setStep(3)} className="glass-button flex-1 py-5 text-lg font-black tracking-tight">
                  Weiter
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-brand-dark flex items-center gap-3 tracking-tight">
                  <ShieldCheck className="w-8 h-8 text-emerald-500" />
                  Präferenzen
                </h2>
                <p className="text-slate-500 font-bold">Ihre Sicherheit ist uns wichtig.</p>
              </div>
              
              <div className="space-y-4">
                <label className="block text-sm font-black text-slate-700 ml-1 uppercase tracking-wider">Wer soll helfen?</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    onClick={() => setPreference('same')}
                    className={`p-6 rounded-[2rem] border-2 text-left transition-all ${preference === 'same' ? 'border-brand-blue bg-brand-blue/5 shadow-lg scale-[1.02]' : 'border-white/60 bg-white/30 hover:border-brand-blue/30'}`}
                  >
                    <div className="font-black text-brand-dark mb-1 tracking-tight">Feste Bezugsperson</div>
                    <div className="text-xs text-slate-500 font-bold">Ich möchte Vertrauen aufbauen.</div>
                  </button>
                  <button 
                    onClick={() => setPreference('change_ok')}
                    className={`p-6 rounded-[2rem] border-2 text-left transition-all ${preference === 'change_ok' ? 'border-brand-blue bg-brand-blue/5 shadow-lg scale-[1.02]' : 'border-white/60 bg-white/30 hover:border-brand-blue/30'}`}
                  >
                    <div className="font-black text-brand-dark mb-1 tracking-tight">Wechsel ist okay</div>
                    <div className="text-xs text-slate-500 font-bold">Hauptsache zuverlässig.</div>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-black text-slate-700 ml-1 uppercase tracking-wider flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Notfall-Kontakt
                </label>
                <input 
                  type="tel"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  className="w-full p-5 bg-white/50 border border-white/60 rounded-2xl focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue outline-none transition-all font-semibold"
                  placeholder="Telefonnummer"
                />
              </div>

              <div className="bg-gradient-to-br from-brand-yellow/20 to-brand-yellow/5 p-6 rounded-[2rem] border border-brand-yellow/30 shadow-sm">
                <div className="flex items-start gap-4">
                  <Sparkles className="w-8 h-8 text-brand-yellow shrink-0" />
                  <div>
                    <h4 className="font-black text-brand-dark tracking-tight">Cura+ Premium</h4>
                    <p className="text-sm text-slate-600 font-medium mt-1">Bevorzugte Vermittlung und feste Ansprechpartner. Später aktivierbar.</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button onClick={() => setStep(2)} className="glass-button-secondary px-8 py-5 font-black">
                  Zurück
                </button>
                <button onClick={handleFinish} className="glass-button flex-1 py-5 text-lg font-black tracking-tight">
                  Profil speichern
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
