import React from 'react';
import {
  ChevronLeft, ShieldCheck, User, CreditCard, PlusCircle, X, Bot, Camera, Mic, Send,
  Loader2, Clock, MapPin, Star, CheckCircle2,
} from 'lucide-react';
import { AppUser, Job, Category } from '../types';

interface SeniorDashboardProps {
  currentUser: AppUser;
  users: AppUser[];
  jobs: Job[];
  isCreatingJob: boolean;
  isCheckingJob: boolean;
  creationMode: 'manual' | 'ai' | 'image';
  newJob: { title: string; category: Category; date: string; location: string; reward: number; paymentMethod: string };
  aiMessages: { role: 'user' | 'ai'; text: string }[];
  isAiLoading: boolean;
  aiInput: string;
  isRecording: boolean;
  editingJobDateId: string | null;
  newAppointmentDate: string;
  onSetView: (view: any) => void;
  onLogout: () => void;
  onSetIsCreatingJob: (v: boolean) => void;
  onSetCreationMode: (m: 'manual' | 'ai' | 'image') => void;
  onNewJobChange: (j: any) => void;
  onAiInputChange: (v: string) => void;
  onAiSubmit: (text?: string) => void;
  onToggleRecording: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCreateJob: (e: React.FormEvent) => void;
  onAcceptApplicant: (jobId: string, studentId: string) => void;
  onStudentCompleteJob: (jobId: string) => void;
  onSetRatingModal: (m: any) => void;
  onSetProfileModalUserId: (id: string) => void;
  onSetEditingJobDateId: (id: string | null) => void;
  onSetNewAppointmentDate: (d: string) => void;
  onSaveNewAppointment: (jobId: string) => void;
  formatDate: (d: string) => string;
}

