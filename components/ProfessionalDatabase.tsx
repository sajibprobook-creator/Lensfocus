
import React, { useState } from 'react';
import { Professional } from '../types';

interface ProfessionalDatabaseProps {
  professionals: Professional[];
  setProfessionals: React.Dispatch<React.SetStateAction<Professional[]>>;
  language: 'EN' | 'BN';
}

const ProfessionalDatabase: React.FC<ProfessionalDatabaseProps> = ({ professionals, setProfessionals, language }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newPro, setNewPro] = useState<Partial<Professional>>({
    name: '', role: 'Photographer', phone: '', dailyRate: 0, portfolio: '', location: ''
  });

  const t = {
    EN: {
      title: 'Team Roster', desc: 'Directory of trusted professional partners and crew.',
      newPro: 'Add Team Member', name: 'Name', phone: 'Phone Number', role: 'Main Role',
      rate: 'Daily Rate (৳)', portfolio: 'Portfolio/IG Link', location: 'Work Location', save: 'Add Member'
    },
    BN: {
      title: 'টিম রোস্টার', desc: 'নির্ভরযোগ্য পেশাদার পার্টনার এবং ক্রু মেম্বারদের ডিরেক্টরি।',
      newPro: 'সদস্য যোগ করুন', name: 'নাম', phone: 'ফোন নম্বর', role: 'প্রধান ভূমিকা',
      rate: 'প্রতিদিনের রেট (৳)', portfolio: 'পোর্টফোলিও/ইনস্টাগ্রাম লিঙ্ক', location: 'কাজের এলাকা', save: 'সদস্য এড করুন'
    }
  }[language];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const pro: Professional = { ...(newPro as Professional), id: crypto.randomUUID() };
    setProfessionals(prev => [pro, ...prev]);
    setShowAdd(false);
    setNewPro({ name: '', role: 'Photographer', phone: '', dailyRate: 0, portfolio: '', location: '' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t.title}</h2>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">{t.desc}</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="purple-gradient text-white px-8 py-4 pill-radius font-black text-xs uppercase tracking-widest shadow-xl">
          {showAdd ? 'Close' : t.newPro}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="bg-white p-10 pill-radius card-shadow border border-slate-100 space-y-6 animate-in zoom-in-95 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" placeholder={t.name} required className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white" value={newPro.name} onChange={e => setNewPro({...newPro, name: e.target.value})} />
            <input type="text" placeholder={t.phone} required className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white" value={newPro.phone} onChange={e => setNewPro({...newPro, phone: e.target.value})} />
            <select className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white" value={newPro.role} onChange={e => setNewPro({...newPro, role: e.target.value as any})}>
              <option value="Photographer">Photographer</option>
              <option value="Cinematographer">Cinematographer</option>
              <option value="Editor">Editor</option>
              <option value="Assistant">Assistant</option>
            </select>
            <input type="number" placeholder={t.rate} required className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white" value={newPro.dailyRate || ''} onChange={e => setNewPro({...newPro, dailyRate: Number(e.target.value)})} />
            <input type="text" placeholder={t.location} className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white" value={newPro.location} onChange={e => setNewPro({...newPro, location: e.target.value})} />
            <input type="text" placeholder={t.portfolio} className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white" value={newPro.portfolio} onChange={e => setNewPro({...newPro, portfolio: e.target.value})} />
          </div>
          <button type="submit" className="w-full purple-gradient text-white py-5 pill-radius font-black uppercase tracking-widest shadow-2xl"> {t.save} </button>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {professionals.map(pro => (
          <div key={pro.id} className="bg-white p-8 pill-radius card-shadow border border-slate-50 flex items-center justify-between group hover:scale-[1.01] transition-all">
            <div className="flex items-center gap-6 overflow-hidden">
              <div className="w-16 h-16 purple-gradient rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" /></svg>
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                   <h4 className="font-black text-slate-900 text-xl leading-tight truncate">{pro.name}</h4>
                   <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase shrink-0">{pro.role}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span>{pro.phone}</span>
                    <span className="text-lime-600">৳{pro.dailyRate.toLocaleString()} / Day</span>
                  </div>
                  {pro.location && (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                       <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                       <span className="truncate">{pro.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <button onClick={() => setProfessionals(prev => prev.filter(p => p.id !== pro.id))} className="text-slate-200 hover:text-red-500 transition-colors ml-4 shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7" /></svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfessionalDatabase;
