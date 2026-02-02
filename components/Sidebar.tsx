
import React, { useState, useRef, useEffect } from 'react';
import { AppView } from '../types';

interface SidebarProps {
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  language: 'EN' | 'BN';
  toggleLanguage: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, language, toggleLanguage, onLogout }) => {
  const [showMore, setShowMore] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowMore(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const mainItems = [
    { 
      id: 'DASHBOARD' as AppView, 
      icon: 'M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z', 
      label: { EN: 'Home', BN: 'হোম' } 
    },
    { 
      id: 'PROJECTS' as AppView, 
      icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z', 
      label: { EN: 'Projects', BN: 'প্রজেক্ট' } 
    },
    { 
      id: 'FINANCE' as AppView, 
      icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', 
      label: { EN: 'Finance', BN: 'আর্থিক' } 
    },
    { 
      id: 'AI_ASSISTANT' as AppView, 
      icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0012 18.75c-1.03 0-1.9.4-2.593.91l-.548-.547z', 
      label: { EN: 'AI Assistant', BN: 'এআই' } 
    },
  ];

  const secondaryItems = [
    { 
      id: 'INVOICES' as AppView, 
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', 
      label: { EN: 'Invoices', BN: 'ইনভয়েস' } 
    },
    { 
      id: 'REPORTS' as AppView, 
      icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', 
      label: { EN: 'Reports', BN: 'রিপোর্ট' } 
    },
    { 
      id: 'CLIENTS' as AppView, 
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', 
      label: { EN: 'Clients', BN: 'ক্লায়েন্ট' } 
    },
    { 
      id: 'TEAM' as AppView, 
      icon: 'M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z', 
      label: { EN: 'Team', BN: 'টিম' } 
    },
    { 
      id: 'TASKS' as AppView, 
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', 
      label: { EN: 'Tasks', BN: 'টাস্ক' } 
    },
    { 
      id: 'EVENTS' as AppView, 
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', 
      label: { EN: 'Calendar', BN: 'ক্যালেন্ডার' } 
    },
  ];

  const handleSelect = (id: AppView) => {
    setActiveView(id);
    setShowMore(false);
  };

  return (
    <header className="hidden lg:block w-full px-4 md:px-12 xl:px-32 py-8 sticky top-0 z-50">
      <div className="purple-gradient w-full h-20 pill-radius flex items-center justify-between px-10 shadow-2xl shadow-indigo-100/50 backdrop-blur-md border border-white/10 relative">
        <div className="flex items-center gap-4 relative z-10 cursor-pointer" onClick={() => setActiveView('DASHBOARD')}>
          <div className="w-10 h-10 glass-dark rounded-xl flex items-center justify-center border border-white/20 shadow-inner">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="hidden xl:block">
             <h1 className="text-white font-black text-sm uppercase tracking-widest leading-none">Moment Chronicles</h1>
             <p className="text-white/40 text-[8px] font-bold uppercase tracking-[0.3em] mt-1">Eco-System</p>
          </div>
        </div>

        <nav className="flex items-center gap-2 bg-white/10 p-1.5 rounded-3xl border border-white/10 relative z-10">
          {mainItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl transition-all duration-300 ${
                activeView === item.id 
                  ? 'bg-white text-indigo-700 shadow-xl' 
                  : 'text-indigo-50 hover:text-white hover:bg-white/10'
              }`}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={item.icon} />
              </svg>
              <span className="hidden xl:inline text-[10px] font-black uppercase tracking-widest">
                {item.label[language]}
              </span>
            </button>
          ))}

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowMore(!showMore)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl transition-all duration-300 ${
                secondaryItems.some(i => i.id === activeView) || activeView === 'PROFILE'
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-indigo-50 hover:text-white hover:bg-white/10'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
              <span className="hidden xl:inline text-[10px] font-black uppercase tracking-widest">
                {language === 'BN' ? 'আরও' : 'More'}
              </span>
            </button>

            {showMore && (
              <div className="absolute top-full right-0 mt-3 w-56 bg-white rounded-3xl shadow-2xl border border-slate-100 p-2 overflow-hidden dropdown-animate">
                {secondaryItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-left transition-colors ${
                      activeView === item.id 
                        ? 'bg-indigo-50 text-indigo-700' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={item.icon} />
                    </svg>
                    <span className="text-[11px] font-black uppercase tracking-widest">{item.label[language]}</span>
                  </button>
                ))}
                <div className="border-t border-slate-100 my-1"></div>
                <button
                  onClick={() => handleSelect('PROFILE')}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-left transition-colors ${
                    activeView === 'PROFILE' 
                      ? 'bg-indigo-50 text-indigo-700' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-[11px] font-black uppercase tracking-widest">{language === 'BN' ? 'প্রোফাইল' : 'Profile'}</span>
                </button>
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-left text-pink-600 hover:bg-pink-50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="text-[11px] font-black uppercase tracking-widest">{language === 'BN' ? 'লগআউট' : 'Logout'}</span>
                </button>
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-6 relative z-10">
          <button 
            onClick={toggleLanguage}
            className="w-10 h-10 glass-dark rounded-xl text-[10px] font-black text-white flex items-center justify-center hover:bg-white/20 transition-all uppercase border border-white/10"
          >
            {language}
          </button>
          <button 
            className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 shadow-xl transition-all hover:scale-110 active:scale-90 ${activeView === 'PROFILE' ? 'bg-white text-indigo-700 border-white' : 'glass-dark text-white border-white/40'}`}
            onClick={() => setActiveView('PROFILE')}
            title="Profile Hub"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Sidebar;
