
import React, { useState } from 'react';
import { AppView } from '../types';

interface MobileNavProps {
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  language: 'EN' | 'BN';
  toggleLanguage: () => void;
  onLogout: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ activeView, setActiveView, language, toggleLanguage, onLogout }) => {
  const [showMenu, setShowMenu] = useState(false);

  const mainItems = [
    { id: 'DASHBOARD' as AppView, icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', label: { EN: 'Home', BN: 'হোম' } },
    { id: 'PROJECTS' as AppView, icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z', label: { EN: 'Projects', BN: 'প্রজেক্ট' } },
    { id: 'FINANCE' as AppView, icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', label: { EN: 'Finance', BN: 'আর্থিক' } },
    { id: 'AI_ASSISTANT' as AppView, icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0012 18.75c-1.03 0-1.9.4-2.593.91l-.548-.547z', label: { EN: 'AI', BN: 'এআই' } },
  ];

  const menuItems = [
    { id: 'EVENTS' as AppView, icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', label: { EN: 'Calendar', BN: 'ক্যালেন্ডার' } },
    { id: 'TASKS' as AppView, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2', label: { EN: 'Tasks', BN: 'টাস্ক' } },
    { id: 'INVOICES' as AppView, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', label: { EN: 'Invoices', BN: 'ইনভয়েস' } },
    { id: 'CLIENTS' as AppView, icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7', label: { EN: 'Clients', BN: 'ক্লায়েন্ট' } },
    { id: 'TEAM' as AppView, icon: 'M15 9h3.75M15 12h3.75', label: { EN: 'Team', BN: 'টিম' } },
    { id: 'REPORTS' as AppView, icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5', label: { EN: 'Reports', BN: 'রিপোর্ট' } },
    { id: 'PROFILE' as AppView, icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', label: { EN: 'Profile', BN: 'প্রোফাইল' } },
  ];

  return (
    <>
      {/* Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[60] bg-white/80 backdrop-blur-xl border-t border-slate-200 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center h-16 px-2">
          {mainItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveView(item.id); setShowMenu(false); }}
              className={`flex flex-col items-center justify-center w-16 h-full transition-all duration-300 ${
                activeView === item.id ? 'text-indigo-600 scale-110' : 'text-slate-400'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeView === item.id ? 2.5 : 2} d={item.icon} />
              </svg>
              <span className="text-[8px] font-black uppercase tracking-tighter mt-1">{item.label[language]}</span>
              {activeView === item.id && <div className="absolute bottom-1 w-1 h-1 bg-indigo-600 rounded-full"></div>}
            </button>
          ))}
          
          <button
            onClick={() => setShowMenu(true)}
            className={`flex flex-col items-center justify-center w-16 h-full transition-all ${
              showMenu || menuItems.some(i => i.id === activeView) ? 'text-indigo-600' : 'text-slate-400'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
            <span className="text-[8px] font-black uppercase tracking-tighter mt-1">{language === 'BN' ? 'আরও' : 'More'}</span>
          </button>
        </div>
      </div>

      {/* Full Screen Menu Overlay */}
      {showMenu && (
        <div className="fixed inset-0 z-[70] lg:hidden animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowMenu(false)}></div>
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] p-8 bottom-sheet-animate shadow-2xl">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8"></div>
            
            <div className="grid grid-cols-3 gap-6">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActiveView(item.id); setShowMenu(false); }}
                  className={`flex flex-col items-center gap-3 p-4 rounded-3xl transition-all ${
                    activeView === item.id ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-600'
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={item.icon} />
                  </svg>
                  <span className="text-[10px] font-black uppercase tracking-widest text-center">{item.label[language]}</span>
                </button>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-2 gap-4">
              <button 
                onClick={() => { toggleLanguage(); setShowMenu(false); }}
                className="flex items-center justify-center gap-3 py-4 bg-slate-50 text-slate-700 rounded-2xl font-black text-[10px] uppercase tracking-widest"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5a18.022 18.022 0 01-3.827-5.802M10.474 12h-8.51c.356 1.077 1.033 2.107 2.022 3a11.713 11.713 0 005.439 3m2.561-9A11.06 11.06 0 0115 10c.002.34-.038.677-.117 1M11 11a13.12 13.12 0 01-2 4l3 5" /></svg>
                {language}
              </button>
              <button 
                onClick={() => { onLogout(); setShowMenu(false); }}
                className="flex items-center justify-center gap-3 py-4 bg-pink-50 text-pink-600 rounded-2xl font-black text-[10px] uppercase tracking-widest"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" /></svg>
                {language === 'BN' ? 'লগআউট' : 'Logout'}
              </button>
            </div>
            
            <button 
              onClick={() => setShowMenu(false)}
              className="mt-6 w-full py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest"
            >
              {language === 'BN' ? 'বন্ধ করুন' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNav;
