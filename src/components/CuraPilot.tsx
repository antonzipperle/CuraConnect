import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Loader2 } from 'lucide-react';

const SYSTEM = `Du bist CuraPilot, der freundliche KI-Assistent für CuraConnect.
CuraConnect verbindet Senioren mit Helfern für Alltagsaufgaben (Einkaufen, Gartenarbeit, Technikhilfe).
Es gibt ein Bezahlsystem mit "CuraCoins" (CC). Antworte immer auf Deutsch. Sei höflich und kurz.`;

export function CuraPilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model' as const, text: 'Hallo! Ich bin CuraPilot, dein Assistent für CuraConnect. Wie kann ich helfen?' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isOpen]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user' as const, text }]);
    setIsLoading(true);
    const history = messages.map((m) => `${m.role === 'user' ? 'User' : 'CuraPilot'}: ${m.text}`).join('\n');
    const prompt = `${SYSTEM}\n\nVerlauf:\n${history}\n\nUser: ${text}\nCuraPilot:`;
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'model' as const, text: data.text || data.error || 'Keine Antwort.' }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'model' as const, text: 'Verbindungsfehler.' }]);
    } finally { setIsLoading(false); }
  };

  return (<>
    <button onClick={() => setIsOpen(!isOpen)} className="fixed bottom-6 right-6 w-14 h-14 bg-brand-blue text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-brand-blue-hover transition-all z-40 hover:scale-110">
      {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
    </button>
    {isOpen && (
      <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl z-40 flex flex-col overflow-hidden border border-slate-100" style={{ maxHeight: '70vh' }}>
        <div className="bg-brand-blue p-4 text-white flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"><Bot className="w-5 h-5" /></div>
          <div><p className="font-black tracking-tight">CuraPilot</p><p className="text-xs text-blue-100">KI-Assistent</p></div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 hide-scrollbar">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl text-sm font-medium leading-relaxed ${msg.role === 'user' ? 'bg-brand-blue text-white rounded-tr-sm' : 'bg-slate-100 text-slate-700 rounded-tl-sm'}`}>{msg.text}</div>
            </div>
          ))}
          {isLoading && <div className="flex justify-start"><div className="bg-slate-100 p-3 rounded-2xl rounded-tl-sm flex items-center gap-2 text-slate-500 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Denkt nach...</div></div>}
          <div ref={endRef} />
        </div>
        <div className="p-3 border-t border-slate-100 flex gap-2">
          <input type="text" className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-blue" placeholder="Nachricht eingeben..." value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} disabled={isLoading} />
          <button onClick={() => handleSend()} disabled={!input.trim() || isLoading} className="w-10 h-10 bg-brand-blue text-white rounded-xl flex items-center justify-center disabled:opacity-40 hover:bg-brand-blue-hover transition-colors flex-shrink-0"><Send className="w-4 h-4" /></button>
        </div>
      </div>
    )}
  </>);
}
