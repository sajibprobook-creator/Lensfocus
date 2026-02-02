
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { supabase } from '../supabase';

interface LoginScreenProps {
  onLogin: (user: UserProfile, logo?: string) => void;
  language: 'EN' | 'BN';
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, language }) => {
  const [isSetup, setIsSetup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserProfile>({
    ownerName: '',
    studioName: '',
    email: '',
    phone: '',
    password: '',
    role: 'Studio Owner'
  });
  const [logo, setLogo] = useState<string | null>(null);

  const t = {
    EN: {
      welcome: 'Moment Chronicles',
      tagline: 'Precision Studio Management',
      loginTitle: 'Studio Entry',
      setupTitle: 'New Studio Setup',
      email: 'Work Email',
      password: 'Access Key',
      owner: 'Owner Name',
      studio: 'Studio Name',
      phone: 'Phone Number',
      enter: 'Enter Studio',
      start: 'Initialize Studio',
      noAccount: "Don't have a studio set up?",
      hasAccount: "Already have a studio?",
      setupAction: "Start Setup",
      loginAction: "Login Now",
      logo: "Upload Brand Logo",
      loading: "Authenticating...",
      rateLimit: "Signup limit exceeded. Please wait 1 hour or try logging in if you already signed up.",
      genericError: "Something went wrong. Please check your credentials and try again."
    },
    BN: {
      welcome: 'মোমেন্ট ক্রনিকলস',
      tagline: 'পরিপূর্ণ স্টুডিও ম্যানেজমেন্ট',
      loginTitle: 'স্টুডিও এন্ট্রি',
      setupTitle: 'নতুন স্টুডিও সেটআপ',
      email: 'ওয়ার্ক ইমেইল',
      password: 'এক্সেস পাসওয়ার্ড',
      owner: 'মালিকের নাম',
      studio: 'স্টুডিওর নাম',
      phone: 'ফোন নম্বর',
      enter: 'প্রবেশ করুন',
      start: 'স্টুডিও শুরু করুন',
      noAccount: "এখনও স্টুডিও সেটআপ করেননি?",
      hasAccount: "ইতিমধ্যেই স্টুডিও আছে?",
      setupAction: "সেটআপ শুরু করুন",
      loginAction: "লগইন করুন",
      logo: "ব্র্যান্ড লোগো আপলোড",
      loading: "অপেক্ষা করুন...",
      rateLimit: "সাইনআপ লিমিট শেষ হয়েছে। দয়া করে ১ ঘণ্টা পর চেষ্টা করুন অথবা লগইন ট্যাব ব্যবহার করুন।",
      genericError: "কিছু সমস্যা হয়েছে। দয়া করে সঠিক তথ্য দিয়ে পুনরায় চেষ্টা করুন।"
    }
  }[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (isSetup) {
        // Sign Up Flow
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password || '',
          options: {
            data: {
              owner_name: formData.ownerName,
              studio_name: formData.studioName,
            }
          }
        });

        if (authError) {
          if (authError.message.toLowerCase().includes('rate limit')) {
            throw new Error(t.rateLimit);
          }
          throw authError;
        }

        if (authData.user) {
          // Explicitly create profile
          const { error: profileError } = await supabase.from('profiles').insert([{
            id: authData.user.id,
            owner_name: formData.ownerName,
            studio_name: formData.studioName,
            email: formData.email,
            phone: formData.phone,
            role: formData.role,
            logo_url: logo
          }]);
          
          if (profileError) {
            console.error("Profile creation error:", profileError);
            // Even if profile fails, user is signed up. App.tsx will handle the missing profile.
          }
        }
      } else {
        // Sign In Flow
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password || '',
        });
        if (loginError) throw loginError;
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setErrorMsg(err.message || t.genericError);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen purple-gradient flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full -ml-64 -mt-64 blur-[100px]"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-400/10 rounded-full -mr-64 -mb-64 blur-[100px]"></div>

      <div className="w-full max-w-lg z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center mb-10">
          <h1 className="text-white text-4xl font-black tracking-tighter mb-2">{t.welcome}</h1>
          <p className="text-white/40 font-black text-[10px] uppercase tracking-[0.4em]">{t.tagline}</p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl p-8 md:p-12 rounded-[3rem] shadow-2xl border border-white/20">
          <h2 className="text-2xl font-black text-slate-900 mb-8 text-center tracking-tight">
            {isSetup ? t.setupTitle : t.loginTitle}
          </h2>

          {errorMsg && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-5 rounded-2xl text-xs font-bold mb-6 flex items-start gap-3 animate-in slide-in-from-top-2">
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <p className="leading-relaxed">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSetup && (
              <>
                <div className="flex flex-col items-center mb-6">
                  <label className="cursor-pointer group relative">
                    <div className="w-24 h-24 bg-slate-100 rounded-[2rem] border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-indigo-400">
                      {logo ? (
                        <img src={logo} className="w-full h-full object-contain" alt="Preview" />
                      ) : (
                        <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      )}
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                    <p className="text-[8px] font-black text-slate-400 uppercase mt-2 text-center tracking-widest">{t.logo}</p>
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input required type="text" placeholder={t.owner} className="bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-400 transition-all" value={formData.ownerName} onChange={e => setFormData({...formData, ownerName: e.target.value})} />
                  <input required type="text" placeholder={t.studio} className="bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-400 transition-all" value={formData.studioName} onChange={e => setFormData({...formData, studioName: e.target.value})} />
                </div>
              </>
            )}

            <input required type="email" placeholder={t.email} className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-400 transition-all" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            
            {isSetup && (
              <input required type="text" placeholder={t.phone} className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-400 transition-all" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            )}

            <input required type="password" placeholder={t.password} className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-400 transition-all" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />

            <button type="submit" disabled={loading} className="w-full purple-gradient text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 active:scale-95 transition-all mt-4 disabled:opacity-50">
              {loading ? t.loading : (isSetup ? t.start : t.enter)}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-xs font-bold text-slate-400 mb-2">
              {isSetup ? t.hasAccount : t.noAccount}
            </p>
            <button onClick={() => { setIsSetup(!isSetup); setErrorMsg(null); }} className="text-indigo-600 font-black text-xs uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
              {isSetup ? t.loginAction : t.setupAction}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
