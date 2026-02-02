
import React, { useState } from 'react';
import { SavingsGoal } from '../types';

interface SavingsTrackerProps {
  savings: SavingsGoal[];
  setSavings: React.Dispatch<React.SetStateAction<SavingsGoal[]>>;
  language: 'EN' | 'BN';
}

const SavingsTracker: React.FC<SavingsTrackerProps> = ({ savings, setSavings, language }) => {
  const [showForm, setShowForm] = useState(false);
  const [depositGoalId, setDepositGoalId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [newGoal, setNewGoal] = useState<Omit<SavingsGoal, 'id'>>({
    name: '', target: 0, current: 0, category: 'Gear'
  });

  const t = {
    EN: { 
      title: 'Savings Vault', 
      desc: 'Manually track and grow your studio reserves.', 
      add: 'Add New Goal', 
      name: 'Goal Name', 
      target: 'Target (৳)', 
      current: 'Initial Saved (৳)', 
      save: 'Create Goal',
      deposit: 'Manual Deposit',
      confirm: 'Save Deposit',
      cancel: 'Cancel',
      complete: 'Complete'
    },
    BN: { 
      title: 'সঞ্চয় ভল্ট', 
      desc: 'আপনার স্টুডিও রিজার্ভগুলো ম্যানুয়ালি ট্র্যাক করুন।', 
      add: 'নতুন লক্ষ্য যোগ', 
      name: 'লক্ষ্যের নাম', 
      target: 'টার্গেট (৳)', 
      current: 'প্রাথমিক জমানো (৳)', 
      save: 'লক্ষ্য তৈরি',
      deposit: 'ম্যানুয়াল ডিপোজিট',
      confirm: 'ডিপোজিট সেভ করুন',
      cancel: 'বাতিল',
      complete: 'সম্পন্ন'
    }
  }[language];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setSavings(prev => [...prev, { ...newGoal, id: crypto.randomUUID() }]);
    setShowForm(false);
    setNewGoal({ name: '', target: 0, current: 0, category: 'Gear' });
  };

  const handleDeposit = (id: string) => {
    if (depositAmount <= 0) return;
    setSavings(prev => prev.map(goal => 
      goal.id === id ? { ...goal, current: goal.current + depositAmount } : goal
    ));
    setDepositGoalId(null);
    setDepositAmount(0);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-2">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t.title}</h2>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">{t.desc}</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setDepositGoalId(null); }} className="purple-gradient text-white px-8 py-4 pill-radius font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">
          {showForm ? t.cancel : t.add}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white p-10 pill-radius card-shadow border border-slate-100 space-y-6 animate-in zoom-in-95 duration-300">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <input type="text" placeholder={t.name} required className="md:col-span-1 bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white" value={newGoal.name} onChange={e => setNewGoal({...newGoal, name: e.target.value})} />
              <input type="number" placeholder={t.target} required className="bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white" value={newGoal.target || ''} onChange={e => setNewGoal({...newGoal, target: Number(e.target.value)})} />
              <input type="number" placeholder={t.current} required className="bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white" value={newGoal.current || ''} onChange={e => setNewGoal({...newGoal, current: Number(e.target.value)})} />
           </div>
           <button type="submit" className="w-full purple-gradient text-white py-5 pill-radius font-black uppercase tracking-widest shadow-2xl hover:scale-[1.01] transition-all">{t.save}</button>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {savings.map(goal => {
          const percent = goal.target > 0 ? Math.min((goal.current / goal.target) * 100, 100) : 0;
          const isDepositing = depositGoalId === goal.id;

          return (
            <div key={goal.id} className="bg-white p-10 pill-radius card-shadow border border-slate-50 relative group hover:-translate-y-1 transition-all overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-lime-50 transition-all"></div>
               
               <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className="w-16 h-16 bg-lime-50 text-lime-600 rounded-[1.8rem] flex items-center justify-center shadow-inner border border-lime-100/50">
                     <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2" /></svg>
                  </div>
                  <button onClick={() => setSavings(prev => prev.filter(s => s.id !== goal.id))} className="text-slate-300 hover:text-red-500 transition-colors p-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
               </div>

               <h4 className="font-black text-slate-900 text-2xl mb-2 leading-tight relative z-10">{goal.name}</h4>
               
               <div className="flex justify-between items-baseline mb-6 relative z-10">
                  <div>
                    <p className="text-3xl font-black text-lime-600 tracking-tight">৳{goal.current.toLocaleString()}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{t.complete}: {Math.round(percent)}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{language === 'BN' ? 'টার্গেট' : 'Target'}</p>
                    <p className="font-black text-slate-900">৳{goal.target.toLocaleString()}</p>
                  </div>
               </div>

               <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner relative z-10 mb-8">
                  <div className="h-full bg-lime-500 transition-all duration-1000 ease-out" style={{ width: `${percent}%` }}></div>
               </div>

               <div className="relative z-10 pt-4 border-t border-slate-50">
                  {isDepositing ? (
                    <div className="flex gap-2 animate-in slide-in-from-bottom-2 duration-300">
                      <input 
                        type="number" 
                        autoFocus
                        placeholder="Amount..."
                        className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-lime-400 focus:bg-white"
                        value={depositAmount || ''}
                        onChange={e => setDepositAmount(parseFloat(e.target.value) || 0)}
                      />
                      <button onClick={() => handleDeposit(goal.id)} className="bg-lime-500 text-white px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-lime-100">{t.confirm}</button>
                      <button onClick={() => setDepositGoalId(null)} className="bg-slate-100 text-slate-500 px-4 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest">{t.cancel}</button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => { setDepositGoalId(goal.id); setShowForm(false); }}
                      className="w-full flex items-center justify-center gap-2 bg-slate-50 text-slate-600 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-lime-50 hover:text-lime-600 transition-all border border-transparent hover:border-lime-100"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                      {t.deposit}
                    </button>
                  )}
               </div>
            </div>
          );
        })}
        {savings.length === 0 && (
          <div className="col-span-full py-40 flex flex-col items-center justify-center bg-white/50 rounded-[3rem] border-2 border-dashed border-slate-200">
             <svg className="w-16 h-16 text-slate-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2" /></svg>
             <p className="font-black text-slate-300 uppercase tracking-widest text-sm">{language === 'BN' ? 'কোনো লক্ষ্য সেট করা নেই' : 'No savings goals set yet'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavingsTracker;