export const SeniorDashboard: React.FC<SeniorDashboardProps> = ({
  currentUser, users, jobs, isCreatingJob, isCheckingJob, creationMode, newJob,
  aiMessages, isAiLoading, aiInput, isRecording, editingJobDateId, newAppointmentDate,
  onSetView, onLogout, onSetIsCreatingJob, onSetCreationMode, onNewJobChange,
  onAiInputChange, onAiSubmit, onToggleRecording, onImageUpload, onCreateJob,
  onAcceptApplicant, onStudentCompleteJob, onSetRatingModal, onSetProfileModalUserId,
  onSetEditingJobDateId, onSetNewAppointmentDate, onSaveNewAppointment, formatDate,
}) => {
  const myJobs = jobs.filter((j) => j.creatorId === currentUser.id);

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-blue/5 rounded-full blur-[120px]" />

      <header className="bg-brand-blue/90 backdrop-blur-md text-white p-8 shadow-2xl rounded-b-[3rem] relative z-10 border-b border-white/20">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={onLogout}
            className="glass-button-secondary px-4 py-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest border-white/40"
          >
            <ChevronLeft className="w-5 h-5" /> Logout
          </button>
          <div className="flex items-center gap-4">
            <div
              onClick={() => onSetView('insurance')}
              className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-white/30 transition-all border border-white/30"
            >
              <ShieldCheck className="w-4 h-4 text-brand-yellow" />
              CuraCare Aktiv
            </div>
            <button
              onClick={() => onSetProfileModalUserId(currentUser.id)}
              className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all overflow-hidden border-2 border-white shadow-lg"
            >
              {currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>
        <h1 className="text-4xl font-black tracking-tight">Hallo {currentUser.name}!</h1>
        <p className="text-blue-100 font-bold mt-1">Wie können wir Ihnen heute helfen?</p>
      </header>

      <main className="p-6 max-w-lg mx-auto space-y-10 -mt-6 relative z-20">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-6">
          <button
            onClick={() => onSetView('senior-payment')}
            className="glass-card p-6 shadow-xl flex flex-col items-center justify-center gap-3 hover:scale-105 transition-all group border-white/60"
          >
            <div className="w-14 h-14 bg-brand-blue/10 rounded-3xl flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all shadow-inner">
              <CreditCard className="w-7 h-7" />
            </div>
            <span className="font-black text-brand-dark uppercase tracking-widest text-[10px]">Bezahlung</span>
          </button>
          <button
            onClick={() => onSetIsCreatingJob(true)}
            className="glass-card p-6 shadow-xl flex flex-col items-center justify-center gap-3 hover:scale-105 transition-all group border-white/60"
          >
            <div className="w-14 h-14 bg-brand-yellow/10 rounded-3xl flex items-center justify-center text-brand-yellow group-hover:bg-brand-yellow group-hover:text-brand-dark transition-all shadow-inner">
              <PlusCircle className="w-7 h-7" />
            </div>
            <span className="font-black text-brand-dark uppercase tracking-widest text-[10px]">Neue Anfrage</span>
          </button>
        </div>

        {/* Create Job Panel */}
        {isCreatingJob && (
          <div className="glass-card p-10 border-white/60 shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black text-brand-dark tracking-tight">Was brauchen Sie?</h2>
              <button
                onClick={() => { onSetIsCreatingJob(false); onSetCreationMode('manual'); }}
                className="p-3 hover:bg-slate-100/50 rounded-2xl transition-all"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            {/* Mode Toggle */}
            <div className="mb-6 flex justify-center">
              <div className="bg-slate-100 p-1 rounded-full inline-flex flex-wrap justify-center gap-1">
                <button
                  onClick={() => onSetCreationMode('manual')}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${creationMode === 'manual' ? 'bg-white text-brand-dark shadow-sm' : 'text-slate-500'}`}
                >
                  Manuell
                </button>
                <button
                  onClick={() => {
                    onSetCreationMode('ai');
                    if (aiMessages.length === 0) onAiSubmit('__init__');
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-colors flex items-center gap-2 ${creationMode === 'ai' ? 'bg-brand-blue text-white shadow-sm' : 'text-slate-500'}`}
                >
                  <Bot className="w-4 h-4" /> KI Assistent
                </button>
                <label className={`px-4 py-2 rounded-full text-sm font-bold transition-colors flex items-center gap-2 cursor-pointer ${creationMode === 'image' ? 'bg-brand-yellow text-brand-dark shadow-sm' : 'text-slate-500'}`}>
                  <Camera className="w-4 h-4" /> Bild hochladen
                  <input type="file" accept="image/*" className="hidden" onChange={onImageUpload} />
                </label>
              </div>
            </div>

            {creationMode === 'ai' ? (
              <div className="space-y-6">
                <div className="bg-brand-blue/5 rounded-[2.5rem] p-6 h-[350px] overflow-y-auto flex flex-col gap-4 border border-brand-blue/10 shadow-inner">
                  {aiMessages.filter(m => m.text !== '__init__').map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-brand-blue text-white rounded-tr-sm' : 'bg-white/80 backdrop-blur-md border border-white/60 text-slate-700 rounded-tl-sm'}`}>
                        <p className="font-bold text-sm leading-relaxed">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                  {isAiLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white/80 p-4 rounded-2xl rounded-tl-sm flex items-center gap-3 text-slate-500 font-bold text-sm">
                        <Loader2 className="w-5 h-5 animate-spin text-brand-blue" /> Denkt nach...
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={onToggleRecording}
                    className={`p-5 rounded-2xl flex-shrink-0 transition-all shadow-lg ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-white/80 text-slate-600 hover:bg-white border border-white/60'}`}
                  >
                    <Mic className="w-6 h-6" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={aiInput}
                      onChange={(e) => onAiInputChange(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && onAiSubmit()}
                      placeholder={isRecording ? 'Nimmt auf...' : 'Beschreiben Sie Ihr Anliegen...'}
                      disabled={isRecording || isAiLoading}
                      className="w-full p-5 pr-14 bg-white/50 border border-white/60 rounded-2xl focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue outline-none transition-all font-bold text-brand-dark shadow-inner placeholder:text-slate-400"
                    />
                    <button
                      onClick={() => onAiSubmit()}
                      disabled={!aiInput.trim() || isRecording || isAiLoading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-brand-blue disabled:text-slate-300 hover:bg-brand-blue/10 rounded-xl transition-all"
                    >
                      <Send className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                {/* Live preview */}
                <div className="mt-8 pt-8 border-t border-white/40">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 ml-1">Aktuelle Formulardaten</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Titel', value: newJob.title || '-' },
                      { label: 'Kategorie', value: newJob.category },
                      { label: 'Wann', value: newJob.date ? formatDate(newJob.date) : '-' },
                      { label: 'Wo', value: newJob.location || '-' },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-white/60 shadow-inner">
                        <span className="text-slate-400 block text-[10px] font-black uppercase tracking-widest mb-1">{label}</span>
                        <span className="font-black text-brand-dark tracking-tight">{value}</span>
                      </div>
                    ))}
                    <div className="bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-white/60 shadow-inner col-span-2 flex justify-between items-center">
                      <div>
                        <span className="text-slate-400 block text-[10px] font-black uppercase tracking-widest mb-1">Vergütung</span>
                        <span className="font-black text-brand-dark tracking-tight">{newJob.reward ? `${newJob.reward}€` : '-'}</span>
                      </div>
                      <button
                        onClick={onCreateJob}
                        disabled={!newJob.title || !newJob.date || !newJob.location || !newJob.reward || isCheckingJob}
                        className="glass-button px-6 py-3 text-xs font-black uppercase tracking-widest disabled:opacity-50"
                      >
                        {isCheckingJob ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Anfrage posten'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : creationMode === 'image' ? (
              <div className="flex flex-col items-center justify-center p-16 bg-brand-blue/5 rounded-[2.5rem] border border-brand-blue/10 shadow-inner">
                <div className="w-20 h-20 border-4 border-brand-blue border-t-transparent rounded-full animate-spin shadow-xl mb-6" />
                <p className="text-brand-dark font-black tracking-tight text-lg">Bild wird analysiert...</p>
                <p className="text-slate-500 font-bold text-sm mt-2">Wir erstellen einen passenden Titel und Preisvorschlag.</p>
              </div>
            ) : (
              <form onSubmit={onCreateJob} className="space-y-8">
                {[
                  { label: 'Kurze Beschreibung', type: 'text', placeholder: 'z.B. Fenster putzen', value: newJob.title, onChange: (v: string) => onNewJobChange({ ...newJob, title: v }) },
                ].map(({ label, type, placeholder, value, onChange }) => (
                  <div key={label} className="space-y-3">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      className="w-full p-5 bg-white/50 border border-white/60 rounded-[1.5rem] focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue outline-none transition-all font-bold text-brand-dark shadow-inner"
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      required
                    />
                  </div>
                ))}

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Kategorie</label>
                    <select
                      className="w-full p-5 bg-white/50 border border-white/60 rounded-[1.5rem] focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue outline-none transition-all font-bold text-brand-dark shadow-inner appearance-none"
                      value={newJob.category}
                      onChange={(e) => onNewJobChange({ ...newJob, category: e.target.value as Category })}
                    >
                      {(['Haushalt', 'Garten', 'Einkauf', 'Technik', 'Sonstiges'] as Category[]).map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Wann?</label>
                    <input
                      type="datetime-local"
                      className="w-full p-5 bg-white/50 border border-white/60 rounded-[1.5rem] focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue outline-none transition-all font-bold text-brand-dark shadow-inner"
                      value={newJob.date}
                      onChange={(e) => onNewJobChange({ ...newJob, date: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Wo?</label>
                    <input
                      type="text"
                      placeholder="Ihre Adresse"
                      className="w-full p-5 bg-white/50 border border-white/60 rounded-[1.5rem] focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue outline-none transition-all font-bold text-brand-dark shadow-inner"
                      value={newJob.location}
                      onChange={(e) => onNewJobChange({ ...newJob, location: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Vergütung (€)</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="z.B. 15"
                      className="w-full p-5 bg-white/50 border border-white/60 rounded-[1.5rem] focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue outline-none transition-all font-bold text-brand-dark shadow-inner"
                      value={newJob.reward}
                      onChange={(e) => onNewJobChange({ ...newJob, reward: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Zahlungsart</label>
                  <select
                    className="w-full p-5 bg-white/50 border border-white/60 rounded-[1.5rem] focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue outline-none transition-all font-bold text-brand-dark shadow-inner appearance-none"
                    value={newJob.paymentMethod}
                    onChange={(e) => onNewJobChange({ ...newJob, paymentMethod: e.target.value })}
                  >
                    {['Kreditkarte', 'SEPA Lastschrift', 'Banküberweisung', 'Rechnung'].map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isCheckingJob}
                  className="glass-button w-full py-6 text-xl font-black tracking-tight shadow-2xl active:scale-[0.98] transition-all"
                >
                  {isCheckingJob ? <Loader2 className="w-8 h-8 animate-spin mx-auto" /> : 'Anfrage prüfen & posten'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* My Jobs */}
        {myJobs.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-brand-dark tracking-tight px-2">Meine Anfragen</h2>
            <div className="space-y-6">
              {myJobs.map((job) => (
                <div key={job.id} className="glass-card p-6 border-white/60 shadow-2xl flex flex-col gap-5">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-black text-brand-dark tracking-tight">{job.title}</h3>
                    <div className="bg-brand-blue/10 text-brand-blue px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-widest shadow-inner border border-brand-blue/20">
                      {job.reward}€ ({job.reward * 10} CC)
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-slate-500 text-xs font-black uppercase tracking-widest">
                    <div className="flex flex-col gap-2 bg-white/40 backdrop-blur-sm p-4 rounded-2xl shadow-inner border border-white/40">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-brand-blue" /> {formatDate(job.date)}
                      </div>
                      {editingJobDateId === job.id ? (
                        <div className="mt-2 space-y-2">
                          <input
                            type="datetime-local"
                            className="w-full p-2 bg-white/80 border border-brand-blue/30 rounded-xl text-[10px] outline-none focus:border-brand-blue"
                            value={newAppointmentDate}
                            onChange={(e) => onSetNewAppointmentDate(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => onSaveNewAppointment(job.id)}
                              className="flex-1 bg-brand-blue text-white py-2 rounded-lg text-[9px] hover:bg-brand-blue-hover transition-colors"
                            >
                              Speichern
                            </button>
                            <button
                              onClick={() => onSetEditingJobDateId(null)}
                              className="flex-1 bg-slate-200 text-slate-600 py-2 rounded-lg text-[9px] hover:bg-slate-300 transition-colors"
                            >
                              Abbrechen
                            </button>
                          </div>
                        </div>
                      ) : (
                        (job.status === 'offen' || job.status === 'vergeben') && (
                          <button
                            onClick={() => {
                              onSetEditingJobDateId(job.id);
                              onSetNewAppointmentDate(job.date.includes('T') ? job.date : '');
                            }}
                            className="text-brand-blue hover:underline text-[9px] text-left mt-1"
                          >
                            Termin ändern
                          </button>
                        )
                      )}
                    </div>
                    <div className="flex items-center gap-3 bg-white/40 backdrop-blur-sm p-4 rounded-2xl shadow-inner border border-white/40">
                      <MapPin className="w-5 h-5 text-brand-blue" /> {job.location}
                    </div>
                  </div>

                  <div className="mt-2 pt-6 border-t border-white/40">
                    {job.status === 'offen' && job.applicants.length === 0 && (
                      <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] text-center">Wartet auf Bewerber...</p>
                    )}

                    {job.status === 'offen' && job.applicants.length > 0 && (
                      <div className="space-y-4">
                        <p className="text-brand-dark font-black text-xs uppercase tracking-widest">Bewerber:</p>
                        {job.applicants.map((applicantId) => {
                          const applicant = users.find((u) => u.id === applicantId);
                          if (!applicant) return null;
                          return (
                            <div key={applicantId} className="flex items-center justify-between p-4 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/60 shadow-inner">
                              <div
                                className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => onSetProfileModalUserId(applicantId)}
                              >
                                <div className="w-12 h-12 bg-white/60 rounded-2xl flex items-center justify-center text-brand-blue font-black overflow-hidden shadow-inner">
                                  {applicant.avatarUrl ? (
                                    <img src={applicant.avatarUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                  ) : (
                                    applicant.name.charAt(0)
                                  )}
                                </div>
                                <div>
                                  <p className="font-black text-brand-dark text-sm tracking-tight">{applicant.name}</p>
                                  <div className="flex items-center text-brand-yellow text-xs mt-0.5">
                                    <Star className="w-3 h-3 fill-current" />
                                    <span className="ml-1 text-slate-600 font-black">{applicant.rating?.toFixed(1) || 'Neu'}</span>
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => onAcceptApplicant(job.id, applicantId)}
                                className="glass-button px-4 py-2 text-[10px] font-black uppercase tracking-widest"
                              >
                                Auswählen
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {job.status === 'vergeben' && (
                      <div className="p-5 bg-brand-blue/5 rounded-2xl border border-brand-blue/20 flex items-center justify-between shadow-inner">
                        <div
                          className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => onSetProfileModalUserId(job.assigneeId!)}
                        >
                          <div className="w-14 h-14 bg-white/60 rounded-2xl flex items-center justify-center text-brand-blue font-black text-xl overflow-hidden shadow-inner">
                            {users.find((u) => u.id === job.assigneeId)?.avatarUrl ? (
                              <img src={users.find((u) => u.id === job.assigneeId)?.avatarUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              users.find((u) => u.id === job.assigneeId)?.name.charAt(0) || 'H'
                            )}
                          </div>
                          <div>
                            <p className="font-black text-brand-dark tracking-tight">{users.find((u) => u.id === job.assigneeId)?.name || 'Helfer'}</p>
                            <p className="text-[10px] text-brand-blue font-black uppercase tracking-widest">Führt Aufgabe durch</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {job.status === 'zu_bestätigen' && (
                      <div className="p-5 bg-brand-yellow/5 rounded-2xl border border-brand-yellow/20 flex flex-col gap-4 shadow-inner">
                        <p className="text-brand-dark font-black text-xs uppercase tracking-widest text-center">Aufgabe als erledigt markiert</p>
                        <button
                          onClick={() => onSetRatingModal({ isOpen: true, jobId: job.id, targetUserId: job.assigneeId!, role: 'senior' })}
                          className="glass-button bg-brand-yellow text-brand-dark px-6 py-4 text-xs font-black uppercase tracking-widest shadow-xl"
                        >
                          Bestätigen & Bewerten
                        </button>
                      </div>
                    )}

                    {job.status === 'erledigt' && (
                      <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/20 flex items-center justify-center gap-3 text-emerald-600 font-black text-xs uppercase tracking-widest shadow-inner">
                        <CheckCircle2 className="w-5 h-5" />
                        Abgeschlossen
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
