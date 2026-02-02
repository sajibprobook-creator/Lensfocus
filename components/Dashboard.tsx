
import React, { useMemo } from 'react';
import { Transaction, Project, TransactionType, AppView, ProjectStatus, Task, TaskStatus, LifeEvent, UserProfile } from '../types';
import { AreaChart, Area, Tooltip, ResponsiveContainer, XAxis, YAxis } from 'recharts';

interface DashboardProps {
  projects: Project[];
  transactions: Transaction[];
  budgets: any[];
  savings: any[];
  tasks: Task[];
  events: LifeEvent[];
  setActiveView: (view: AppView) => void;
  language: 'EN' | 'BN';
  userProfile?: UserProfile | null;
}

const Dashboard: React.FC<DashboardProps> = ({ projects, transactions, tasks, events, setActiveView, language, userProfile }) => {
  const t = {
    EN: {
      overview: 'Daily Performance',
      greeting: (name: string) => `Hello, ${name}`,
      income: 'Income',
      expense: 'Expense',
      savings: 'Savings',
      monthly: 'Current Month',
      activeProjects: 'Active Projects',
      search: 'Search...',
      urgentTasks: 'Urgent Tasks',
      pendingTasks: 'Pending Work',
      priorityTasks: 'High Priority',
      daysLeft: 'days',
      noTasks: 'Great! All tasks completed.',
      viewAll: 'View All',
      thanLastMonth: 'vs last month',
      efficiency: 'Efficiency',
      nextEvent: 'Next Upcoming Event',
      noEvent: 'No upcoming events',
      viewCalendar: 'Calendar'
    },
    BN: {
      overview: 'পারফরম্যান্স',
      greeting: (name: string) => `স্বাগতম, ${name}`,
      income: 'আয়',
      expense: 'খরচ',
      savings: 'সঞ্চয়',
      monthly: 'চলতি মাস',
      activeProjects: 'সক্রিয় প্রজেক্ট',
      search: 'খুঁজুন...',
      urgentTasks: 'জরুরি কাজ',
      pendingTasks: 'পেন্ডিং কাজ',
      priorityTasks: 'গুরুত্বপূর্ণ',
      daysLeft: 'দিন বাকি',
      noTasks: 'সব কাজ শেষ।',
      viewAll: 'সব দেখুন',
      thanLastMonth: 'গত মাসের তুলনায়',
      efficiency: 'দক্ষতা',
      nextEvent: 'আসন্ন ইভেন্ট',
      noEvent: 'কোনো ইভেন্ট নেই',
      viewCalendar: 'ক্যালেন্ডার'
    }
  }[language];

  const stats = useMemo(() => {
    const now = new Date();
    const currentMonthStr = now.toISOString().slice(0, 7);
    const prevMonthDate = new Date();
    prevMonthDate.setMonth(now.getMonth() - 1);
    const prevMonthStr = prevMonthDate.toISOString().slice(0, 7);

    const currentTrans = transactions.filter(t => t.date.startsWith(currentMonthStr));
    const income = currentTrans.filter(t => t.type === TransactionType.INCOME).reduce((sum, t) => sum + t.amount, 0);
    const expense = currentTrans.filter(t => t.type === TransactionType.EXPENSE).reduce((sum, t) => sum + t.amount, 0);

    const pendingTasks = tasks.filter(task => task.status !== TaskStatus.FINISHED);
    const urgentList = [...pendingTasks].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()).slice(0, 3);

    const today = new Date().toISOString().split('T')[0];
    const upcomingEvents = events
      .filter(e => e.date >= today)
      .sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.time.localeCompare(b.time);
      });
    const nextOne = upcomingEvents[0];

    return {
      income,
      expense,
      savings: income - expense,
      activeCount: projects.filter(p => p.status !== ProjectStatus.PAID).length,
      pendingTasksCount: pendingTasks.length,
      urgentList,
      currentMonthStr,
      nextOne
    };
  }, [transactions, projects, tasks, events]);

  const dailyChartData = useMemo(() => {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const data = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const dayStr = `${stats.currentMonthStr}-${String(i).padStart(2, '0')}`;
      const dayTransactions = transactions.filter(tr => tr.date === dayStr);
      data.push({
        name: i,
        income: dayTransactions.filter(tr => tr.type === TransactionType.INCOME).reduce((sum, tr) => sum + tr.amount, 0),
        expense: dayTransactions.filter(tr => tr.type === TransactionType.EXPENSE).reduce((sum, tr) => sum + tr.amount, 0)
      });
    }
    return data;
  }, [transactions, stats.currentMonthStr]);

  const getDaysLeft = (deadline: string) => Math.max(0, Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-700 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{userProfile?.studioName || t.monthly}</p>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{t.greeting(userProfile?.ownerName || 'Guest')}</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group flex-1">
            <input type="text" placeholder={t.search} className="w-full sm:w-64 bg-white rounded-2xl pl-10 pr-4 py-3 text-xs md:text-sm font-bold outline-none card-shadow border border-slate-100 focus:border-indigo-300 transition-all" />
            <svg className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 md:gap-8">
        <div className="col-span-12 xl:col-span-8 purple-gradient rounded-[2rem] md:pill-radius p-6 md:p-10 text-white relative overflow-hidden dashboard-shadow border border-white/10">
          <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          
          <div className="flex justify-between items-center mb-8 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 glass-dark rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
              <h3 className="text-lg md:text-xl font-black tracking-tight">{t.overview}</h3>
            </div>
            <div className="bg-white/10 px-3 py-1.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-white/20">
                {new Date().toLocaleString(language === 'BN' ? 'bn-BD' : 'en-US', { month: 'short' })}
            </div>
          </div>

          <div className="h-[200px] md:h-[300px] relative z-10 -mx-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#fff" stopOpacity={0.4}/><stop offset="95%" stopColor="#fff" stopOpacity={0}/></linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={9} axisLine={false} tickLine={false} interval={window.innerWidth < 640 ? 5 : 2} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(77, 61, 181, 0.95)', borderRadius: '1.25rem', border: 'none', backdropFilter: 'blur(10px)', color: '#fff' }}
                  itemStyle={{ fontSize: '11px', fontWeight: '800' }}
                />
                <Area name={t.income} type="monotone" dataKey="income" stroke="#fff" strokeWidth={3} fillOpacity={1} fill="url(#colorInc)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-4 md:gap-6 mt-8 pt-8 border-t border-white/10 relative z-10">
            <div>
              <p className="text-[8px] md:text-[9px] font-black text-white/50 uppercase mb-1">{t.income}</p>
              <h4 className="text-sm md:text-xl font-black truncate">৳{stats.income.toLocaleString()}</h4>
            </div>
            <div>
              <p className="text-[8px] md:text-[9px] font-black text-white/50 uppercase mb-1">{t.expense}</p>
              <h4 className="text-sm md:text-xl font-black text-pink-200 truncate">৳{stats.expense.toLocaleString()}</h4>
            </div>
            <div>
              <p className="text-[8px] md:text-[9px] font-black text-white/50 uppercase mb-1">{t.savings}</p>
              <h4 className="text-sm md:text-xl font-black text-lime-300 truncate">৳{stats.savings.toLocaleString()}</h4>
            </div>
          </div>
        </div>

        <div className="col-span-12 xl:col-span-4 grid grid-cols-2 xl:grid-cols-1 gap-4 md:gap-8">
           <div onClick={() => setActiveView('TASKS')} className="bg-white rounded-[2rem] md:pill-radius p-5 md:p-8 text-slate-900 card-shadow border border-slate-50 flex flex-col justify-between group cursor-pointer hover:scale-[1.02] transition-all relative overflow-hidden h-[160px] md:h-[220px]">
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-2">
                   <div className="w-10 h-10 md:w-12 md:h-12 purple-gradient text-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg"><svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} /></svg></div>
                   <span className="text-[8px] md:text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg uppercase tracking-tighter md:tracking-normal">{t.efficiency}</span>
                </div>
                <div className="space-y-2 mt-auto">
                  <div className="flex justify-between items-center"><p className="text-[9px] md:text-xs font-bold text-slate-400 uppercase">{t.pendingTasks}</p><p className="text-base md:text-xl font-black text-slate-900">{stats.pendingTasksCount}</p></div>
                  <div className="w-full h-1 md:h-1.5 bg-slate-100 rounded-full"><div className="h-full purple-gradient transition-all" style={{ width: `${tasks.length > 0 ? (1 - stats.pendingTasksCount / tasks.length) * 100 : 0}%` }}></div></div>
                </div>
              </div>
           </div>

           <div onClick={() => setActiveView('PROJECTS')} className="bg-[#B2A5FF] rounded-[2rem] md:pill-radius p-5 md:p-8 text-white dashboard-shadow flex flex-col justify-between group cursor-pointer hover:scale-[1.02] transition-all h-[160px] md:h-[220px]">
              <div className="flex justify-between items-start">
                 <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-xl md:rounded-2xl flex items-center justify-center"><svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5" strokeLinecap="round" strokeWidth={2.5}/></svg></div>
                 <h4 className="text-sm md:text-lg font-black">{t.activeProjects}</h4>
              </div>
              <div className="flex justify-between items-end mt-auto">
                 <div><p className="text-[8px] md:text-[9px] font-black text-white/60 uppercase mb-1">Pipeline</p><p className="text-2xl md:text-4xl font-black">{stats.activeCount}</p></div>
                 <div className="hidden md:flex w-10 h-10 bg-white rounded-2xl items-center justify-center text-[#B2A5FF] opacity-0 group-hover:opacity-100 transition-all"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth={3}/></svg></div>
              </div>
           </div>
        </div>

        <div className="col-span-12 pink-gradient rounded-[2.5rem] p-6 md:p-8 text-white dashboard-shadow border border-white/10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 group">
          <div className="absolute top-0 left-0 w-48 h-48 md:w-64 md:h-64 bg-white/10 rounded-full -ml-24 -mt-24 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
          
          <div className="flex items-center gap-4 md:gap-6 relative z-10 w-full md:w-auto">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-white/20 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-lg backdrop-blur-sm border border-white/30 shrink-0">
               <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <h3 className="text-[8px] md:text-[10px] font-black text-white/70 uppercase tracking-[0.2em] mb-1">{t.nextEvent}</h3>
              {stats.nextOne ? (
                <>
                  <h4 className="text-lg md:text-2xl font-black tracking-tight">{stats.nextOne.title}</h4>
                  <p className="text-[10px] md:text-xs font-bold text-white/80 uppercase tracking-widest mt-1">
                    {new Date(stats.nextOne.date).toLocaleDateString(language === 'BN' ? 'bn-BD' : 'en-US', { month: 'short', day: 'numeric' })} @ {stats.nextOne.time}
                  </p>
                </>
              ) : (
                <h4 className="text-base md:text-xl font-black text-white/60">{t.noEvent}</h4>
              )}
            </div>
          </div>

          <button 
            onClick={() => setActiveView('EVENTS')}
            className="w-full md:w-auto bg-white text-pink-600 px-8 py-4 rounded-2xl md:pill-radius font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all relative z-10 whitespace-nowrap"
          >
            {t.viewCalendar}
          </button>
        </div>

        <div className="col-span-12 bg-white rounded-[2.5rem] p-6 md:p-10 card-shadow border border-slate-100">
           <div className="flex justify-between items-center mb-6 md:mb-8">
              <div><h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{t.urgentTasks}</h3><p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Deadlines</p></div>
              <button onClick={() => setActiveView('TASKS')} className="text-[8px] md:text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-4 py-2.5 md:px-6 md:py-3 rounded-xl md:pill-radius hover:bg-indigo-600 hover:text-white transition-all">{t.viewAll}</button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {stats.urgentList.length > 0 ? stats.urgentList.map((task) => (
                <div key={task.id} className="p-5 md:p-6 bg-slate-50 rounded-[1.75rem] border border-slate-100 group hover:border-indigo-200 transition-all">
                  <div className="flex justify-between items-start mb-3">
                     <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-lg ${task.priority === 'HIGH' ? 'bg-pink-100 text-pink-600' : 'bg-indigo-100 text-indigo-600'}`}>{task.priority}</span>
                     <span className="text-[8px] font-black text-slate-400">{getDaysLeft(task.deadline)} {t.daysLeft}</span>
                  </div>
                  <h4 className="font-black text-slate-800 text-sm md:text-base leading-tight truncate">{task.title}</h4>
                </div>
              )) : <div className="col-span-full py-6 text-center text-slate-300 font-black uppercase text-xs">{t.noTasks}</div>}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
