
import React, { useState } from 'react';
import { LifeEvent } from '../types';

interface EventTrackerProps {
  events: LifeEvent[];
  onAdd: (e: Omit<LifeEvent, 'id'>) => void;
  onDelete: (id: string) => void;
  language: 'EN' | 'BN';
}

const EventTracker: React.FC<EventTrackerProps> = ({ events, onAdd, onDelete, language }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Omit<LifeEvent, 'id'>>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    category: 'Portrait',
    description: '',
    clientName: '',
    clientPhone: '',
    location: ''
  });

  const t = {
    EN: {
      title: 'Shoot Calendar', desc: 'Sync your production dates and delivery.',
      newShoot: 'Schedule Date', cancel: 'Cancel', shootName: 'Shoot Title',
      client: 'Client Name', phone: 'Client Phone', location: 'Location',
      projectType: 'Type', callTime: 'Time & Date', add: 'Launch to Calendar',
      categories: ['Wedding', 'Portrait', 'Commercial', 'Editorial', 'Meeting', 'Travel', 'Editing']
    },
    BN: {
      title: 'শ্যুট ক্যালেন্ডার', desc: 'আপনার প্রোডাকশন এবং ডেলিভারি তারিখগুলো মেলান।',
      newShoot: 'তারিখ শিডিউল', cancel: 'বাতিল', shootName: 'শ্যুট টাইটেল',
      client: 'ক্লায়েন্টের নাম', phone: 'ক্লায়েন্টের ফোন', location: 'লোকেশন',
      projectType: 'ধরন', callTime: 'সময় এবং তারিখ', add: 'ক্যালেন্ডারে যোগ করুন',
      categories: ['বিবাহ', 'প্রতিকৃতি', 'বাণিজ্যিক', 'সম্পাদকীয়', 'মিটিং', 'ভ্রমণ', 'এডিটিং']
    }
  }[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setShowForm(false);
    setFormData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      time: '12:00',
      category: 'Portrait',
      description: '',
      clientName: '',
      clientPhone: '',
      location: ''
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t.title}</h2>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">{t.desc}</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="purple-gradient text-white px-8 py-4 pill-radius font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:scale-105 active:scale-95 transition-all"
        >
          {showForm ? t.cancel : t.newShoot}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-10 pill-radius card-shadow border border-slate-100 space-y-6 animate-in zoom-in-95 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" required placeholder={t.shootName} className="md:col-span-2 w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
            
            <input type="text" placeholder={t.client} className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white" value={formData.clientName} onChange={e => setFormData({ ...formData, clientName: e.target.value })} />
            <input type="text" placeholder={t.phone} className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white" value={formData.clientPhone} onChange={e => setFormData({ ...formData, clientPhone: e.target.value })} />
            
            <input type="text" placeholder={t.location} className="md:col-span-2 w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
            
            <select className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
              {t.categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="flex gap-2">
               <input type="date" required className="flex-1 bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
               <input type="time" required className="w-32 bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="w-full purple-gradient text-white py-5 pill-radius font-black uppercase tracking-[0.2em] shadow-2xl">{t.add}</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map(event => (
          <div key={event.id} className="bg-white p-8 pill-radius card-shadow border border-slate-50 group hover:scale-[1.02] transition-all relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-indigo-50 transition-all"></div>
             
             <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="w-14 h-14 purple-gradient rounded-2xl flex items-center justify-center shadow-lg text-white">
                   <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <button onClick={() => onDelete(event.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
             </div>
             
             <div className="relative z-10">
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">{event.category} • {event.time}</p>
                <h4 className="text-xl font-black text-slate-900 leading-tight mb-3">{event.title}</h4>
                
                {(event.clientName || event.clientPhone) && (
                  <p className="text-xs font-bold text-slate-500 mb-1">
                    {event.clientName} {event.clientPhone && `(${event.clientPhone})`}
                  </p>
                )}
                
                {event.location && (
                   <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase mb-4">
                     <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                     {event.location}
                   </div>
                )}
                
                <div className="flex items-center gap-2 text-slate-400 font-bold text-[11px] uppercase tracking-widest bg-slate-100 px-3 py-2 rounded-xl w-fit border border-slate-200">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   {new Date(event.date).toLocaleDateString(language === 'BN' ? 'bn-BD' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventTracker;
