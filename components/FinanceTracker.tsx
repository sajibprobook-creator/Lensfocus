
import React, { useState } from 'react';
import { Transaction, TransactionType, Project } from '../types';

interface FinanceTrackerProps {
  transactions: Transaction[];
  projects: Project[];
  onAdd: (t: Omit<Transaction, 'id'>) => void;
  onDelete: (id: string) => void;
  language: 'EN' | 'BN';
}

const FinanceTracker: React.FC<FinanceTrackerProps> = ({ transactions, projects, onAdd, onDelete, language }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Omit<Transaction, 'id'>>({
    amount: 0,
    type: TransactionType.EXPENSE,
    category: 'Other',
    date: new Date().toISOString().split('T')[0],
    description: '',
    currency: 'USD',
    projectId: undefined
  });

  const t = {
    EN: {
      title: 'Ledger', newRecord: 'New Entry', close: 'Close', amount: 'Amount', type: 'Type',
      category: 'Category', date: 'Date', details: 'Description', submit: 'Save',
      categories: ['Shoot', 'Videography', 'Editing', 'Gear', 'Team', 'Travel', 'Other']
    },
    BN: {
      title: 'আর্থিক লেজার', newRecord: 'এন্ট্রি', close: 'বন্ধ', amount: 'পরিমাণ', type: 'ধরণ',
      category: 'বিভাগ', date: 'তারিখ', details: 'বিবরণ', submit: 'সেভ করুন',
      categories: ['শ্যুট', 'ভিডিওগ্রাফি', 'এডিটিং', 'গিয়ার', 'টিম', 'ভ্রমণ', 'অন্যান্য']
    }
  }[language];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{t.title}</h2>
        <button onClick={() => setShowForm(!showForm)} className="purple-gradient text-white px-6 py-3 md:px-8 md:py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg active-tap">
          {showForm ? t.close : t.newRecord}
        </button>
      </div>

      {showForm && (
        <form onSubmit={(e) => { e.preventDefault(); onAdd(formData); setShowForm(false); }} className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] card-shadow border border-slate-100 space-y-6 md:space-y-8 animate-in zoom-in-95 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{t.amount}</label>
              <input type="number" required placeholder="0.00" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-400 text-base" value={formData.amount || ''} onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{t.type}</label>
              <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-400 text-base" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value as TransactionType })}>
                <option value={TransactionType.INCOME}>Income</option>
                <option value={TransactionType.EXPENSE}>Expense</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{t.category}</label>
              <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-400 text-base" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                {t.categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{t.date}</label>
              <input type="date" required className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-400 text-base" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{t.details}</label>
            <input type="text" required placeholder="Description..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-400 text-base" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
          </div>
          <button type="submit" className="w-full purple-gradient text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl active-tap">
            {t.submit}
          </button>
        </form>
      )}

      <div className="space-y-3">
        {transactions.length > 0 ? transactions.map(tr => (
          <div key={tr.id} className="bg-white p-5 md:p-6 rounded-2xl md:rounded-[2rem] border border-slate-50 card-shadow flex items-center justify-between group active-tap transition-all">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${tr.type === TransactionType.INCOME ? 'bg-lime-50 text-lime-600' : 'bg-pink-50 text-pink-600'}`}>
                {tr.type === TransactionType.INCOME ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth={2.5}/></svg> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 12H4" strokeWidth={2.5}/></svg>}
              </div>
              <div className="overflow-hidden">
                <h4 className="font-black text-slate-900 text-sm md:text-lg leading-tight truncate">{tr.description}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[8px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-tighter">{tr.category}</span>
                  <span className="text-[9px] font-bold text-slate-400">{tr.date}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <p className={`text-base md:text-2xl font-black tabular-nums ${tr.type === TransactionType.INCOME ? 'text-lime-600' : 'text-slate-900'}`}>
                ৳{tr.amount.toLocaleString()}
              </p>
              <button onClick={() => onDelete(tr.id)} className="text-slate-200 hover:text-red-500 p-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2.5}/></svg>
              </button>
            </div>
          </div>
        )) : (
          <div className="py-20 text-center text-slate-300 font-black uppercase text-xs border-2 border-dashed border-slate-100 rounded-[2rem]">No transactions recorded</div>
        )}
      </div>
    </div>
  );
};

export default FinanceTracker;
