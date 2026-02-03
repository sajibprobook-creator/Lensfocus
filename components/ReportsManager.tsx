
import React, { useState, useMemo, useRef } from 'react';
import { Transaction, Project, SavingsGoal, TransactionType, LifeEvent } from '../types';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface ReportsManagerProps {
  transactions: Transaction[];
  projects: Project[];
  savings: SavingsGoal[];
  events: LifeEvent[];
  language: 'EN' | 'BN';
}

interface ReportItem {
  id: string;
  title: string;
  type: string;
  client: string;
  totalValue?: number;
}

const ReportsManager: React.FC<ReportsManagerProps> = ({ transactions, projects, savings, events, language }) => {
  const [rangeType, setRangeType] = useState<'MONTHLY' | 'HALF_YEAR' | 'CUSTOM'>('MONTHLY');
  const [customStart, setCustomStart] = useState(new Date().toISOString().split('T')[0]);
  const [customEnd, setCustomEnd] = useState(new Date().toISOString().split('T')[0]);
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const t = {
    EN: {
      title: 'Studio Insights', desc: 'Business analytics & performance.',
      range: 'Duration', monthly: 'This Month', halfYear: '6 Months', custom: 'Custom',
      exportPDF: 'PDF', 
      exportJPEG: 'JPEG',
      from: 'From', to: 'To',
      income: 'Total Income', expense: 'Total Expense', profit: 'Net Profit', savings: 'Saved Capital',
      work: 'Total Work', summary: 'Financial Summary', projectList: 'Work List',
      noProjects: 'No data.',
      generatedOn: 'Generated'
    },
    BN: {
      title: 'স্টুডিও ইনসাইটস', desc: 'ব্যবসায়িক বিশ্লেষণ রিপোর্ট।',
      range: 'সময়সীমা', monthly: 'এই মাস', halfYear: '৬ মাস', custom: 'কাস্টম',
      exportPDF: 'পিডিএফ', 
      exportJPEG: 'ছবি',
      from: 'শুরু', to: 'শেষ',
      income: 'মোট আয়', expense: 'মোট ব্যয়', profit: 'মুনাফা', savings: 'সঞ্চয়',
      work: 'মোট কাজ', summary: 'সারসংক্ষেপ', projectList: 'কাজের তালিকা',
      noProjects: 'নেই।',
      generatedOn: 'তৈরি'
    }
  }[language];

  const reportData = useMemo(() => {
    const now = new Date();
    let startDate = new Date();
    let endDate = new Date();

    if (rangeType === 'MONTHLY') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (rangeType === 'HALF_YEAR') {
      startDate = new Date();
      startDate.setMonth(now.getMonth() - 6);
    } else {
      startDate = new Date(customStart);
      endDate = new Date(customEnd);
    }

    const startStr = startDate.toISOString().split('T')[0];
    const endStr = endDate.toISOString().split('T')[0];

    const periodTransactions = transactions.filter(tr => tr.date >= startStr && tr.date <= endStr);
    const income = periodTransactions.filter(tr => tr.type === TransactionType.INCOME).reduce((sum, tr) => sum + tr.amount, 0);
    const expense = periodTransactions.filter(tr => tr.type === TransactionType.EXPENSE).reduce((sum, tr) => sum + tr.amount, 0);
    
    const periodProjects = projects.filter(p => p.payments.some(pm => pm.date >= startStr && pm.date <= endStr));
    const periodEvents = events.filter(e => e.date >= startStr && e.date <= endStr);
    const totalSavings = savings.reduce((sum, s) => sum + s.current, 0);

    const mergedList: ReportItem[] = [
      ...periodProjects.map(p => ({ 
        id: p.id, 
        title: p.title, 
        type: 'Project', 
        client: p.client, 
        totalValue: p.totalValue 
      })),
      ...periodEvents.map(e => ({ 
        id: e.id, 
        title: e.title, 
        type: 'Event', 
        client: e.clientName || 'Guest' 
      }))
    ];

    return {
      income, expense, profit: income - expense, savings: totalSavings,
      workCount: mergedList.length,
      startStr, endStr, 
      items: mergedList
    };
  }, [transactions, projects, savings, events, rangeType, customStart, customEnd]);

  const exportReport = async (type: 'PDF' | 'JPEG') => {
    if (!reportRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2 });
      if (type === 'PDF') {
        const doc = new jsPDF('p', 'mm', 'a4');
        const pw = doc.internal.pageSize.getWidth();
        doc.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pw, (canvas.height * pw) / canvas.width);
        doc.save(`MomentChronicles-Report.pdf`);
      } else {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/jpeg', 0.9);
        link.download = `MomentChronicles-Report.jpg`;
        link.click();
      }
    } finally { setIsExporting(false); }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-700 pb-20 overflow-x-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 px-1">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{t.title}</h2>
          <p className="text-slate-400 font-bold text-[10px] md:text-sm uppercase tracking-widest">{t.desc}</p>
        </div>
        <div className="flex w-full sm:w-auto gap-3">
          <button onClick={() => exportReport('PDF')} disabled={isExporting} className="flex-1 sm:flex-none purple-gradient text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">{isExporting ? '...' : t.exportPDF}</button>
          <button onClick={() => exportReport('JPEG')} disabled={isExporting} className="flex-1 sm:flex-none bg-white border border-slate-200 text-slate-900 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">{isExporting ? '...' : t.exportJPEG}</button>
        </div>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-[2rem] md:rounded-[2.5rem] card-shadow border border-slate-100 flex flex-col gap-4">
         <div className="flex flex-wrap bg-slate-100 p-1.5 rounded-2xl gap-1">
            {(['MONTHLY', 'HALF_YEAR', 'CUSTOM'] as const).map(type => (
              <button key={type} onClick={() => setRangeType(type)} className={`flex-1 px-3 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${rangeType === type ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500'}`}>{t[type === 'MONTHLY' ? 'monthly' : type === 'HALF_YEAR' ? 'halfYear' : 'custom']}</button>
            ))}
         </div>
         {rangeType === 'CUSTOM' && (
           <div className="grid grid-cols-2 gap-3 animate-in slide-in-from-top-2">
              <input type="date" className="bg-slate-50 rounded-xl px-4 py-3 font-bold text-xs outline-none border border-slate-100" value={customStart} onChange={e => setCustomStart(e.target.value)} />
              <input type="date" className="bg-slate-50 rounded-xl px-4 py-3 font-bold text-xs outline-none border border-slate-100" value={customEnd} onChange={e => setCustomEnd(e.target.value)} />
           </div>
         )}
      </div>

      <div ref={reportRef} className="bg-white p-6 md:p-12 rounded-[2.5rem] md:rounded-[3rem] card-shadow border border-slate-50 space-y-8 md:space-y-12">
         <div className="flex justify-between items-start border-b border-slate-100 pb-8">
            <div><h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">Moment Chronicles</h1><p className="text-[9px] md:text-xs font-black text-indigo-600 uppercase tracking-[0.3em]">Performance Report</p></div>
            <div className="text-right"><p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.generatedOn}</p><p className="text-xs md:text-sm font-black text-slate-900">{new Date().toLocaleDateString(language === 'BN' ? 'bn-BD' : 'en-US')}</p></div>
         </div>

         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {[
              { label: t.income, value: reportData.income, color: 'text-indigo-600', bg: 'bg-indigo-50', isMoney: true },
              { label: t.expense, value: reportData.expense, color: 'text-pink-600', bg: 'bg-pink-50', isMoney: true },
              { label: t.profit, value: reportData.profit, color: 'text-lime-600', bg: 'bg-lime-50', isMoney: true },
              { label: t.work, value: reportData.workCount, color: 'text-amber-600', bg: 'bg-amber-50', isMoney: false }
            ].map(stat => (
              <div key={stat.label} className={`${stat.bg} p-5 md:p-8 rounded-[1.75rem] md:rounded-[2rem] border border-white/50`}>
                 <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 md:mb-2 leading-tight">{stat.label}</p>
                 <h4 className={`text-base md:text-2xl font-black ${stat.color} tracking-tight truncate`}>{stat.isMoney === false ? stat.value : `৳${stat.value.toLocaleString()}`}</h4>
              </div>
            ))}
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-4 md:space-y-6">
               <h5 className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">{t.projectList}</h5>
               <div className="space-y-3">
                  {reportData.items.slice(0, 8).map((p, i) => (
                    <div key={i} className="flex justify-between items-center bg-slate-50/50 p-4 rounded-xl md:rounded-2xl border border-slate-50"><div className="overflow-hidden"><p className="text-xs md:text-sm font-black text-slate-800 truncate">{p.title}</p><p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase">{p.client}</p></div>{p.totalValue && <span className="text-[10px] md:text-xs font-black text-indigo-600 ml-2 whitespace-nowrap">৳{p.totalValue.toLocaleString()}</span>}</div>
                  ))}
               </div>
            </div>
            <div className="space-y-4 md:space-y-6 bg-slate-900 p-6 md:p-8 rounded-[2rem] text-white">
               <h5 className="text-[10px] md:text-[11px] font-black text-white/40 uppercase tracking-widest border-b border-white/10 pb-2">{t.summary}</h5>
               <div className="space-y-4">
                  <div className="flex justify-between items-center"><p className="text-[9px] font-black text-white/40 uppercase">{t.savings}</p><p className="text-lg md:text-xl font-black text-lime-400">৳{reportData.savings.toLocaleString()}</p></div>
                  <div className="flex justify-between items-center"><p className="text-[9px] font-black text-white/40 uppercase">Ratio</p><p className="text-lg md:text-xl font-black text-white">{reportData.expense > 0 ? (reportData.income / reportData.expense).toFixed(1) : '0.0'}x</p></div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ReportsManager;
