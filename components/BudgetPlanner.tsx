
import React, { useState } from 'react';
import { Transaction, Budget, TransactionType } from '../types';

interface BudgetPlannerProps {
  transactions: Transaction[];
  budgets: Budget[];
  setBudgets: React.Dispatch<React.SetStateAction<Budget[]>>;
  language: 'EN' | 'BN';
}

const BudgetPlanner: React.FC<BudgetPlannerProps> = ({ transactions, budgets, setBudgets, language }) => {
  const [editing, setEditing] = useState<string | null>(null);
  const [newLimit, setNewLimit] = useState<number>(0);

  const t = {
    EN: { 
      title: 'Budget Planner', desc: 'Set monthly limits for your studio expenses.', spent: 'Spent', limit: 'Limit', save: 'Save', edit: 'Edit',
      categories: [
        'Gear Rental', 'Assistant', 'Travel', 'Props', 'Marketing', 'Software', 'Studio Rent', 'Other'
      ]
    },
    BN: { 
      title: 'বাজেট প্ল্যানার', desc: 'আপনার স্টুডিও খরচের জন্য মাসিক সীমা নির্ধারণ করুন।', spent: 'ব্যয়িত', limit: 'সীমা', save: 'সেভ', edit: 'এডিট',
      categories: [
        'গিয়ার ভাড়া', 'সহকারী', 'ভ্রমণ', 'প্রপস', 'মার্কেটিং', 'সফটওয়্যার', 'স্টুডিও ভাড়া', 'অন্যান্য'
      ]
    }
  }[language];

  const getSpent = (cat: string) => {
    return transactions
      .filter(tr => tr.type === TransactionType.EXPENSE && tr.category === cat)
      .reduce((sum, tr) => sum + tr.amount, 0);
  };

  const handleUpdate = (cat: string) => {
    const existing = budgets.find(b => b.category === cat);
    if (existing) {
      setBudgets(prev => prev.map(b => b.category === cat ? { ...b, limit: newLimit } : b));
    } else {
      setBudgets(prev => [...prev, { category: cat, limit: newLimit, spent: getSpent(cat) }]);
    }
    setEditing(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="px-2">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t.title}</h2>
        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">{t.desc}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {t.categories.map(cat => {
          const budget = budgets.find(b => b.category === cat);
          const spent = getSpent(cat);
          const limit = budget?.limit || 0;
          const percent = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
          const isOver = spent > limit && limit > 0;

          return (
            <div key={cat} className="bg-white p-8 pill-radius card-shadow border border-slate-100 flex flex-col group hover:-translate-y-1 transition-all">
              <div className="flex justify-between items-center mb-8">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2" /></svg>
                    </div>
                    <div>
                       <h3 className="font-black text-slate-900 text-lg leading-tight">{cat}</h3>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monthly Expense Limit</p>
                    </div>
                 </div>
                 {editing === cat ? (
                    <div className="flex gap-2">
                       <input 
                         type="number" 
                         className="w-24 bg-slate-100 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white"
                         value={newLimit}
                         onChange={e => setNewLimit(Number(e.target.value))}
                       />
                       <button onClick={() => handleUpdate(cat)} className="purple-gradient text-white font-black text-[10px] uppercase px-4 py-2 rounded-xl shadow-md"> {t.save} </button>
                    </div>
                 ) : (
                    <button onClick={() => { setEditing(cat); setNewLimit(limit); }} className="text-slate-400 hover:text-indigo-600 font-black text-[10px] uppercase bg-slate-100 px-4 py-2 rounded-xl transition-colors"> {t.edit} </button>
                 )}
              </div>

              <div className="flex justify-between text-xs font-black mb-3 text-slate-500 uppercase tracking-widest">
                 <span>{t.spent}: <span className={isOver ? 'text-pink-600' : 'text-slate-900'}>৳{spent.toLocaleString()}</span></span>
                 <span>{t.limit}: <span className="text-slate-900">৳{limit.toLocaleString()}</span></span>
              </div>

              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                 <div className={`h-full transition-all duration-1000 ${isOver ? 'bg-pink-500' : 'purple-gradient'}`} style={{ width: `${percent}%` }}></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetPlanner;
