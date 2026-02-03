
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppView, Transaction, Project, Budget, SavingsGoal, LifeEvent, Task, Client, Professional, SavedInvoice, UserProfile, TransactionType } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import FinanceTracker from './components/FinanceTracker';
import AIAssistant from './components/AIAssistant';
import BudgetPlanner from './components/BudgetPlanner';
import SavingsTracker from './components/SavingsTracker';
import ProjectManager from './components/ProjectManager';
import EventTracker from './components/EventTracker';
import TaskManager from './components/TaskManager';
import ClientDatabase from './components/ClientDatabase';
import ProfessionalDatabase from './components/ProfessionalDatabase';
import InvoiceMaker from './components/InvoiceMaker';
import ReportsManager from './components/ReportsManager';
import LoginScreen from './components/LoginScreen';
import ProfileView from './components/ProfileView';
import { supabase } from './supabase';

const DEFAULT_LOGO = `data:image/svg+xml;base64,${btoa(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 180">
  <defs>
    <style>
      .text { font-family: 'Times New Roman', serif; font-weight: 900; font-size: 82px; fill: black; letter-spacing: -2px; }
      .dot { fill: #FF1A1A; }
    </style>
  </defs>
  <text x="0" y="75" class="text">Moment</text>
  <text x="0" y="155" class="text">Chronicles</text>
  <circle cx="212" cy="112" r="10" class="dot" />
</svg>
`)}`;

// Fallback for random UUID in non-secure contexts
export const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeView, setActiveView] = useState<AppView>('DASHBOARD');
  const [language, setLanguage] = useState<'EN' | 'BN'>('BN');
  const [dbError, setDbError] = useState<string | null>(null);
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [savings, setSavings] = useState<SavingsGoal[]>([]);
  const [events, setEvents] = useState<LifeEvent[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [invoices, setInvoices] = useState<SavedInvoice[]>([]);
  const [logo, setLogo] = useState<string | undefined>(DEFAULT_LOGO);

  const initTimeoutRef = useRef<any>(null);

  const fetchUserData = useCallback(async (userId: string) => {
    console.log("[System] Fetching user data for:", userId);
    try {
      setDbError(null);
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profile) {
        setUserProfile({
          ownerName: profile.owner_name || '',
          studioName: profile.studio_name || '',
          email: profile.email || '',
          phone: profile.phone || '',
          role: profile.role || 'Studio Owner'
        });
        setLogo(profile.logo_url || DEFAULT_LOGO);
      }

      const results = await Promise.allSettled([
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('transactions').select('*').order('date', { ascending: false }),
        supabase.from('tasks').select('*').order('created_at', { ascending: false }),
        supabase.from('life_events').select('*').order('date', { ascending: true }),
        supabase.from('clients').select('*').order('name', { ascending: true }),
        supabase.from('professionals').select('*').order('name', { ascending: true }),
        supabase.from('invoices').select('*').order('created_at', { ascending: false }),
        supabase.from('savings_goals').select('*').order('created_at', { ascending: false })
      ]);

      results.forEach((res, idx) => {
        if (res.status === 'fulfilled') {
          const payload = res.value as { data: any[] | null, error: any };
          const data = payload.data;
          if (!data) return;

          switch(idx) {
            case 0: setProjects(data.map((p: any) => ({ 
              id: p.id,
              title: p.title,
              client: p.client,
              clientPhone: p.client_phone,
              location: p.location,
              type: p.type,
              status: p.status,
              totalValue: p.total_value,
              payments: p.payments || [],
              date: p.date
            }))); break;
            case 1: setTransactions(data); break;
            case 2: setTasks(data); break;
            case 3: setEvents(data.map((e: any) => ({ ...e, clientName: e.client_name, clientPhone: e.client_phone }))); break;
            case 4: setClients(data); break;
            case 5: setProfessionals(data.map((p: any) => ({ ...p, dailyRate: p.daily_rate }))); break;
            case 6: setInvoices(data); break;
            case 7: setSavings(data); break;
          }
        }
      });
    } catch (e) {
      console.error("[System] Data sync error:", e);
      setDbError("Database sync failed.");
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      console.log("[System] Initializing Auth...");
      
      initTimeoutRef.current = setTimeout(() => {
        console.warn("[System] Auth taking too long, showing troubleshoot...");
        setShowTroubleshoot(true);
      }, 7000);

      try {
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        setSession(initialSession);
        if (initialSession) {
          await fetchUserData(initialSession.user.id);
        }
      } catch (err) {
        console.error("[System] Auth init failed:", err);
        setDbError("Authentication service unreachable.");
      } finally {
        setAuthLoading(false);
        setIsInitializing(false);
        if (initTimeoutRef.current) clearTimeout(initTimeoutRef.current);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("[System] Auth state changed:", event);
      setSession(newSession);
      if (newSession) {
        await fetchUserData(newSession.user.id);
      } else {
        setUserProfile(null);
        setProjects([]); setTransactions([]); setEvents([]);
      }
      setAuthLoading(false);
      setIsInitializing(false);
    });

    const savedLang = localStorage.getItem('omni_track_lang');
    if (savedLang === 'EN' || savedLang === 'BN') setLanguage(savedLang);

    return () => {
      subscription.unsubscribe();
      if (initTimeoutRef.current) clearTimeout(initTimeoutRef.current);
    };
  }, [fetchUserData]);

  const handleLogout = async () => {
    try {
      setAuthLoading(true);
      await supabase.auth.signOut();
      localStorage.removeItem('supabase.auth.token');
      setSession(null);
      setUserProfile(null);
      setActiveView('DASHBOARD');
    } catch (e) {
      console.error("[System] Logout error:", e);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  const toggleLanguage = () => {
    const next = language === 'EN' ? 'BN' : 'EN';
    setLanguage(next);
    localStorage.setItem('omni_track_lang', next);
  };

  const handleSetLogo = async (newLogo: string) => {
    setLogo(newLogo || DEFAULT_LOGO);
    if (session) {
      await supabase.from('profiles').update({ logo_url: newLogo }).eq('id', session.user.id);
    }
  };

  const handleAddTransaction = async (t: Omit<Transaction, 'id'>) => {
    if (!session) return;
    const { data, error } = await supabase.from('transactions').insert([{ 
      amount: t.amount,
      type: t.type,
      category: t.category,
      date: t.date,
      description: t.description,
      currency: t.currency,
      user_id: session.user.id,
      project_id: t.projectId 
    }]).select();
    
    if (!error && data) fetchUserData(session.user.id);
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!session) return;
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (!error) fetchUserData(session.user.id);
  };

  if (authLoading || isInitializing) {
    return (
      <div className="min-h-screen bg-[#F1F4FA] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-6 text-center max-w-xs">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-ping"></div>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">
              {language === 'BN' ? 'সিস্টেম সিঙ্ক হচ্ছে...' : 'Syncing Identity...'}
            </p>
            {showTroubleshoot && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-1000">
                <p className="text-[9px] font-bold text-slate-400 mb-4">
                  {language === 'BN' ? 'সংযোগ ধীর মনে হচ্ছে?' : 'Connection taking longer than expected?'}
                </p>
                <button 
                  onClick={handleReset}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  {language === 'BN' ? 'সেশন রিসেট করুন' : 'Reset Session'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return <LoginScreen onLogin={() => {}} language={language} />;
  }

  return (
    <div className="min-h-screen bg-[#F1F4FA] text-slate-900 pb-24 lg:pb-12 font-sans selection:bg-indigo-200 flex flex-col transition-all overflow-x-hidden">
      <Sidebar activeView={activeView} setActiveView={setActiveView} language={language} toggleLanguage={toggleLanguage} onLogout={handleLogout} />
      
      {dbError && (
        <div className="bg-amber-50 border-b border-amber-100 text-amber-700 px-6 py-2 text-[9px] font-black uppercase tracking-widest text-center animate-in slide-in-from-top duration-500">
          ⚠️ {dbError}
        </div>
      )}

      <main className="flex-1 w-full max-w-[1920px] mx-auto overflow-hidden">
        <div className="px-4 py-6 md:px-12 lg:px-24 xl:px-44">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {activeView === 'DASHBOARD' && <Dashboard projects={projects} transactions={transactions} budgets={budgets} savings={savings} tasks={tasks} events={events} setActiveView={setActiveView} language={language} userProfile={userProfile} />}
            {activeView === 'PROJECTS' && <ProjectManager projects={projects} setProjects={setProjects} language={language} />}
            {activeView === 'EVENTS' && <EventTracker events={events} onAdd={async (e) => {
              await supabase.from('life_events').insert([{ ...e, user_id: session.user.id, client_name: e.clientName, client_phone: e.clientPhone }]);
              fetchUserData(session.user.id);
            }} onDelete={async (id) => {
              await supabase.from('life_events').delete().eq('id', id);
              fetchUserData(session.user.id);
            }} language={language} />}
            {activeView === 'TASKS' && <TaskManager tasks={tasks} setTasks={setTasks} language={language} />}
            {activeView === 'CLIENTS' && <ClientDatabase clients={clients} setClients={setClients} language={language} />}
            {activeView === 'TEAM' && <ProfessionalDatabase professionals={professionals} setProfessionals={setProfessionals} language={language} />}
            {activeView === 'FINANCE' && <FinanceTracker transactions={transactions} projects={projects} onAdd={handleAddTransaction} onDelete={handleDeleteTransaction} language={language} />}
            {activeView === 'INVOICES' && <InvoiceMaker projects={projects} clients={clients} invoices={invoices} setInvoices={setInvoices} language={language} logo={logo} setLogo={handleSetLogo} />}
            {activeView === 'REPORTS' && <ReportsManager transactions={transactions} projects={projects} savings={savings} events={events} language={language} />}
            {activeView === 'AI_ASSISTANT' && <AIAssistant transactions={transactions} projects={projects} language={language} />}
            {activeView === 'PROFILE' && <ProfileView userProfile={userProfile} setUserProfile={setUserProfile} logo={logo} setLogo={handleSetLogo} language={language} onLogout={handleLogout} projectsCount={projects.length} teamCount={professionals.length} />}
          </div>

          <footer className="mt-12 md:mt-20 py-8 border-t border-slate-200/60 text-center no-print px-4">
            <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-relaxed">
              Software crafted by <span className="text-indigo-600">Sajib Roy Dip</span> & <span className="text-pink-500">Google AI Studio</span>
            </p>
            <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest mt-2">
              © {new Date().getFullYear()} {userProfile?.studioName || 'Moment Chronicles'} System
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default App;
