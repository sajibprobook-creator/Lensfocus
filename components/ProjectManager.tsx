
import React, { useState } from 'react';
import { Project, ProjectStatus, ProjectType } from '../types';

interface ProjectManagerProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  language: 'EN' | 'BN';
}

const ProjectManager: React.FC<ProjectManagerProps> = ({ projects, setProjects, language }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: '', client: '', clientPhone: '', location: '', type: ProjectType.PHOTO, status: ProjectStatus.QUOTED, totalValue: 0, payments: []
  });

  const t = {
    EN: {
      title: 'Project Pipeline', desc: 'Track your upcoming shoots and payments.',
      newProject: 'New Booking', client: 'Client Name', phone: 'Client Phone', location: 'Shoot Location', value: 'Package Price',
      save: 'Launch Project'
    },
    BN: {
      title: 'প্রজেক্ট পাইপলাইন', desc: 'আপনার আসন্ন শ্যুট এবং পেমেন্ট ট্র্যাক করুন।',
      newProject: 'নতুন বুকিং', client: 'ক্লায়েন্টের নাম', phone: 'ক্লায়েন্টের ফোন', location: 'শ্যুট লোকেশন', value: 'প্যাকেজ মূল্য',
      save: 'প্রজেক্ট শুরু করুন'
    }
  }[language];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const project: Project = { ...(newProject as Project), id: crypto.randomUUID(), payments: [] };
    setProjects(prev => [project, ...prev]);
    setShowAdd(false);
    setNewProject({ title: '', client: '', clientPhone: '', location: '', type: ProjectType.PHOTO, status: ProjectStatus.QUOTED, totalValue: 0, payments: [] });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t.title}</h2>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">{t.desc}</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="purple-gradient text-white px-8 py-4 pill-radius font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:scale-105 active:scale-95 transition-all">
          {showAdd ? 'Close' : t.newProject}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleCreate} className="bg-white p-10 pill-radius card-shadow border border-slate-100 space-y-6 animate-in zoom-in-95 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" placeholder="Shoot Title" required className="md:col-span-2 w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} />
            <input type="text" placeholder={t.client} required className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white" value={newProject.client} onChange={e => setNewProject({...newProject, client: e.target.value})} />
            <input type="text" placeholder={t.phone} className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white" value={newProject.clientPhone} onChange={e => setNewProject({...newProject, clientPhone: e.target.value})} />
            <input type="text" placeholder={t.location} className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white" value={newProject.location} onChange={e => setNewProject({...newProject, location: e.target.value})} />
            <select className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white" value={newProject.type} onChange={e => setNewProject({...newProject, type: e.target.value as ProjectType})}>
              <option value={ProjectType.PHOTO}>Photography</option>
              <option value={ProjectType.VIDEO}>Video</option>
              <option value={ProjectType.BOTH}>Both</option>
            </select>
            <input type="number" placeholder={t.value} required className="md:col-span-2 w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white" value={newProject.totalValue || ''} onChange={e => setNewProject({...newProject, totalValue: Number(e.target.value)})} />
          </div>
          <button type="submit" className="w-full purple-gradient text-white py-5 pill-radius font-black uppercase tracking-[0.2em] shadow-2xl"> {t.save} </button>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {projects.map(project => {
          const paid = project.payments.reduce((sum, p) => sum + p.amount, 0);
          const progress = project.totalValue > 0 ? (paid / project.totalValue) * 100 : 0;
          return (
            <div key={project.id} className="bg-white p-10 pill-radius card-shadow border border-slate-50 group hover:-translate-y-1 transition-all">
              <div className="flex justify-between items-start mb-6">
                <div>
                   <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl inline-block mb-3">{project.type}</span>
                   <h3 className="text-2xl font-black text-slate-900 leading-tight">{project.title}</h3>
                   <div className="flex flex-col gap-1 mt-1">
                      <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">{project.client} {project.clientPhone && `• ${project.clientPhone}`}</p>
                      {project.location && (
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                          <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          {project.location}
                        </div>
                      )}
                   </div>
                </div>
                <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-xl whitespace-nowrap">{project.status}</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-8">
                  <div className="h-full purple-gradient transition-all duration-1000" style={{ width: `${progress}%` }}></div>
              </div>
              <div className="flex gap-4">
                 <button className="flex-1 py-4 bg-slate-900 text-white pill-radius text-[10px] font-black uppercase tracking-widest">Update</button>
                 <button onClick={() => setProjects(prev => prev.filter(p => p.id !== project.id))} className="w-14 h-14 bg-slate-100 text-slate-400 rounded-[1.5rem] flex items-center justify-center hover:text-red-500 transition-all">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7" /></svg>
                 </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectManager;
