
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Transaction, Project } from '../types';

interface AIAssistantProps {
  transactions: Transaction[];
  projects: Project[];
  language: 'EN' | 'BN';
}

interface Message {
  role: 'user' | 'ai';
  text: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ transactions, projects, language }) => {
  const t = {
    EN: {
      title: 'Studio Advisor', desc: 'AI intelligence for Moment Chronicles.',
      greet: "Hello. I am Omni. How can I assist your business growth today?",
      placeholder: 'Type your query...',
      aiPersona: "freelance cinematography studio business expert",
    },
    BN: {
      title: 'স্টুডিও অ্যাডভাইজার', desc: 'মোমেন্ট ক্রনিকলসের জন্য এআই বুদ্ধিমত্তা।',
      greet: "হ্যালো। আমি ওমনি। আজ আপনার ব্যবসায়িক বৃদ্ধিতে কীভাবে সাহায্য করতে পারি?",
      placeholder: 'আপনার প্রশ্ন লিখুন...',
      aiPersona: "ফ্রিল্যান্স সিনেমাটোগ্রাফি স্টুডিও ব্যবসায়িক বিশেষজ্ঞ",
    }
  }[language];

  const [messages, setMessages] = useState<Message[]>([{ role: 'ai', text: t.greet }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const prompt = `Context: Projects: ${JSON.stringify(projects)}. Ledger: ${JSON.stringify(transactions)}. User: ${userMsg}. Persona: ${t.aiPersona}. Reply in ${language === 'BN' ? 'Bengali' : 'English'}. Keep it concise and professional. Use markdown for lists if needed.`;
      const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
      setMessages(prev => [...prev, { role: 'ai', text: response.text || "..." }]);
    } catch (e) { setMessages(prev => [...prev, { role: 'ai', text: "Connection error." }]); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] lg:h-[calc(100vh-260px)] animate-in fade-in duration-700">
      <div className="mb-6">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t.title}</h2>
        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">{t.desc}</p>
      </div>

      <div className="flex-1 bg-white pill-radius card-shadow border border-slate-100 flex flex-col overflow-hidden relative">
        <div ref={scrollRef} className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6 scroll-smooth">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[90%] md:max-w-[75%] px-5 py-4 rounded-[1.8rem] text-sm font-bold leading-relaxed shadow-sm ${
                m.role === 'user' 
                  ? 'purple-gradient text-white rounded-br-none' 
                  : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 px-6 py-4 rounded-[1.8rem] rounded-bl-none border border-slate-200">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 md:p-6 bg-slate-50 border-t border-slate-100">
          <div className="flex gap-3 bg-white p-2 rounded-[2.5rem] shadow-inner border border-slate-200 focus-within:border-indigo-400 transition-colors">
            <input 
              type="text" 
              className="flex-1 bg-transparent px-6 py-3 md:py-4 outline-none font-bold text-sm text-slate-800" 
              placeholder={t.placeholder} 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && handleSend()} 
            />
            <button onClick={handleSend} disabled={loading} className="w-12 h-12 md:w-14 md:h-14 purple-gradient text-white rounded-full flex items-center justify-center shadow-xl transition-transform active:scale-90 disabled:opacity-50">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
