
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppView, Transaction, Project, Budget, SavingsGoal, LifeEvent, Task, Client, Professional, SavedInvoice, UserProfile, TransactionType, ProjectStatus, ProjectType, TaskStatus } from './types';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
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

export const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15);
};

// Global safety for process.env
if (typeof window !== 'undefined') {
  (window as any).process = (window as any).process || { env: {} };
}

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [isBooting, setIsBooting] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeView, setActiveView] = useState<AppView>('DASHBOARD');
  const [language, setLanguage] = useState<'EN' | 'BN'>('BN');
  const [dbError, setDbError] = useState<string | null>(null);
  
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

  const fetchUserData = useCallback(async (userId: string) => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();
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
        if (res.status === 'fulfilled' && res.value.data) {
          const { data } = res.value;
          switch(idx) {
            case 0: setProjects(data.map((p: any) => ({ ...p, payments: p.payments || [] }))); break;
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
    } catch (err) {
      console.warn("[System] background sync limited:", err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('timeout')), 2500)
      );

      try {
        const { data: { session: currentSession } } = await Promise.race([
          supabase.auth.getSession(),
          timeoutPromise
        ]) as any;
        
        setSession(currentSession);
        if (currentSession) {
          fetchUserData(currentSession.user.id);
        }
      } catch (err) {
        console.warn("[System] session check bypassed...");
      } finally {
        setIsBooting(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession) fetchUserData(newSession.user.id);
      setIsBooting(false);
    });

    const savedLang = localStorage.getItem('omni_track_lang');
    if (savedLang === 'EN' || savedLang === 'BN') setLanguage(savedLang);

    const tTimer = setTimeout(() => setShowTroubleshoot(true), 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(tTimer);
    };
  }, [fetchUserData]);

  const handleReset = async () => {
    try { await supabase.auth.signOut(); } catch (e) {}
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  const toggleLanguage = () => {
    const next = language === 'EN' ? 'BN' : 'EN';
    setLanguage(next);
    localStorage.setItem('omni_track_lang', next);
  };

  if (isBooting) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-6 text-center max-w-sm">
          <div className="w-12 h-12 border-4 border-indigo-600/10 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">
            {language === 'BN' ? 'সিস্টেম লোড হচ্ছে...' : 'Loading Workspace...'}
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <LoginScreen onLogin={() => {}} language={language} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100 flex flex-col transition-all overflow-x-hidden">
      <Sidebar activeView={activeView} setActiveView={setActiveView} language={language} toggleLanguage={toggleLanguage} onLogout={handleReset} />
      <MobileNav activeView={activeView} setActiveView={setActiveView} language={language} toggleLanguage={toggleLanguage} onLogout={handleReset} />
      
      <main className="flex-1 w-full max-w-[1600px] mx-auto overflow-hidden">
        <div className="px-4 py-6 md:px-8 lg:px-24 xl:px-44 pb-safe">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
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
            {activeView === 'FINANCE' && <FinanceTracker transactions={transactions} projects={projects} onAdd={async (t) => {
              const { data, error } = await supabase.from('transactions').insert([{ ...t, user_id: session.user.id, project_id: t.projectId }]).select();
              if (!error && data) fetchUserData(session.user.id);
            }} onDelete={async (id) => {
              await supabase.from('transactions').delete().eq('id', id);
              fetchUserData(session.user.id);
            }} language={language} />}
            {activeView === 'INVOICES' && <InvoiceMaker projects={projects} clients={clients} invoices={invoices} setInvoices={setInvoices} language={language} logo={logo} setLogo={setLogo} />}
            {activeView === 'REPORTS' && <ReportsManager transactions={transactions} projects={projects} savings={savings} events={events} language={language} />}
            {activeView === 'AI_ASSISTANT' && <AIAssistant transactions={transactions} projects={projects} language={language} />}
            {activeView === 'PROFILE' && <ProfileView userProfile={userProfile} setUserProfile={setUserProfile} logo={logo} setLogo={setLogo} language={language} onLogout={handleReset} projectsCount={projects.length} teamCount={professionals.length} />}
          </div>
          
          <footer className="mt-12 md:mt-20 py-8 border-t border-slate-100 text-center no-print flex flex-col items-center gap-2">
            <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-60">
              Software crafted by <span className="text-indigo-600">Sajib Roy Dip</span>
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default App;
