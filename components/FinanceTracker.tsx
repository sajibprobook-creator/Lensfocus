
import React, { useState } from 'react';
import { Transaction, TransactionType, Project } from '../types';
import { GoogleGenAI } from '@google/genai';

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
      title: 'Financial Ledger', desc: 'Detailed tracking of your studio cashflow.',
      newRecord: 'New Entry', close: 'Close', amount: 'Amount', type: 'Type',
      category: 'Category', date: 'Date', details: 'Description', submit: 'Save Transaction',
      categories: [
        'Event Photography', 'Videography', 'Editing', 
        'Gear Rental', 'Assistant', 'Travel', 'Props', 
        'Marketing', 'Software', 'Studio Rent', 'Other'
      ]
    },
    BN: {
      title: 'আর্থিক লেজার', desc: 'আপনার স্টুডিও ক্যাশফ্লোর বিস্তারিত ট্র্যাকিং।',
      newRecord: 'নতুন এন্ট্রি', close: 'বন্ধ করুন', amount: 'পরিমাণ', type: 'ধরণ',
      category: 'বিভাগ', date: 'তারিখ', details: 'বিবরণ', submit: 'লেনদেন সেভ করুন',
      categories: [
        'ইভেন্ট ফটোগ্রাফি', 'ভিডিওগ্রাফি', 'এডিটিং', 
        'গিয়ার ভাড়া', 'সহকারী', 'ভ্রমণ', 'প্রপস', 
        'মার্কেটিং', 'সফটওয়্যার', 'স্টুডিও ভাড়া', 'অন্যান্য'
      ]
    }
  }[language];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t.title}</h2>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">{t.desc}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="purple-gradient text-white px-8 py-4 pill-radius font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:scale-105 active:scale-95 transition-all">
          {showForm ? t.close : t.newRecord}
        </button>
      </div>

      {showForm && (
        <form onSubmit={(e) => { e.preventDefault(); onAdd(formData); setShowForm(false); }} className="bg-white p-10 pill-radius card-shadow border border-slate-100 space-y-8 animate-in zoom-in-95 duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{t.amount}</label>
              <input type="number" required className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white" value={formData.amount || ''} onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{t.type}</label>
              <select className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white" value={formData.type} onChange={e => {
                const type = e.target.value as TransactionType;
                setFormData({ ...formData, type, category: type === TransactionType.INCOME ? t.categories[0] : t.categories[3] });
              }}>
                <option value={TransactionType.INCOME}>Income</option>
                <option value={TransactionType.EXPENSE}>Expense</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{t.category}</label>
              <select className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                {t.categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{t.date}</label>
              <input type="date" required className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{t.details}</label>
            <input type="text" required placeholder="Description..." className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
          </div>
          <button type="submit" className="w-full purple-gradient text-white py-5 pill-radius font-black uppercase tracking-[0.2em] shadow-2xl">
            {t.submit}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {transactions.map(tr => (
          <div key={tr.id} className="bg-white p-6 md:px-10 pill-radius card-shadow border border-slate-50 flex items-center justify-between group hover:scale-[1.01] transition-all">
            <div className="flex items-center gap-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${tr.type === TransactionType.INCOME ? 'bg-lime-100 text-lime-600' : 'bg-pink-100 text-pink-600'}`}>
                {tr.type === TransactionType.INCOME ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg> : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" /></svg>}
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-lg leading-tight">{tr.description}</h4>
                <div className="flex items-center gap-3 mt-1 text-[10px] font-black text-slate-400 uppercase">
                  <span className="bg-slate-100 px-2 py-1 rounded-lg">{tr.category}</span>
                  <span>{tr.date}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className={`text-2xl font-black tabular-nums ${tr.type === TransactionType.INCOME ? 'text-lime-600' : 'text-slate-900'}`}>
                {tr.type === TransactionType.INCOME ? '+' : '-'}৳{tr.amount.toLocaleString()}
              </p>
              <button onClick={() => onDelete(tr.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinanceTracker;
