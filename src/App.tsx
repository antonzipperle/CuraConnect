import React, { useState, useEffect } from 'react';
import { Onboarding } from './components/Onboarding';
import { LandingView } from './components/LandingView';
import { LoginView, RegisterView } from './components/AuthViews';
import { SeniorDashboard } from './components/SeniorDashboard';
import { ProfileModal } from './components/ProfileModal';
import { RatingModal } from './components/RatingModal';
import { CuraPilot } from './components/CuraPilot';
import { AppUser, Job, Category, ViewType } from './types';
import * as api from './api';
import {
  HeartHandshake, CheckCircle2, Clock, MapPin, Coins, ShieldCheck,
  ChevronLeft, User, CreditCard, TrendingUp, Loader2, Sparkles, Flame,
  Trophy, Award,
} from 'lucide-react';

export default function App() {
  const [view, setView] = useState<ViewType>('landing');
  const [studentTab, setStudentTab] = useState<'jobs' | 'achievements'>('jobs');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getUsers(), api.getJobs()])
      .then(([u, j]) => { setUsers(u); setJobs(j); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', role: 'senior' as 'senior' | 'student', avatarUrl: '' });
  const [authError, setAuthError] = useState('');
  const [profileModalUserId, setProfileModalUserId] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', bio: '', avatarUrl: '' });
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [isCheckingJob, setIsCheckingJob] = useState(false);
  const [newJob, setNewJob] = useState({ title: '', category: 'Haushalt' as Category, date: '', location: '', reward: 0, paymentMethod: 'Kreditkarte' });
  const [creationMode, setCreationMode] = useState<'manual' | 'ai' | 'image'>('manual');
  const [aiInput, setAiInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [editingJobDateId, setEditingJobDateId] = useState<string | null>(null);
  const [newAppointmentDate, setNewAppointmentDate] = useState('');
  const [ratingModal, setRatingModal] = useState<{ isOpen: boolean; jobId: string; targetUserId: string; role: 'senior' | 'student' } | null>(null);
  const [ratingForm, setRatingForm] = useState({ stars: 5, comment: '' });
  const [activeFilter, setActiveFilter] = useState<Category | 'Alle'>('Alle');

  const currentCuraCoins = users.find((u) => u.id === currentUser?.id)?.curaCoins || 0;

  const formatDate = (dateString: string) => {
    try {
      if (dateString.includes('T')) {
        const d = new Date(dateString);
        return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ', ' + d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) + ' Uhr';
      }
    } catch (_) {}
    return dateString;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await api.login(authForm.email, authForm.password);
      setCurrentUser(user);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? user : u)));
      setView(user.role as ViewType);
      setAuthError('');
    } catch (err: any) { setAuthError(err.message); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await api.register(authForm.name, authForm.email, authForm.password, authForm.role, authForm.avatarUrl || undefined);
      setUsers((prev) => [...prev, user]);
      setCurrentUser(user);
      setView('onboarding');
      setAuthError('');
    } catch (err: any) { setAuthError(err.message); }
  };

  const handleLogout = () => { setCurrentUser(null); setView('landing'); };

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) { const r = new FileReader(); r.onloadend = () => callback(r.result as string); r.readAsDataURL(file); }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    const updated = await api.updateUser(currentUser.id, { name: profileForm.name, bio: profileForm.bio, avatarUrl: profileForm.avatarUrl });
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
    setCurrentUser(updated);
    setIsEditingProfile(false);
  };

  const handleSaveNewAppointment = async (jobId: string) => {
    if (!newAppointmentDate) return;
    const updated = await api.updateJob(jobId, { date: newAppointmentDate });
    setJobs((prev) => prev.map((j) => (j.id === jobId ? updated : j)));
    setEditingJobDateId(null);
    setNewAppointmentDate('');
  };

  const handleAiSubmit = async (text: string = aiInput, audioData?: string) => {
    const isInit = text === '__init__';
    if (!isInit) {
      if ((!text.trim() && !audioData) || isAiLoading) return;
      setAiMessages((prev) => [...prev, { role: 'user', text: text.trim() || 'Sprachnachricht gesendet' }]);
      setAiInput('');
    }
    setIsAiLoading(true);
    const prompt = `Du bist Assistent für Senioren. Status: Titel=${newJob.title||'leer'}, Kategorie=${newJob.category}, Datum=${newJob.date||'leer'}, Ort=${newJob.location||'leer'}, Vergütung=${newJob.reward||'leer'}\nEingabe: "${isInit ? 'Begrüße den Senior kurz.' : text}"\nJSON: {"updatedFields":{"title":null,"category":null,"date":null,"location":null,"reward":null},"messageToUser":"..."}`;
    try {
      const { text: resultText } = await api.aiChat(prompt, audioData);
      const result = JSON.parse(resultText);
      if (result.updatedFields) {
        setNewJob((prev) => {
          const u = { ...prev };
          if (result.updatedFields.title) u.title = result.updatedFields.title;
          if (result.updatedFields.category) u.category = result.updatedFields.category;
          if (result.updatedFields.date) u.date = result.updatedFields.date;
          if (result.updatedFields.location) u.location = result.updatedFields.location;
          if (result.updatedFields.reward != null) u.reward = result.updatedFields.reward;
          return u;
        });
      }
      setAiMessages((prev) => [...prev, { role: 'ai', text: result.messageToUser }]);
    } catch { setAiMessages((prev) => [...prev, { role: 'ai', text: 'Fehler. Bitte Formular manuell ausfüllen.' }]); }
    finally { setIsAiLoading(false); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsAiLoading(true); setCreationMode('image');
    const r = new FileReader();
    r.onloadend = async () => {
      const b64 = (r.result as string).split(',')[1];
      try {
        const { text } = await api.aiImage(b64, file.type, `Analysiere Bild: JSON {"title":"...","category":"...","reward":15}`);
        const result = JSON.parse(text);
        setNewJob((prev) => ({ ...prev, title: result.title || prev.title, category: result.category || prev.category, reward: result.reward ?? prev.reward }));
      } catch { alert('Bild konnte nicht verarbeitet werden.'); }
      finally { setCreationMode('manual'); setIsAiLoading(false); }
    };
    r.readAsDataURL(file);
  };

  const toggleRecording = async () => {
    if (isRecording && mediaRecorder) { mediaRecorder.stop(); setIsRecording(false); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const r = new FileReader(); r.readAsDataURL(blob);
        r.onloadend = () => { handleAiSubmit('', (r.result as string).split(',')[1]); stream.getTracks().forEach((t) => t.stop()); };
      };
      recorder.start(); setMediaRecorder(recorder); setIsRecording(true);
    } catch { alert('Kein Zugriff auf Mikrofon.'); }
  };

  const handleCreateJob = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newJob.title || !newJob.date || !newJob.location || !currentUser) return;
    setIsCheckingJob(true);
    setTimeout(async () => {
      try {
        const created = await api.createJob({ ...newJob, creatorId: currentUser.id });
        setJobs((prev) => [created, ...prev]);
        setIsCreatingJob(false);
        setNewJob({ title: '', category: 'Haushalt', date: '', location: '', reward: 0, paymentMethod: 'Kreditkarte' });
        alert('Anzeige freigegeben!');
      } finally { setIsCheckingJob(false); }
    }, 1500);
  };

  const handleApplyJob = async (jobId: string) => {
    if (!currentUser) return;
    const active = jobs.filter((j) => j.assigneeId === currentUser.id && (j.status === 'vergeben' || j.status === 'zu_bestätigen'));
    if (active.length >= 3) { alert('Max. 3 aktive Aufträge.'); return; }
    const job = jobs.find((j) => j.id === jobId)!;
    const updated = await api.updateJob(jobId, { applicants: [...job.applicants, currentUser.id] });
    setJobs((prev) => prev.map((j) => (j.id === jobId ? updated : j)));
    alert('Erfolgreich beworben!');
  };

  const handleAcceptApplicant = async (jobId: string, studentId: string) => {
    const updated = await api.updateJob(jobId, { status: 'vergeben', assigneeId: studentId });
    setJobs((prev) => prev.map((j) => (j.id === jobId ? updated : j)));
    alert('Jugendlichen ausgewählt!');
  };

  const handleStudentCompleteJob = async (jobId: string) => {
    const updated = await api.updateJob(jobId, { status: 'zu_bestätigen' });
    setJobs((prev) => prev.map((j) => (j.id === jobId ? updated : j)));
    alert('Als erledigt markiert. Senior muss bestätigen.');
  };

  const handleConfirmAndRate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ratingModal) return;
    const job = jobs.find((j) => j.id === ratingModal.jobId);
    if (!job) return;
    const jobPatch: Record<string, unknown> = ratingModal.role === 'senior' ? { status: 'erledigt', seniorRated: true } : { studentRated: true };
    const updatedJob = await api.updateJob(ratingModal.jobId, jobPatch);
    setJobs((prev) => prev.map((j) => (j.id === ratingModal.jobId ? updatedJob : j)));
    const target = users.find((u) => u.id === ratingModal.targetUserId)!;
    const newReviewCount = (target.reviewCount || 0) + 1;
    const newRating = ((target.rating || 5) * (target.reviewCount || 0) + ratingForm.stars) / newReviewCount;
    const userPatch: Record<string, unknown> = { rating: newRating, reviewCount: newReviewCount };
    if (ratingModal.role === 'senior') userPatch.curaCoins = (target.curaCoins || 0) + job.reward * 10;
    const updatedUser = await api.updateUser(ratingModal.targetUserId, userPatch);
    setUsers((prev) => prev.map((u) => (u.id === ratingModal.targetUserId ? updatedUser : u)));
    if (ratingModal.role === 'senior') alert(`Bestätigt! ${job.reward * 10} CuraCoins gutgeschrieben.`);
    else alert('Bewertung gespeichert!');
    setRatingModal(null); setRatingForm({ stars: 5, comment: '' });
  };

  const sharedModalProps = {
    profileModalUserId, users, currentUser, isEditingProfile, profileForm,
    onClose: () => { setProfileModalUserId(null); setIsEditingProfile(false); },
    onStartEdit: () => { const u = users.find((u) => u.id === profileModalUserId)!; setProfileForm({ name: u.name, bio: u.bio || '', avatarUrl: u.avatarUrl || '' }); setIsEditingProfile(true); },
    onSaveProfile: handleSaveProfile, onProfileFormChange: setProfileForm, onProfileImageUpload: handleProfileImageUpload,
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-brand-blue" /></div>;
  if (view === 'landing') return <LandingView onSetView={setView} onSetRole={(role) => setAuthForm((f) => ({ ...f, role }))} />;
  if (view === 'login') return <LoginView authForm={authForm} authError={authError} onSetView={setView} onAuthFormChange={setAuthForm} onLogin={handleLogin} />;
  if (view === 'register') return <RegisterView authForm={authForm} authError={authError} onSetView={setView} onAuthFormChange={setAuthForm} onRegister={handleRegister} onProfileImageUpload={handleProfileImageUpload} />;

  if (view === 'onboarding' && currentUser) {
    return <Onboarding user={currentUser} onComplete={async (data) => {
      const updated = await api.updateUser(currentUser.id, data);
      setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
      setCurrentUser(updated); setView(updated.role as ViewType);
    }} />;
  }

  if (view === 'senior' && currentUser) {
    return (<>
      <SeniorDashboard currentUser={currentUser} users={users} jobs={jobs}
        isCreatingJob={isCreatingJob} isCheckingJob={isCheckingJob} creationMode={creationMode}
        newJob={newJob} aiMessages={aiMessages} isAiLoading={isAiLoading} aiInput={aiInput}
        isRecording={isRecording} editingJobDateId={editingJobDateId} newAppointmentDate={newAppointmentDate}
        onSetView={setView} onLogout={handleLogout} onSetIsCreatingJob={setIsCreatingJob}
        onSetCreationMode={setCreationMode} onNewJobChange={setNewJob} onAiInputChange={setAiInput}
        onAiSubmit={handleAiSubmit} onToggleRecording={toggleRecording} onImageUpload={handleImageUpload}
        onCreateJob={handleCreateJob} onAcceptApplicant={handleAcceptApplicant}
        onStudentCompleteJob={handleStudentCompleteJob} onSetRatingModal={setRatingModal}
        onSetProfileModalUserId={setProfileModalUserId} onSetEditingJobDateId={setEditingJobDateId}
        onSetNewAppointmentDate={setNewAppointmentDate} onSaveNewAppointment={handleSaveNewAppointment} formatDate={formatDate} />
      <ProfileModal {...sharedModalProps} />
      <RatingModal ratingModal={ratingModal} users={users} ratingForm={ratingForm} onClose={() => setRatingModal(null)} onRatingFormChange={setRatingForm} onSubmit={handleConfirmAndRate} />
      <CuraPilot />
    </>);
  }

  if (view === 'student' && currentUser) {
    const availableJobs = jobs.filter((j) => j.status === 'offen' && !j.applicants.includes(currentUser.id));
    const myApplications = jobs.filter((j) => j.status === 'offen' && j.applicants.includes(currentUser.id));
    const myActiveJobs = jobs.filter((j) => j.assigneeId === currentUser.id && j.status === 'vergeben');
    const myPendingJobs = jobs.filter((j) => j.assigneeId === currentUser.id && j.status === 'zu_bestätigen');
    const completedJobs = jobs.filter((j) => j.assigneeId === currentUser.id && j.status === 'erledigt');
    const categories: (Category | 'Alle')[] = ['Alle', 'Garten', 'Haushalt', 'Technik', 'Einkauf'];
    const filteredJobs = activeFilter === 'Alle' ? availableJobs : availableJobs.filter((j) => j.category === activeFilter);

    return (<>
      <div className="min-h-screen pb-20 relative overflow-hidden">
        <header className="bg-brand-blue/90 backdrop-blur-md text-white p-8 shadow-2xl rounded-b-[3rem] relative z-10">
          <div className="flex justify-between items-center mb-8">
            <button onClick={handleLogout} className="glass-button-secondary px-4 py-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest border-white/40">
              <ChevronLeft className="w-5 h-5" /> Logout
            </button>
            <div className="flex items-center gap-4">
              <button onClick={() => setView('wallet')} className="flex items-center gap-2 bg-brand-yellow/20 text-brand-yellow px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-brand-yellow/30">
                <Coins className="w-5 h-5" /> {currentCuraCoins} CC
              </button>
              <div onClick={() => setView('insurance')} className="flex items-center gap-2 bg-brand-blue/20 text-blue-300 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-brand-blue/30 cursor-pointer">
                <ShieldCheck className="w-5 h-5" /> Versichert
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6 cursor-pointer group" onClick={() => setProfileModalUserId(currentUser.id)}>
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center border-2 border-white overflow-hidden group-hover:scale-105 transition-all shadow-lg">
              {currentUser.avatarUrl ? <img src={currentUser.avatarUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" /> : <User className="w-10 h-10 text-white" />}
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight group-hover:text-brand-yellow transition-colors">Hey {currentUser.name}! 👋</h1>
              <p className="text-blue-100 font-bold">Bereit, heute jemandem zu helfen?</p>
            </div>
          </div>
        </header>

        <main className="p-6 max-w-2xl mx-auto space-y-10 -mt-6 relative z-20">
          <div className="flex glass-card p-1.5 shadow-xl border-white/40">
            {(['jobs', 'achievements'] as const).map((tab) => (
              <button key={tab} onClick={() => setStudentTab(tab)} className={`flex-1 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${studentTab === tab ? 'bg-brand-blue text-white shadow-lg scale-[1.02]' : 'text-slate-500 hover:bg-white/40'}`}>
                {tab === 'achievements' && <Sparkles className="w-4 h-4" />}{tab === 'jobs' ? 'Aufgaben' : 'Erfolge'}
              </button>
            ))}
          </div>

          {studentTab === 'jobs' ? (<>
            {myActiveJobs.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-brand-dark flex items-center gap-2"><CheckCircle2 className="w-6 h-6 text-brand-yellow" /> Aktive Aufgaben</h2>
                {myActiveJobs.map((job) => (
                  <div key={job.id} className="glass-card bg-brand-yellow/10 border-brand-yellow/40 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-xl">
                    <div>
                      <h3 className="font-black text-brand-dark text-xl tracking-tight">{job.title}</h3>
                      <div className="flex items-center gap-4 text-slate-500 text-xs font-bold mt-2">
                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-brand-blue" />{formatDate(job.date)}</span>
                        <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-brand-blue" />{job.location}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 w-full sm:w-auto">
                      <div className="bg-white/60 px-4 py-2 rounded-2xl font-black text-brand-yellow border border-brand-yellow/30 text-center text-xs uppercase tracking-widest">{job.reward}€ ({job.reward * 10} CC)</div>
                      <button onClick={() => handleStudentCompleteJob(job.id)} className="glass-button px-6 py-3 text-xs font-black uppercase tracking-widest">Erledigt markieren</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {myPendingJobs.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-brand-dark flex items-center gap-2"><Clock className="w-6 h-6 text-brand-blue" /> Wartet auf Bestätigung</h2>
                {myPendingJobs.map((job) => (
                  <div key={job.id} className="glass-card bg-brand-blue/5 border-brand-blue/30 p-6 flex justify-between items-center shadow-xl">
                    <div><h3 className="font-black text-brand-dark text-xl tracking-tight">{job.title}</h3><p className="text-slate-500 text-xs font-bold mt-1 uppercase tracking-wider">Wartet auf Bestätigung</p></div>
                    <div className="bg-white/60 px-4 py-2 rounded-2xl font-black text-brand-blue border border-brand-blue/30 text-xs uppercase tracking-widest">{job.reward}€</div>
                  </div>
                ))}
              </div>
            )}

            {myApplications.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-brand-dark flex items-center gap-2"><HeartHandshake className="w-6 h-6 text-brand-blue" /> Deine Bewerbungen</h2>
                {myApplications.map((job) => (
                  <div key={job.id} className="glass-card p-6 border-white/60 shadow-xl flex justify-between items-center">
                    <div><h3 className="font-black text-brand-dark text-xl tracking-tight">{job.title}</h3><p className="text-slate-500 text-xs font-bold mt-1">Bewerbung läuft</p></div>
                    <div className="bg-slate-100/60 px-4 py-2 rounded-2xl font-black text-slate-600 text-xs uppercase tracking-widest">{job.reward}€</div>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-5">
              <h2 className="text-2xl font-black text-brand-dark tracking-tight px-2">Aufgaben in der Nähe</h2>
              <div className="flex overflow-x-auto pb-4 gap-3 hide-scrollbar px-2">
                {categories.map((cat) => (
                  <button key={cat} onClick={() => setActiveFilter(cat)} className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-md ${activeFilter === cat ? 'bg-brand-dark text-white scale-105 shadow-xl' : 'glass-card text-slate-600 border-white/60 hover:bg-white/80'}`}>{cat}</button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {filteredJobs.length === 0 ? (
                <div className="text-center py-16 glass-card border-dashed border-slate-300 shadow-inner"><p className="text-slate-500 font-black text-xs uppercase tracking-widest">Keine Aufgaben gefunden</p></div>
              ) : filteredJobs.map((job) => (
                <div key={job.id} className="glass-card p-6 border-white/60 shadow-2xl hover:scale-[1.01] transition-all group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white/40 rounded-3xl flex items-center justify-center text-brand-blue font-black text-xl overflow-hidden cursor-pointer shadow-inner" onClick={() => setProfileModalUserId(job.creatorId)}>
                        {users.find((u) => u.id === job.creatorId)?.avatarUrl ? <img src={users.find((u) => u.id === job.creatorId)?.avatarUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" /> : users.find((u) => u.id === job.creatorId)?.name.charAt(0) || 'S'}
                      </div>
                      <div>
                        <h3 className="font-black text-brand-dark text-xl tracking-tight">{job.title}</h3>
                        <div className="text-slate-500 text-xs font-bold uppercase tracking-wider cursor-pointer hover:text-brand-blue mt-1" onClick={() => setProfileModalUserId(job.creatorId)}>
                          Von {users.find((u) => u.id === job.creatorId)?.name || 'Senior'} • {job.category}
                        </div>
                      </div>
                    </div>
                    <div className="bg-brand-blue/10 text-brand-blue px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-widest shadow-inner border border-brand-blue/20">{job.reward}€ ({job.reward * 10} CC)</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-3 text-slate-600 bg-white/40 p-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-inner"><Clock className="w-5 h-5 text-brand-blue" />{formatDate(job.date)}</div>
                    <div className="flex items-center gap-3 text-slate-600 bg-white/40 p-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-inner overflow-hidden"><MapPin className="w-5 h-5 text-brand-blue flex-shrink-0" /><span className="truncate">{job.location}</span></div>
                  </div>
                  <button onClick={() => handleApplyJob(job.id)} className="glass-button w-full py-4 text-xs font-black uppercase tracking-widest shadow-xl">Jetzt bewerben</button>
                </div>
              ))}
            </div>
          </>) : (
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-brand-dark to-slate-900 p-6 rounded-3xl text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><Trophy className="w-7 h-7 text-brand-yellow" /> CuraConnect Hero</h2>
                  <p className="text-slate-300 mb-6">Dein Impact in der Community.</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 p-4 rounded-2xl border border-white/10"><div className="flex items-center gap-2 mb-1"><Flame className="w-5 h-5 text-orange-500" /><span className="font-bold text-slate-200">Cura-Flame</span></div><div className="text-3xl font-bold text-white">3 <span className="text-lg text-slate-400">Wochen</span></div></div>
                    <div className="bg-white/10 p-4 rounded-2xl border border-white/10"><div className="flex items-center gap-2 mb-1"><Award className="w-5 h-5 text-brand-yellow" /><span className="font-bold text-slate-200">Level</span></div><div className="text-3xl font-bold text-white">Local Hero</div></div>
                  </div>
                </div>
                <Sparkles className="absolute -right-4 -top-4 w-32 h-32 text-white opacity-5" />
              </div>
              <p className="text-center text-slate-400 font-bold text-sm">Weitere Badges nach dem ersten Einsatz!</p>
            </div>
          )}
        </main>
      </div>
      <ProfileModal {...sharedModalProps} />
      <RatingModal ratingModal={ratingModal} users={users} ratingForm={ratingForm} onClose={() => setRatingModal(null)} onRatingFormChange={setRatingForm} onSubmit={handleConfirmAndRate} />
      <CuraPilot />
    </>);
  }

  if (view === 'wallet' && currentUser) {
    const completedJobs = jobs.filter((j) => j.assigneeId === currentUser.id && j.status === 'erledigt');
    return (
      <div className="min-h-screen pb-20">
        <header className="bg-brand-dark text-white p-8 shadow-2xl rounded-b-[3rem]">
          <div className="flex justify-between items-center mb-8">
            <button onClick={() => setView(currentUser.role as ViewType)} className="glass-button-secondary px-4 py-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest border-white/20"><ChevronLeft className="w-5 h-5" /> Zurück</button>
            <div className="flex items-center gap-2 bg-brand-yellow/20 text-brand-yellow px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-brand-yellow/30"><Coins className="w-5 h-5" />{currentCuraCoins} CC</div>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-brand-yellow rounded-[2rem] flex items-center justify-center text-brand-dark border-4 border-white/20"><Coins className="w-10 h-10" /></div>
            <div><h1 className="text-4xl font-black tracking-tight">Dein Wallet</h1><p className="text-slate-400 font-bold mt-1">Verwalte deine CuraCoins</p></div>
          </div>
        </header>
        <main className="p-6 max-w-lg mx-auto space-y-10 mt-4">
          <div className="glass-card p-8 bg-gradient-to-br from-brand-blue to-blue-900 border-white/20 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <p className="text-blue-200 font-black uppercase tracking-widest text-xs mb-2">Aktuelles Guthaben</p>
              <h2 className="text-6xl font-black text-brand-yellow mb-2 tracking-tighter">{currentCuraCoins} <span className="text-2xl text-white/80">CC</span></h2>
              <p className="text-xs text-blue-100 font-bold bg-white/10 px-4 py-2 rounded-full mt-2">≈ {(currentCuraCoins / 10).toFixed(2)} €</p>
            </div>
          </div>
          <div className="space-y-6">
            <h3 className="text-2xl font-black text-brand-dark tracking-tight px-2">Verlauf</h3>
            <div className="glass-card border-white/60 shadow-2xl overflow-hidden">
              {completedJobs.length > 0 ? completedJobs.map((job) => (
                <div key={job.id} className="p-6 border-b border-slate-100/50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50/60 rounded-2xl flex items-center justify-center text-emerald-600"><TrendingUp className="w-6 h-6" /></div>
                    <div><p className="font-black text-brand-dark">{job.title}</p><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{formatDate(job.date)}</p></div>
                  </div>
                  <span className="font-black text-emerald-600 text-lg">+{job.reward * 10} CC</span>
                </div>
              )) : <div className="p-10 text-center"><p className="text-slate-400 font-bold italic">Noch keine abgeschlossenen Einsätze.</p></div>}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (view === 'senior-payment' && currentUser) {
    const myJobs = jobs.filter((j) => j.creatorId === currentUser.id);
    const pending = myJobs.filter((j) => j.status === 'vergeben' || j.status === 'zu_bestätigen');
    const completed = myJobs.filter((j) => j.status === 'erledigt');
    return (
      <div className="min-h-screen pb-20">
        <header className="bg-brand-blue text-white p-8 shadow-2xl rounded-b-[3rem]">
          <button onClick={() => setView('senior')} className="glass-button-secondary px-4 py-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest border-white/20 mb-8"><ChevronLeft className="w-6 h-6" /> Zurück</button>
          <div className="flex items-center gap-6"><div className="w-20 h-20 bg-white/20 rounded-[2rem] flex items-center justify-center"><CreditCard className="w-10 h-10" /></div><div><h1 className="text-4xl font-black tracking-tight">Bezahlung</h1><p className="text-blue-100 font-bold mt-1">Rechnungen & Zahlungsmittel</p></div></div>
        </header>
        <main className="p-6 max-w-lg mx-auto space-y-10 mt-4">
          {[{ label: 'Vorgemerkt', items: pending }, { label: 'Abgeschlossen', items: completed }].map(({ label, items }) => (
            <div key={label} className="space-y-6">
              <h3 className="text-2xl font-black text-brand-dark tracking-tight px-2">{label}</h3>
              <div className="glass-card border-white/60 shadow-2xl overflow-hidden">
                {items.length > 0 ? items.map((job) => (
                  <div key={job.id} className="p-6 border-b border-slate-100/50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-brand-blue"><CreditCard className="w-6 h-6" /></div>
                      <div><p className="font-black text-brand-dark">{job.title}</p><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{label === 'Vorgemerkt' ? 'Treuhänderisch reserviert' : `Bezahlt am ${formatDate(job.date)}`}</p></div>
                    </div>
                    <span className="font-black text-brand-dark text-lg">{job.reward} €</span>
                  </div>
                )) : <div className="p-10 text-center"><p className="text-slate-400 font-bold italic">Keine Einträge.</p></div>}
              </div>
            </div>
          ))}
        </main>
      </div>
    );
  }

  if (view === 'insurance') {
    const goBack = () => { if (!currentUser) setView('landing'); else setView(currentUser.role as ViewType); };
    return (
      <div className="min-h-screen pb-20 bg-brand-light">
        <header className="bg-brand-blue text-white p-10 shadow-2xl rounded-b-[4rem]">
          <div className="flex justify-between items-center mb-10">
            <button onClick={goBack} className="w-12 h-12 glass-card flex items-center justify-center border-white/40"><ChevronLeft className="w-6 h-6" /></button>
            <div className="w-12 h-12 glass-card flex items-center justify-center border-white/40"><ShieldCheck className="w-6 h-6 text-brand-yellow" /></div>
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Versicherung & Schutz</h1>
          <p className="text-blue-100 opacity-80">Sicherheit steht bei uns an erster Stelle.</p>
        </header>
        <main className="p-6 max-w-lg mx-auto space-y-8 mt-8">
          <div className="glass-card p-8 border-emerald-200/40 shadow-2xl">
            <div className="flex items-center gap-5 mb-6">
              <div className="w-16 h-16 bg-emerald-100/60 rounded-2xl flex items-center justify-center text-emerald-600"><ShieldCheck className="w-8 h-8" /></div>
              <div><h3 className="text-2xl font-black text-brand-dark">Vollkasko-Schutz</h3><p className="text-slate-500 text-xs uppercase tracking-widest mt-1">Haftpflicht & Unfall</p></div>
            </div>
            <p className="text-slate-600 leading-relaxed italic">Jede über CuraConnect vermittelte Aufgabe ist durch unsere Gruppenversicherung bei der <span className="font-black text-brand-dark not-italic">Allianz</span> abgedeckt.</p>
          </div>
          <div className="glass-card p-8 border-brand-yellow/40 shadow-2xl bg-brand-yellow/5">
            <h3 className="text-xl font-black text-brand-dark mb-4">Wichtig für Studierende</h3>
            <p className="text-sm text-slate-600">Diese Versicherung ist für dich <span className="font-black text-brand-dark">kostenlos</span> und ergänzt deine private Haftpflicht.</p>
          </div>
        </main>
      </div>
    );
  }

  return null;
}
