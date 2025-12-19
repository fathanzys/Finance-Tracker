import React, { useState } from 'react';
import { Save, Check, Layers, TrendingUp, Calendar } from 'lucide-react';

const InputField = ({ label, type = "text", value, onChange, placeholder, autoFocus }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</label>
    <input 
      type={type} 
      value={value} 
      onChange={onChange} 
      autoFocus={autoFocus}
      className="input-pro w-full rounded-lg px-4 py-3 text-sm font-medium placeholder:text-slate-600"
      placeholder={placeholder} 
    />
  </div>
);

// KATEGORI STANDAR
const EXPENSE_CATS = [
  { id: 'operational', label: 'Operasional Harian' },
  { id: 'bills', label: 'Tagihan & Utilitas' },
  { id: 'transport', label: 'Transportasi & Logistik' },
  { id: 'entertainment', label: 'Lifestyle & Hiburan' },
  { id: 'medical', label: 'Kesehatan & Asuransi' },
  { id: 'others', label: 'Lainnya / Miscellaneous' } 
];

const INCOME_CATS = [
  { id: 'salary', label: 'Gaji / Salary' },
  { id: 'business', label: 'Profit Bisnis' },
  { id: 'investment', label: 'Dividen / Investasi' },
  { id: 'freelance', label: 'Freelance' }
];

// --- 1. TRANSAKSI ---
export const TransactionForm = ({ onSave, initialData }) => {
  // FIX: Hapus useEffect. Inisialisasi state langsung saat komponen dibuat.
  const [amount, setAmount] = useState(initialData?.amount || '');
  const [type, setType] = useState(initialData?.type || 'expense');
  
  // Logic inisialisasi kategori (Lazy State Initialization)
  const [selectedCat, setSelectedCat] = useState(() => {
    if (!initialData) return '';
    // Cek apakah kategori ada di list standar, jika tidak biarkan string aslinya
    return initialData.category;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !selectedCat) return;
    onSave({ amount: parseFloat(amount), category: selectedCat, type });
  };

  const currentCats = type === 'expense' ? EXPENSE_CATS : INCOME_CATS;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
        {['expense', 'income'].map(t => (
          <button key={t} type="button" onClick={() => { setType(t); setSelectedCat(''); }}
            className={`py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${type === t ? (t === 'income' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white') : 'text-slate-400 hover:text-white'}`}>
            {t === 'income' ? 'Income' : 'Expense'}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        <InputField label="Nominal (IDR)" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" autoFocus />
        <div className="space-y-1.5">
           <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Kategori</label>
           <select value={selectedCat} onChange={(e) => setSelectedCat(e.target.value)} className="input-pro w-full rounded-lg px-4 py-3 text-sm font-medium appearance-none cursor-pointer">
             <option value="" disabled>Pilih Kategori...</option>
             {currentCats.map(cat => <option key={cat.id} value={cat.label}>{cat.label}</option>)}
           </select>
        </div>
      </div>
      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-semibold text-sm flex justify-center gap-2 items-center"><Save size={16}/> Simpan Data</button>
    </form>
  );
};

// --- 2. BILLS ---
export const BillForm = ({ onSave }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !amount || !date) return;
    onSave({ name, amount: parseFloat(amount), date: parseInt(date) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <InputField label="Nama Tagihan" value={name} onChange={e => setName(e.target.value)} placeholder="Netflix / Listrik / Gym" autoFocus />
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Biaya (IDR)" type="number" value={amount} onChange={e => setAmount(e.target.value)} />
        <InputField label="Tanggal Jatuh Tempo (1-31)" type="number" value={date} onChange={e => setDate(e.target.value)} placeholder="Tgl" />
      </div>
      <button type="submit" className="w-full bg-slate-600 hover:bg-slate-500 text-white py-3 rounded-lg font-semibold text-sm flex justify-center gap-2 items-center"><Calendar size={16}/> Simpan Tagihan</button>
    </form>
  );
};

// --- 3. BUDGET ---
export const BudgetForm = ({ onSave }) => {
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const handleSubmit = (e) => { e.preventDefault(); onSave({ category, limit: parseFloat(limit) }); };
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <InputField label="Nama Budget" value={category} onChange={e => setCategory(e.target.value)} placeholder="Marketing / Operasional" autoFocus />
      <InputField label="Limit (IDR)" type="number" value={limit} onChange={e => setLimit(e.target.value)} placeholder="0" />
      <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white py-3 rounded-lg font-semibold text-sm flex justify-center gap-2 items-center"><Layers size={16}/> Set Budget</button>
    </form>
  );
};

// --- 4. GOALS ---
export const GoalForm = ({ onSave }) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentSaved, setCurrentSaved] = useState('');
  const handleSubmit = (e) => { e.preventDefault(); onSave({ name, targetAmount: parseFloat(targetAmount), currentSaved: parseFloat(currentSaved || 0) }); };
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <InputField label="Nama Target" value={name} onChange={e => setName(e.target.value)} placeholder="Dana Darurat" autoFocus />
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Target (IDR)" type="number" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} />
        <InputField label="Terkumpul (IDR)" type="number" value={currentSaved} onChange={e => setCurrentSaved(e.target.value)} />
      </div>
      <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-lg font-semibold text-sm flex justify-center gap-2 items-center"><Check size={16}/> Simpan Target</button>
    </form>
  );
};

// --- 5. INVESTASI ---
export const InvestmentForm = ({ onSave, initialData }) => {
  // FIX: Hapus useEffect. Inisialisasi state langsung dari props.
  const [name, setName] = useState(initialData?.name || '');
  const [initialAmount, setInitialAmount] = useState(initialData?.initialAmount || '');
  const [roi, setRoi] = useState(initialData?.roi || '');
  const [type, setType] = useState(initialData?.type || 'stock');

  const handleSubmit = (e) => { e.preventDefault(); onSave({ name, initialAmount: parseFloat(initialAmount), roi: parseFloat(roi || 0), type }); };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex gap-2">
        {['stock', 'crypto', 'bond'].map(t => (
          <button key={t} type="button" onClick={() => setType(t)} className={`flex-1 py-2 rounded-md text-xs font-bold uppercase border transition-all ${type === t ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-700 text-slate-500'}`}>{t}</button>
        ))}
      </div>
       <InputField label="Instrumen" value={name} onChange={e => setName(e.target.value)} placeholder="BBCA / BTC" />
       <div className="grid grid-cols-2 gap-4">
         <InputField label="Modal (IDR)" type="number" value={initialAmount} onChange={e => setInitialAmount(e.target.value)} />
         <InputField label="Return (%)" type="number" value={roi} onChange={e => setRoi(e.target.value)} />
       </div>
       <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-lg font-semibold text-sm"><TrendingUp size={16} className="inline mr-2"/> Update Portfolio</button>
    </form>
  );
};