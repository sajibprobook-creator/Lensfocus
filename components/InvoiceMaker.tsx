
import React, { useState, useEffect, useRef } from 'react';
import { Project, Client, SavedInvoice, InvoiceItem } from '../types';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface InvoiceMakerProps {
  projects: Project[];
  clients: Client[];
  invoices: SavedInvoice[];
  setInvoices: React.Dispatch<React.SetStateAction<SavedInvoice[]>>;
  language: 'EN' | 'BN';
  logo?: string;
  setLogo: (logo: string) => void;
}

const InvoiceMaker: React.FC<InvoiceMakerProps> = ({ projects, clients, invoices, setInvoices, language, logo, setLogo }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [isManual, setIsManual] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [recipient, setRecipient] = useState({ name: '', email: '', phone: '', address: '' });
  const [companyInfo, setCompanyInfo] = useState({ name: '', address: '', email: '', phone: '' });
  const [invoiceMeta, setInvoiceMeta] = useState({ 
    number: '', 
    date: new Date().toISOString().split('T')[0],
    time: '12:00' 
  });
  const [manualPaid, setManualPaid] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const t = {
    EN: {
      title: 'Invoice Studio', desc: 'Professional billing & delivery.',
      selectProject: 'Select Project', 
      manualInvoice: 'New Invoice',
      invoiceNo: 'Invoice No', date: 'Date', time: 'Time',
      from: 'From', to: 'Billed To', description: 'Description', amount: 'Amount',
      total: 'Total Amount', paid: 'Amount Paid', balance: 'Balance Due',
      print: 'Print / PDF', saveImage: 'JPEG', whatsapp: 'WhatsApp PDF', whatsappText: 'WA Text', email: 'Email',
      defaultCompany: 'Moment Chronicles', defaultAddress: 'Kamarpara, Uttara, Dhaka',
      addItem: '+ Add Item', remove: 'Delete',
      whatsappMsg: (name: string, no: string, balance: number) => `Hi ${name}, invoice ${no}. Balance: ৳${balance.toLocaleString()}. Thanks!`,
      emailSubject: (title: string) => `Invoice: ${title}`,
      scheduleLabel: 'Duration',
      changeLogo: 'Update Logo',
      removeLogo: 'Remove',
      saveRecord: 'Save Record',
      history: 'Records',
      noHistory: 'No invoices.',
      saved: 'Saved!',
      backToEditor: 'Edit',
      processing: 'Wait...',
      desktopAlert: "Downloaded! Attach manually in WA.",
      download: 'Download PDF',
      durations: ['1 Hour', '2 Hours', '3 Hours', '4 Hours', '5 Hours', '6 Hours', '8 Hours', '1 Day', '2 Days', '3 Days', 'Project Based'],
      selectDuration: 'Duration',
      servicePlaceholder: 'Service',
      services: ['Photography', 'Cinematography', 'Drone', 'Editing', 'Custom'],
      termsTitle: 'TERMS',
      terms: ['Advance non-refundable.', 'Pay full after shoot.', 'Files shared after full payment.', '7-day delivery for edits.', 'RAW only after final payment.']
    },
    BN: {
      title: 'ইনভয়েস স্টুডিও', desc: 'পেশাদার বিলিং সিস্টেম।',
      selectProject: 'প্রজেক্ট নির্বাচন', 
      manualInvoice: 'নতুন ইনভয়েস',
      invoiceNo: 'ইনভয়েস নং', date: 'তারিখ', time: 'সময়',
      from: 'প্রেরক', to: 'প্রাপক', description: 'বিবরণ', amount: 'টাকা',
      total: 'মোট টাকা', paid: 'পরিশোধিত', balance: 'বকেয়া',
      print: 'পিডিএফ', saveImage: 'জেপিইজি', whatsapp: 'হোয়াটসঅ্যাপ', whatsappText: 'টেক্সট', email: 'ইমেইল',
      defaultCompany: 'মোমেন্ট ক্রনিকলস', defaultAddress: 'কামারপাড়া, উত্তরা, ঢাকা',
      addItem: '+ আইটেম যোগ', remove: 'মুছুন',
      whatsappMsg: (name: string, no: string, balance: number) => `প্রিয় ${name}, ইনভয়েস ${no}। বকেয়া: ৳${balance.toLocaleString()}। ধন্যবাদ।`,
      emailSubject: (title: string) => `ইনভয়েস: ${title}`,
      scheduleLabel: 'সময়',
      changeLogo: 'লোগো আপডেট',
      removeLogo: 'মুছুন',
      saveRecord: 'সেভ করুন',
      history: 'রেকর্ডস',
      noHistory: 'নেই।',
      saved: 'সেভ হয়েছে!',
      backToEditor: 'এডিট',
      processing: 'চলছে...',
      desktopAlert: "ডাউনলোড হয়েছে! হোয়াটসঅ্যাপে এটাচ করে দিন।",
      download: 'ডাউনলোড',
      durations: ['১ ঘণ্টা', '২ ঘণ্টা', '৩ ঘণ্টা', '৪ ঘণ্টা', '৫ ঘণ্টা', '৬ ঘণ্টা', '৮ ঘণ্টা', '১ দিন', '২ দিন', '৩ দিন', 'প্রজেক্ট ভিত্তিক'],
      selectDuration: 'সময়',
      servicePlaceholder: 'সার্ভিস',
      services: ['ফটোগ্রাফি', 'সিনেমাটোগ্রাফি', 'ড্রোন', 'এডিটিং', 'কাস্টম'],
      termsTitle: 'শর্তাবলী',
      terms: ['অগ্রিম অফেরতযোগ্য।', 'শ্যুটের পর পূর্ণ পেমেন্ট।', 'পেমেন্ট ছাড়া ফাইল দেয়া হবে না।', '৭ দিনে ডেলিভারি।', 'ভিডিও ১৫-৩০ দিন।']
    }
  }[language];

  useEffect(() => {
    setCompanyInfo({
      name: t.defaultCompany,
      address: t.defaultAddress,
      email: 'momentchronicles@gmail.com',
      phone: '01768831886'
    });
  }, [language]);

  useEffect(() => {
    if (isManual || showHistory) return; 
    const project = projects.find(p => p.id === selectedProjectId);
    if (project) {
      const client = clients.find(c => c.name === project.client);
      setInvoiceItems([{ id: '1', description: t.services[0], amount: project.totalValue, schedule: '' }]);
      setRecipient({
        name: client?.name || project.client,
        email: client?.email || '',
        phone: client?.phone || '',
        address: client?.address || ''
      });
      const paid = project.payments.reduce((sum, p) => sum + p.amount, 0);
      setManualPaid(paid);
      setInvoiceMeta({
        number: `MC-${project.id.slice(0, 5).toUpperCase()}`,
        date: new Date().toISOString().split('T')[0],
        time: '12:00'
      });
    }
  }, [selectedProjectId, projects, clients, isManual, showHistory, t.services]);

  const handleManualStart = () => {
    setIsManual(true);
    setShowHistory(false);
    setSelectedProjectId('');
    setInvoiceItems([{ id: crypto.randomUUID(), description: '', amount: 0, schedule: '' }]);
    setRecipient({ name: '', email: '', phone: '', address: '' });
    setManualPaid(0);
    setInvoiceMeta({
      number: `MC-CUST-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      time: '10:00'
    });
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setInvoiceItems(invoiceItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const totalValue = invoiceItems.reduce((sum, item) => sum + item.amount, 0);
  const balanceDue = totalValue - manualPaid;
  const isVisible = (selectedProjectId || isManual) && !showHistory;

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-700 pb-24 print:p-0 overflow-x-hidden">
      <div className="flex flex-col gap-4 no-print px-1">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{t.title}</h2>
            <p className="text-slate-400 font-bold text-[10px] md:text-sm uppercase tracking-widest">{t.desc}</p>
          </div>
          <button onClick={() => setShowHistory(!showHistory)} className="w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-white text-slate-600 border border-slate-200 shadow-sm active:scale-95 transition-all">
            {showHistory ? t.backToEditor : t.history}
          </button>
        </div>
        
        {!showHistory && (
          <div className="flex flex-col sm:flex-row gap-3">
            <select 
              className="flex-1 bg-white border border-slate-200 rounded-2xl px-5 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-400 card-shadow text-xs"
              value={selectedProjectId}
              onChange={(e) => { setIsManual(false); setShowHistory(false); setSelectedProjectId(e.target.value); }}
            >
              <option value="">{t.selectProject}</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
            <button onClick={handleManualStart} className="px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-indigo-600 text-white shadow-xl shadow-indigo-100 active:scale-95 transition-all">
              {t.manualInvoice}
            </button>
          </div>
        )}
      </div>

      {showHistory ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 px-1">
           {invoices.map(inv => (
             <div key={inv.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-lg active:scale-[0.98] transition-all cursor-pointer" onClick={() => { setIsManual(true); setInvoiceMeta({ number: inv.number, date: inv.date, time: inv.time }); setRecipient({ ...inv.recipient }); setCompanyInfo({ ...inv.companyInfo }); setInvoiceItems([...inv.items]); setManualPaid(inv.paid); setShowHistory(false); }}>
                <div className="flex justify-between items-start mb-4">
                   <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6" /></svg></div>
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{inv.date}</p>
                </div>
                <h4 className="text-lg font-black text-slate-900 mb-1 truncate">{inv.recipient.name}</h4>
                <p className="text-[9px] font-bold text-slate-400 mb-4 truncate">{inv.number}</p>
                <div className="flex justify-between items-center border-t border-slate-50 pt-3">
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Total</p>
                   <p className="text-base font-black text-indigo-600">৳{inv.total.toLocaleString()}</p>
                </div>
             </div>
           ))}
        </div>
      ) : isVisible ? (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 md:gap-8 print:block">
          <div className="xl:col-span-3 bg-white p-6 md:p-14 rounded-[2.5rem] shadow-2xl border border-slate-100 print:shadow-none print:border-none print:p-0 print:m-0 print:rounded-none overflow-visible" id="invoice-to-print" ref={invoiceRef}>
            
            {/* Header: Logo and Info */}
            <div className="flex flex-col sm:flex-row justify-between items-start mb-10 md:mb-16 gap-6 md:gap-10">
              <div className="flex flex-col items-start gap-3">
                {logo ? <img src={logo} alt="Logo" className="h-20 md:h-28 object-contain" /> : <div className="w-20 h-12 bg-slate-50 border border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-300 font-bold text-[8px] uppercase tracking-widest no-print">Logo</div>}
                <div className="no-print flex gap-2">
                   <button onClick={() => fileInputRef.current?.click()} className="text-[7px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded-md">{t.changeLogo}</button>
                   <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if(f) { const r = new FileReader(); r.onloadend = () => setLogo(r.result as string); r.readAsDataURL(f); } }} />
                </div>
              </div>
              <div className="text-left sm:text-right w-full sm:w-auto">
                <input className="w-full font-black text-slate-900 text-lg md:text-xl bg-transparent border-b border-transparent focus:border-slate-100 outline-none sm:text-right" placeholder="Business Name" value={companyInfo.name} onChange={e => setCompanyInfo({...companyInfo, name: e.target.value})} />
                <div className="space-y-1 mt-2">
                  <input className="w-full text-[10px] md:text-sm font-bold text-slate-500 bg-transparent border-b border-transparent focus:border-slate-100 outline-none sm:text-right" placeholder="Email" value={companyInfo.email} onChange={e => setCompanyInfo({...companyInfo, email: e.target.value})} />
                  <input className="w-full text-[10px] md:text-sm font-bold text-slate-500 bg-transparent border-b border-transparent focus:border-slate-100 outline-none sm:text-right" placeholder="Phone" value={companyInfo.phone} onChange={e => setCompanyInfo({...companyInfo, phone: e.target.value})} />
                  <textarea className="w-full text-[10px] md:text-sm font-bold text-slate-500 bg-transparent border-b border-transparent focus:border-slate-100 outline-none resize-none sm:text-right" placeholder="Address" rows={1} value={companyInfo.address} onChange={e => setCompanyInfo({...companyInfo, address: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-10 md:mb-16">
              <div className="bg-slate-50/50 p-6 md:p-8 rounded-2xl md:rounded-[2rem] border border-slate-50">
                <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4">INVOICE</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{t.invoiceNo}</span>
                    <input className="text-xs font-black text-slate-800 uppercase bg-transparent border-b border-slate-200 focus:border-indigo-400 outline-none text-right px-1" value={invoiceMeta.number} onChange={e => setInvoiceMeta({...invoiceMeta, number: e.target.value})} />
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{t.date}</span>
                    <input type="date" className="text-xs font-black text-slate-800 bg-transparent border-b border-slate-200 focus:border-indigo-400 outline-none text-right px-1" value={invoiceMeta.date} onChange={e => setInvoiceMeta({...invoiceMeta, date: e.target.value})} />
                  </div>
                </div>
              </div>
              <div className="p-2 md:p-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">{t.to}</p>
                <div className="space-y-2">
                  <input className="w-full font-black text-slate-900 text-base md:text-lg bg-transparent border-b border-transparent focus:border-slate-100 outline-none" placeholder="Client Name" value={recipient.name} onChange={e => setRecipient({...recipient, name: e.target.value})} />
                  <input className="w-full text-xs font-bold text-slate-500 bg-transparent border-b border-transparent focus:border-slate-100 outline-none" placeholder="Phone" value={recipient.phone} onChange={e => setRecipient({...recipient, phone: e.target.value})} />
                  <textarea className="w-full text-xs font-bold text-slate-500 bg-transparent border-b border-transparent focus:border-slate-100 outline-none resize-none" placeholder="Client Address" rows={1} value={recipient.address} onChange={e => setRecipient({...recipient, address: e.target.value})} />
                </div>
              </div>
            </div>

            {/* Optimized Items List (Responsive Card-style on Mobile) */}
            <div className="mb-10">
               <div className="hidden sm:grid grid-cols-[1fr_150px_40px] border-b-2 border-slate-900 pb-4 mb-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase">{t.description}</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase text-right">{t.amount}</span>
                  <span></span>
               </div>
               
               <div className="space-y-4 md:space-y-2">
                  {invoiceItems.map((item) => (
                    <div key={item.id} className="flex flex-col sm:grid sm:grid-cols-[1fr_150px_40px] gap-4 sm:gap-0 sm:items-center border-b border-slate-100 pb-4 sm:py-6 group">
                       <div className="flex flex-col gap-2">
                          <select 
                            className="w-full font-black text-slate-900 text-sm md:text-lg bg-slate-50 md:bg-transparent border-b border-transparent p-3 md:p-1 rounded-xl md:rounded-none outline-none" 
                            value={item.description} 
                            onChange={e => updateItem(item.id, 'description', e.target.value)}
                          >
                            <option value="" disabled>{t.servicePlaceholder}</option>
                            {t.services.map(svc => <option key={svc} value={svc}>{svc}</option>)}
                          </select>
                          <div className="flex items-center gap-2 px-1">
                            <span className="text-[9px] font-bold text-slate-400 uppercase">{t.scheduleLabel}:</span>
                            <select 
                              className="text-[10px] md:text-xs font-bold text-indigo-600 bg-transparent outline-none cursor-pointer" 
                              value={item.schedule} 
                              onChange={e => updateItem(item.id, 'schedule', e.target.value)}
                            >
                              <option value="">{t.selectDuration}</option>
                              {t.durations.map(dur => <option key={dur} value={dur}>{dur}</option>)}
                            </select>
                          </div>
                       </div>
                       <div className="flex items-center justify-end gap-1">
                          <span className="font-bold text-slate-400 text-sm md:text-lg">৳</span>
                          <input type="number" className="w-full sm:w-32 text-right font-black text-slate-900 text-sm md:text-xl bg-slate-50 md:bg-transparent p-3 md:p-1 rounded-xl md:rounded-none outline-none tabular-nums" value={item.amount || ''} onChange={e => updateItem(item.id, 'amount', parseFloat(e.target.value) || 0)} />
                       </div>
                       <div className="text-right sm:text-center no-print">
                          <button onClick={() => setInvoiceItems(invoiceItems.filter(i => i.id !== item.id))} className="text-red-400 p-2"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg></button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <button onClick={() => setInvoiceItems([...invoiceItems, { id: crypto.randomUUID(), description: '', amount: 0, schedule: '' }])} className="no-print w-full border-2 border-dashed border-slate-100 text-slate-300 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all mb-10">{t.addItem}</button>

            <div className="flex flex-col md:flex-row justify-between gap-10">
              <div className="flex-1">
                 <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4 opacity-50 border-b border-slate-100 pb-2 w-fit">{t.termsTitle}</h5>
                 <ul className="text-[9px] font-bold text-slate-400 space-y-2 list-disc pl-4 leading-relaxed">
                    {t.terms.map((term, i) => <li key={i}>{term}</li>)}
                 </ul>
              </div>

              <div className="w-full md:w-80 space-y-3 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                <div className="flex justify-between items-center text-slate-500">
                   <p className="text-[10px] font-bold uppercase tracking-widest">{t.total}</p>
                   <p className="font-black text-slate-900">৳{totalValue.toLocaleString()}</p>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                   <p className="text-[10px] font-bold uppercase tracking-widest">{t.paid}</p>
                   <div className="flex items-center gap-1">
                     <span className="font-bold">৳</span>
                     <input type="number" className="w-24 text-right font-black text-slate-900 bg-white rounded-lg px-2 py-1 outline-none border border-slate-100" value={manualPaid || ''} onChange={e => setManualPaid(parseFloat(e.target.value) || 0)} />
                   </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t-2 border-slate-900">
                   <p className="text-xs font-black text-slate-900 uppercase tracking-widest">{t.balance}</p>
                   <p className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter">৳{balanceDue.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 no-print">
            <button disabled={isProcessing} onClick={() => { const inv: SavedInvoice = { id: crypto.randomUUID(), projectId: selectedProjectId || undefined, number: invoiceMeta.number, date: invoiceMeta.date, time: invoiceMeta.time, recipient: { ...recipient }, companyInfo: { ...companyInfo }, items: [...invoiceItems], paid: manualPaid, total: totalValue }; setInvoices(prev => [inv, ...prev]); alert(t.saved); }} className="col-span-2 bg-indigo-600 text-white p-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">
              {t.saveRecord}
            </button>
            <button onClick={() => window.print()} className="bg-slate-900 text-white p-5 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">{t.print}</button>
            <button onClick={async () => { setIsProcessing(true); try { const canvas = await html2canvas(invoiceRef.current!, { scale: 2 }); const pdf = new jsPDF('p', 'mm', 'a4'); const img = canvas.toDataURL('image/jpeg', 0.9); const pw = pdf.internal.pageSize.getWidth(); pdf.addImage(img, 'JPEG', 0, 0, pw, (canvas.height * pw) / canvas.width); pdf.save(`Invoice-${invoiceMeta.number}.pdf`); } finally { setIsProcessing(false); } }} className="bg-white border border-slate-200 text-slate-900 p-5 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">{t.download}</button>
            <button onClick={() => { const msg = t.whatsappMsg(recipient.name, invoiceMeta.number, balanceDue); window.open(`https://wa.me/${recipient.phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank'); }} className="col-span-2 bg-[#25D366] text-white p-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.63 1.438h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              {t.whatsapp}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 md:py-40 bg-white/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 no-print px-4">
           <svg className="w-12 h-12 md:w-16 md:h-16 text-slate-200 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
           <p className="font-bold text-slate-300 uppercase tracking-widest text-[10px] md:text-sm text-center mb-8">{t.selectProject}</p>
           <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button onClick={handleManualStart} className="purple-gradient text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">{t.manualInvoice}</button>
              <button onClick={() => setShowHistory(true)} className="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-sm active:scale-95 transition-all">{t.history}</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceMaker;
