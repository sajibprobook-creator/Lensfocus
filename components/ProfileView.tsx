
import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';

interface ProfileViewProps {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  logo?: string;
  setLogo: (logo: string) => void;
  language: 'EN' | 'BN';
  onLogout: () => void;
  projectsCount?: number;
  teamCount?: number;
}

const ProfileView: React.FC<ProfileViewProps> = ({ userProfile, setUserProfile, logo, setLogo, language, onLogout, projectsCount = 0, teamCount = 0 }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(userProfile || {
    ownerName: '', studioName: '', email: '', phone: '', role: 'Studio Owner'
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = {
    EN: {
      title: 'Brand Identity', desc: 'Crafting the visual and operational soul of your studio.',
      edit: 'Modify Identity', save: 'Update Brand', cancel: 'Discard',
      logout: 'Terminate Session', owner: 'Owner Name', studio: 'Studio Name',
      email: 'Studio Email', phone: 'Direct Line', role: 'Official Title',
      changeLogo: 'Change Logo', studioDetails: 'Business DNA',
      personalDetails: 'Ownership Identity',
      dangerZone: 'Authorization',
      logoutDesc: 'Securely disconnect from the studio dashboard.',
      verified: 'Verified Studio Owner',
      memberSince: 'Est. 2024',
      studioCard: 'Digital Business Card',
      identityShield: 'ID Shield Active',
      pulse: 'Brand Pulse',
      pulseDesc: 'Real-time studio health indicators.',
      badges: ['Elite Creator', 'Fast Response', 'Highly Rated']
    },
    BN: {
      title: 'ব্র্যান্ড পরিচিতি', desc: 'আপনার স্টুডিওর দৃশ্যমান এবং ব্যবসায়িক সত্তা গঠন করুন।',
      edit: 'পরিবর্তন করুন', save: 'আপডেট করুন', cancel: 'বাতিল',
      logout: 'সেশন শেষ করুন', owner: 'মালিকের নাম', studio: 'স্টুডিওর নাম',
      email: 'স্টুডিও ইমেইল', phone: 'সরাসরি যোগাযোগ', role: 'পদবী',
      changeLogo: 'লোগো পরিবর্তন', studioDetails: 'ব্যবসায়িক পরিচিতি',
      personalDetails: 'মালিকানা তথ্য',
      dangerZone: 'নিরাপত্তা',
      logoutDesc: 'ড্যাশবোর্ড থেকে নিরাপদে লগআউট করুন।',
      verified: 'ভেরিফাইড স্টুডিও মালিক',
      memberSince: 'স্থাপিত ২০২৪',
      studioCard: 'ডিজিটাল বিজনেস কার্ড',
      identityShield: 'আইডি শিল্ড সক্রিয়',
      pulse: 'ব্র্যান্ড পালস',
      pulseDesc: 'স্টুডিওর বর্তমান অবস্থা নির্দেশক।',
      badges: ['এলিট ক্রিয়েটর', 'ফাস্ট রেসপন্স', 'হাইলি রেটেড']
    }
  }[language];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile(formData);
    setIsEditing(false);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-24 px-4">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 purple-gradient rounded-xl flex items-center justify-center shadow-lg text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">{t.identityShield}</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-tight">{t.title}</h2>
          <p className="text-slate-400 font-medium text-base md:text-lg max-w-2xl">{t.desc}</p>
        </div>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="w-full md:w-auto purple-gradient text-white px-10 py-5 rounded-3xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-indigo-200 hover:scale-105 active:scale-95 transition-all">
            {t.edit}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Visual Identity & Pulse */}
        <div className="lg:col-span-5 space-y-10">
          <div className="group relative">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">{t.studioCard}</p>
            {/* The Creative Studio Card with Holographic Sheen */}
            <div className="w-full h-[320px] md:h-[380px] purple-gradient rounded-[3rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl shadow-indigo-300 transition-all duration-1000 group-hover:rotate-1 group-hover:scale-[1.03]">
              {/* Holographic Overlays */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>
              
              <div className="flex flex-col h-full justify-between relative z-10">
                <div className="flex justify-between items-start">
                   <div className="w-24 h-24 md:w-28 md:h-28 bg-white rounded-[2rem] p-4 shadow-2xl flex items-center justify-center transform group-hover:-translate-y-2 transition-transform duration-700">
                     {logo ? <img src={logo} className="w-full h-full object-contain" alt="Brand" /> : <div className="text-slate-200 font-black text-xl">MC</div>}
                   </div>
                   <div className="text-right">
                      <span className="bg-white/20 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-white/20 backdrop-blur-xl shadow-lg">{t.verified}</span>
                      <div className="flex gap-1 mt-4 justify-end">
                         {[1,2,3].map(s => <div key={s} className="w-1.5 h-1.5 rounded-full bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.8)]"></div>)}
                      </div>
                   </div>
                </div>
                
                <div className="space-y-4">
                   <div>
                      <h3 className="text-3xl md:text-5xl font-black tracking-tighter leading-none mb-2">{userProfile?.studioName}</h3>
                      <p className="text-white/60 font-bold text-sm uppercase tracking-[0.2em]">{userProfile?.ownerName} <span className="mx-2 opacity-30">/</span> {userProfile?.role}</p>
                   </div>
                   <div className="flex items-center gap-8 pt-8 border-t border-white/10">
                      <div><p className="text-[9px] font-black text-white/40 uppercase mb-1">Impact</p><p className="text-2xl font-black">{projectsCount}</p></div>
                      <div className="w-px h-10 bg-white/10"></div>
                      <div><p className="text-[9px] font-black text-white/40 uppercase mb-1">Network</p><p className="text-2xl font-black">{teamCount}</p></div>
                      <div className="ml-auto opacity-20">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* New Brand Pulse Component */}
          <div className="bg-white p-10 rounded-[3rem] card-shadow border border-slate-50 space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-xl font-black text-slate-900 tracking-tight">{t.pulse}</h4>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.pulseDesc}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}/></svg>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
               {['CONSISTENCY', 'PROFESSIONAL', 'GROWTH'].map(p => (
                 <div key={p} className="flex flex-col items-center gap-3">
                    <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full purple-gradient transition-all duration-1000" style={{ width: p === 'GROWTH' ? '40%' : '85%' }}></div>
                    </div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{p}</span>
                 </div>
               ))}
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
               {t.badges.map(b => (
                 <span key={b} className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest border border-indigo-100/50">{b}</span>
               ))}
            </div>
          </div>

          {/* Secure Logout Section */}
          <div className="bg-white p-10 rounded-[3rem] card-shadow border border-pink-50">
             <h4 className="text-xs font-black text-pink-500 uppercase tracking-[0.2em] mb-2">{t.dangerZone}</h4>
             <p className="text-xs font-bold text-slate-400 mb-8 leading-relaxed pr-8">{t.logoutDesc}</p>
             <button onClick={onLogout} className="w-full pink-gradient text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-pink-100 active:scale-95 transition-all flex items-center justify-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                {t.logout}
             </button>
          </div>
        </div>

        {/* Right Column: Identity Configuration */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSave} className="bg-white p-10 md:p-14 rounded-[4rem] card-shadow border border-slate-50 space-y-12 h-full">
            
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h4 className="text-[12px] font-black text-indigo-600 uppercase tracking-[0.3em]">{t.studioDetails}</h4>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.memberSince}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{t.studio}</label>
                  <input disabled={!isEditing} type="text" className={`w-full px-6 py-5 rounded-2xl text-lg font-black outline-none transition-all ${isEditing ? 'bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:bg-white' : 'bg-transparent border border-transparent text-slate-900 px-0'}`} value={formData.studioName} onChange={e => setFormData({...formData, studioName: e.target.value})} />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{t.role}</label>
                  <input disabled={!isEditing} type="text" className={`w-full px-6 py-5 rounded-2xl text-lg font-black outline-none transition-all ${isEditing ? 'bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:bg-white' : 'bg-transparent border border-transparent text-slate-900 px-0'}`} value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h4 className="text-[12px] font-black text-indigo-600 uppercase tracking-[0.3em] border-b border-slate-100 pb-4">{t.personalDetails}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{t.owner}</label>
                  <input disabled={!isEditing} type="text" className={`w-full px-6 py-5 rounded-2xl text-lg font-black outline-none transition-all ${isEditing ? 'bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:bg-white' : 'bg-transparent border border-transparent text-slate-900 px-0'}`} value={formData.ownerName} onChange={e => setFormData({...formData, ownerName: e.target.value})} />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{t.phone}</label>
                  <input disabled={!isEditing} type="text" className={`w-full px-6 py-5 rounded-2xl text-lg font-black outline-none transition-all ${isEditing ? 'bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:bg-white' : 'bg-transparent border border-transparent text-slate-900 px-0'}`} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="sm:col-span-2 space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{t.email}</label>
                  <input disabled={!isEditing} type="email" className={`w-full px-6 py-5 rounded-2xl text-lg font-black outline-none transition-all ${isEditing ? 'bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:bg-white' : 'bg-transparent border border-transparent text-slate-900 px-0'}`} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex flex-col sm:flex-row gap-4 pt-10">
                <button type="submit" className="flex-1 purple-gradient text-white py-6 rounded-3xl font-black uppercase tracking-[0.3em] shadow-2xl shadow-indigo-200 active:scale-95 transition-all text-[11px]">{t.save}</button>
                <button type="button" onClick={() => { setIsEditing(false); setFormData(userProfile!); }} className="px-12 py-6 rounded-3xl font-black text-slate-400 uppercase tracking-widest border-2 border-slate-100 hover:bg-slate-50 transition-all text-[11px]">{t.cancel}</button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
