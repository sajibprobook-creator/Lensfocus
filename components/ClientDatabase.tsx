
import React, { useState } from 'react';
import { Client } from '../types';

interface ClientDatabaseProps {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  language: 'EN' | 'BN';
}

const ClientDatabase: React.FC<ClientDatabaseProps> = ({ clients, setClients, language }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newClient, setNewClient] = useState<Partial<Client>>({
    name: '', phone: '', email: '', social: '', address: '', category: 'LEAD'
  });

  const t = {
    EN: {
      title: 'Client Vault', desc: 'Secure repository for client contacts and leads.',
      newClient: 'Add Client', name: 'Name', phone: 'Phone Number', email: 'Email',
      social: 'Social/Portfolio Link', address: 'Home/Office Address', save: 'Save Client',
      search: 'Search clients...'
    },
    BN: {
      title: 'ক্লায়েন্ট ভল্ট', desc: 'ক্লায়েন্ট কন্টাক্ট এবং লিডগুলোর নিরাপদ সংগ্রহস্থল।',
      newClient: 'ক্লায়েন্ট যোগ করুন', name: 'নাম', phone: 'ফোন নম্বর', email: 'ইমেইল',
      social: 'সোশ্যাল/পোর্টফোলিও লিঙ্ক', address: 'বাসা/অফিসের ঠিকানা', save: 'সেভ করুন',
      search: 'ক্লায়েন্ট খুঁজুন...'
    }
  }[language];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const client: Client = { ...(newClient as Client), id: crypto.randomUUID() };
    setClients(prev => [client, ...prev]);
    setShowAdd(false);
    setNewClient({ name: '', phone: '', email: '', social: '', address: '', category: 'LEAD' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t.title}</h2>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">{t.desc}</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="purple-gradient text-white px-8 py-4 pill-radius font-black text-xs uppercase tracking-widest shadow-xl">
          {showAdd ? 'Close' : t.newClient}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="bg-white p-10 pill-radius card-shadow border border-slate-100 space-y-6 animate-in zoom-in-95 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" placeholder={t.name} required className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white" value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} />
            <input type="text" placeholder={t.phone} required className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white" value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})} />
            <input type="email" placeholder={t.email} className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white" value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} />
            <input type="text" placeholder={t.social} className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white" value={newClient.social} onChange={e => setNewClient({...newClient, social: e.target.value})} />
            <input type="text" placeholder={t.address} className="md:col-span-2 w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white" value={newClient.address} onChange={e => setNewClient({...newClient, address: e.target.value})} />
          </div>
          <button type="submit" className="w-full purple-gradient text-white py-5 pill-radius font-black uppercase tracking-widest shadow-2xl"> {t.save} </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {clients.map(client => (
          <div key={client.id} className="bg-white p-8 pill-radius card-shadow border border-slate-50 group hover:-translate-y-1 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12 group-hover:bg-indigo-50 transition-all"></div>
            
            <div className="flex justify-between items-start mb-6 relative z-10">
               <div className="w-12 h-12 purple-gradient rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
               </div>
               <button onClick={() => setClients(prev => prev.filter(c => c.id !== client.id))} className="text-slate-300 hover:text-red-500 transition-colors">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            </div>

            <div className="relative z-10">
               <h4 className="text-xl font-black text-slate-900 leading-tight mb-2">{client.name}</h4>
               <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-500 font-bold text-xs">
                     <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                     {client.phone}
                  </div>
                  {client.email && (
                    <div className="flex items-center gap-3 text-slate-500 font-bold text-xs">
                       <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                       {client.email}
                    </div>
                  )}
                  {client.social && (
                    <div className="flex items-center gap-3 text-indigo-600 font-black text-[10px] uppercase">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                       Visit Portfolio
                    </div>
                  )}
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientDatabase;
