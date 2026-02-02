
import React, { useState } from 'react';
import { Task, TaskStatus } from '../types';

interface TaskManagerProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  language: 'EN' | 'BN';
}

const TaskManager: React.FC<TaskManagerProps> = ({ tasks, setTasks, language }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState<TaskStatus | 'ALL'>('ALL');
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '', deadline: '', status: TaskStatus.PENDING, priority: 'MEDIUM'
  });

  const t = {
    EN: {
      title: 'Task Hub', desc: 'Manage your post-production workflow.',
      newTask: 'Add Task', all: 'All Tasks', pending: 'Pending', 
      progress: 'In Progress', finished: 'Finished', deadline: 'Deadline',
      save: 'Create Task', daysLeft: 'days left', overdue: 'Overdue'
    },
    BN: {
      title: 'টাস্ক হাব', desc: 'আপনার পোস্ট-প্রডাকশন ওয়ার্কফ্লো ম্যানেজ করুন।',
      newTask: 'কাজ যোগ করুন', all: 'সব কাজ', pending: 'পেন্ডিং', 
      progress: 'চলমান', finished: 'সম্পন্ন', deadline: 'ডেডলাইন',
      save: 'টাস্ক তৈরি করুন', daysLeft: 'দিন বাকি', overdue: 'সময় শেষ'
    }
  }[language];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const task: Task = { 
      ...(newTask as Task), 
      id: crypto.randomUUID(), 
      status: TaskStatus.PENDING 
    };
    setTasks(prev => [task, ...prev]);
    setShowAdd(false);
    setNewTask({ title: '', deadline: '', priority: 'MEDIUM' });
  };

  const updateStatus = (id: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const filteredTasks = tasks.filter(t => filter === 'ALL' || t.status === filter);

  const getDaysLeft = (deadline: string) => {
    const diff = new Date(deadline).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-2">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t.title}</h2>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">{t.desc}</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="purple-gradient text-white px-8 py-4 pill-radius font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:scale-105 active:scale-95 transition-all">
          {showAdd ? 'Close' : t.newTask}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleCreate} className="bg-white p-10 pill-radius card-shadow border border-slate-100 space-y-6 animate-in zoom-in-95 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input 
              type="text" 
              placeholder="Task Title (e.g. Edit Wedding Highlights)" 
              required 
              className="md:col-span-2 w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white" 
              value={newTask.title} 
              onChange={e => setNewTask({...newTask, title: e.target.value})} 
            />
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{t.deadline}</label>
              <input 
                type="date" 
                required 
                className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white" 
                value={newTask.deadline} 
                onChange={e => setNewTask({...newTask, deadline: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Priority</label>
              <select 
                className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white" 
                value={newTask.priority} 
                onChange={e => setNewTask({...newTask, priority: e.target.value as any})}
              >
                <option value="HIGH">High Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="LOW">Low Priority</option>
              </select>
            </div>
          </div>
          <button type="submit" className="w-full purple-gradient text-white py-5 pill-radius font-black uppercase tracking-[0.2em] shadow-2xl"> {t.save} </button>
        </form>
      )}

      {/* Tabs Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-2">
        {[
          { id: 'ALL', label: t.all },
          { id: TaskStatus.PENDING, label: t.pending },
          { id: TaskStatus.PROGRESS, label: t.progress },
          { id: TaskStatus.FINISHED, label: t.finished }
        ].map(btn => (
          <button
            key={btn.id}
            onClick={() => setFilter(btn.id as any)}
            className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest whitespace-nowrap transition-all ${
              filter === btn.id ? 'purple-gradient text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredTasks.map(task => {
          const daysLeft = getDaysLeft(task.deadline);
          const isFinished = task.status === TaskStatus.FINISHED;
          
          return (
            <div key={task.id} className={`bg-white p-8 pill-radius card-shadow border border-slate-50 relative group transition-all ${isFinished ? 'opacity-60' : ''}`}>
              <div className="flex justify-between items-start mb-6">
                <div>
                   <div className="flex items-center gap-3 mb-2">
                      <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-lg ${
                        task.priority === 'HIGH' ? 'bg-red-50 text-red-600' : 
                        task.priority === 'MEDIUM' ? 'bg-orange-50 text-orange-600' : 
                        'bg-blue-50 text-blue-600'
                      }`}>
                        {task.priority}
                      </span>
                      <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-lg ${
                        task.status === TaskStatus.FINISHED ? 'bg-lime-50 text-lime-600' : 
                        task.status === TaskStatus.PROGRESS ? 'bg-indigo-50 text-indigo-600' : 
                        'bg-slate-50 text-slate-600'
                      }`}>
                        {task.status}
                      </span>
                   </div>
                   <h3 className={`text-xl font-black text-slate-900 leading-tight ${isFinished ? 'line-through' : ''}`}>{task.title}</h3>
                </div>
                
                <button 
                  onClick={() => setTasks(prev => prev.filter(p => p.id !== task.id))}
                  className="text-slate-300 hover:text-red-500 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-8">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14" /></svg>
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{t.deadline}</p>
                      <p className={`text-xs font-bold ${daysLeft < 3 && !isFinished ? 'text-red-500' : 'text-slate-600'}`}>
                        {new Date(task.deadline).toLocaleDateString()} 
                        {!isFinished && (
                          <span className="ml-2">({daysLeft > 0 ? `${daysLeft} ${t.daysLeft}` : t.overdue})</span>
                        )}
                      </p>
                   </div>
                </div>

                <div className="flex gap-2">
                   {!isFinished && task.status === TaskStatus.PENDING && (
                     <button 
                        onClick={() => updateStatus(task.id, TaskStatus.PROGRESS)}
                        className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-indigo-600 hover:text-white transition-all"
                     >
                       Start
                     </button>
                   )}
                   {task.status !== TaskStatus.FINISHED && (
                     <button 
                        onClick={() => updateStatus(task.id, TaskStatus.FINISHED)}
                        className="bg-lime-50 text-lime-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-lime-600 hover:text-white transition-all"
                     >
                       Done
                     </button>
                   )}
                   {isFinished && (
                     <button 
                        onClick={() => updateStatus(task.id, TaskStatus.PENDING)}
                        className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase"
                     >
                       Undo
                     </button>
                   )}
                </div>
              </div>
            </div>
          );
        })}
        {filteredTasks.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white/50 pill-radius border-2 border-dashed border-slate-200">
            <p className="font-black text-slate-300 uppercase tracking-widest">No tasks found in this section</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManager;
