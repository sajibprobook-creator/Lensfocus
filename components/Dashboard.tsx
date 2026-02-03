
import React, { useMemo } from 'react';
import { Transaction, Project, TransactionType, AppView, ProjectStatus, Task, TaskStatus, LifeEvent, UserProfile, Budget, SavingsGoal } from '../types';
import { AreaChart, Area, Tooltip, ResponsiveContainer, XAxis, YAxis } from 'recharts';

interface DashboardProps {
  projects: Project[];
  transactions: Transaction[];
  budgets: Budget[];
  savings: SavingsGoal[];
  tasks: Task[];
  events: LifeEvent[];
  setActiveView: (view: AppView) => void;
  language: 'EN' | 'BN';
  userProfile?: UserProfile | null;
}

const Dashboard: React.FC<DashboardProps> = ({ projects, transactions, tasks, events, setActiveView, language, userProfile }) => {
  const t = {
    EN: {
      overview: 'Performance', greeting: (name: string) => `Hello, ${name}`,
      income: 'Income', expense: 'Expense', savings: 'Savings',
      monthly: 'Current Month', activeProjects: 'Active', search: 'Search...',
      urgentTasks: 'Urgent Tasks', viewAll: 'View All', nextEvent: 'Upcoming',
      viewCalendar: 'Calendar'
    },
    BN: {
      overview: 'পারফরম্যান্স', greeting: (name: string) => `স্বাগতম, ${name}`,
      income: 'আয়', expense: 'খরচ', savings: 'সঞ্চয়',
      monthly: 'চলতি মাস', activeProjects: 'সক্রিয়', search: 'খুঁজুন...',
      urgentTasks: 'জরুরি কাজ', viewAll: 'সব দেখুন', nextEvent: 'আসন্ন',
      viewCalendar: 'ক্যালেন্ডার'
    }
  }[language];

  const stats = useMemo(() => {
    const now = new Date();
    const currentMonthStr = now.toISOString().slice(0, 7);
    const currentTrans = transactions.filter(t => t.date.startsWith(currentMonthStr));
    const income = currentTrans.filter(t => t.type === TransactionType.INCOME).reduce((sum, t) => sum + t.amount, 0);
    const expense = currentTrans.filter(t => t.type === TransactionType.EXPENSE).reduce((sum, t) => sum + t.amount, 0);
    const pendingTasks = tasks.filter(task => task.status !== TaskStatus.FINISHED);
    const urgentList = [...pendingTasks].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()).slice(0, 3);
    const today = new Date().toISOString().split('T')[0];
    const nextOne = events.filter(e => e.date >= today).sort((a, b) => a.date.localeCompare(b.date))[0];

    return { income, expense, savings: income - expense, activeCount: projects.filter(p => p.status !== ProjectStatus.PAID).length, pendingTasksCount: pendingTasks.length, urgentList, nextOne };
  }, [transactions, projects, tasks, events]);

  const dailyChartData = useMemo(() => {
    const data = [];
    const now = new Date();
    const currentMonthStr = now.toISOString().slice(0, 7);
    for (let i = 1; i <= 31; i++) {
      const dayTransactions = transactions.filter(tr => tr.date === `${currentMonthStr}-${String(i).padStart(2, '0')}`);
      data.push({ name: i, income: dayTransactions.filter(tr => tr.type === TransactionType.INCOME).reduce((sum, tr) => sum + tr.amount, 0) });
    }
    return data;
  }, [transactions]);

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-700">
      {/* Dynamic Header */}
      <div className="flex flex-col gap-1">
        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">{userProfile?.studioName || t.monthly}</p>
        <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">{t.greeting(userProfile?.ownerName || 'Guest')}</h2>
      </div>

      <div className="grid grid-cols-12 gap-5 md:gap-8">
        {/* Main Chart Section - Full width on mobile to give chart space */}
        <div className="col-span-12 lg:col-span-8 purple-gradient rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 text-white relative overflow-hidden shadow-2xl">
          <div className="flex justify-between items-start mb-10 relative z-10">
            <div>
              <h3 className="text-lg md:text-xl font-black tracking-tight mb-1">{t.overview}</h3>
              <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{t.monthly}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl md:text-4xl font-black tracking-tighter">৳{stats.income.toLocaleString()}</p>
              <p className="text-[10px] font-bold text-lime-400 uppercase tracking-widest">{t.income}</p>
            </div>
          </div>

          <div className="h-[180px] md:h-[240px] relative z-10 -mx-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyChartData}>
                <defs>
                  <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#fff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="income" stroke="#fff" strokeWidth={3} fillOpacity={1} fill="url(#colorInc)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-8 pt-8 border-t border-white/10 relative z-10">
            <div>
              <p className="text-[9px] font-black text-white/40 uppercase mb-1">{t.expense}</p>
              <h4 className="text-lg md:text-xl font-black text-pink-200">৳{stats.expense.toLocaleString()}</h4>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black text-white/40 uppercase mb-1">{t.savings}</p>
              <h4 className="text-lg md:text-xl font-black text-lime-300">৳{stats.savings.toLocaleString()}</h4>
            </div>
          </div>
        </div>

        {/* Action Blocks - Horizontal scroll on mobile? No, 2x2 grid is better */}
        <div className="col-span-12 lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-4 md:gap-8">
          <div onClick={() => setActiveView('PROJECTS')} className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 card-shadow active-tap cursor-pointer flex flex-col justify-between h-[160px] lg:h-auto">
             <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5" strokeWidth={2.5}/></svg>
             </div>
             <div>
               <h4 className="text-xl md:text-3xl font-black text-slate-900">{stats.activeCount}</h4>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t.activeProjects}</p>
             </div>
          </div>
          
          <div onClick={() => setActiveView('TASKS')} className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 card-shadow active-tap cursor-pointer flex flex-col justify-between h-[160px] lg:h-auto">
             <div className="w-10 h-10 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center mb-4">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10" strokeWidth={2.5}/></svg>
             </div>
             <div>
               <h4 className="text-xl md:text-3xl font-black text-slate-900">{stats.pendingTasksCount}</h4>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t.urgentTasks}</p>
             </div>
          </div>
        </div>

        {/* Upcoming Event - Full Row */}
        <div className="col-span-12 bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-100 card-shadow flex flex-col md:flex-row items-center justify-between gap-6 group active-tap cursor-pointer" onClick={() => setActiveView('EVENTS')}>
          <div className="flex items-center gap-5 w-full md:w-auto">
            <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shrink-0">
               <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14" strokeWidth={2.5}/></svg>
            </div>
            <div className="overflow-hidden">
              <h3 className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-1">{t.nextEvent}</h3>
              {stats.nextOne ? (
                <div className="truncate">
                  <h4 className="text-lg md:text-2xl font-black text-slate-900 leading-tight truncate">{stats.nextOne.title}</h4>
                  <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{new Date(stats.nextOne.date).toLocaleDateString()} @ {stats.nextOne.time}</p>
                </div>
              ) : (
                <h4 className="text-lg font-black text-slate-300 uppercase tracking-widest">{language === 'BN' ? 'কোনো ইভেন্ট নেই' : 'No Events'}</h4>
              )}
            </div>
          </div>
          <button className="w-full md:w-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest">
            {t.viewCalendar}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
