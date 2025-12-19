import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { 
  LayoutDashboard, PieChart as PieIcon, Wallet, CreditCard, LogOut, Settings,
  Plus, Search, Bell, TrendingUp, TrendingDown, Trash2, Edit3, X, 
  Download, Upload, AlertTriangle, Menu, CheckCircle, ArrowRight, ArrowDownRight, ArrowUpRight
} from 'lucide-react';
import { useFinance } from './hooks/useFinance';
import { TransactionForm, InvestmentForm, BudgetForm, GoalForm, BillForm } from './components/Forms';
import { formatIDR, formatDate } from './utils/format';

// --- 1. KOMPONEN PENDUKUNG (DI LUAR APP) ---

const NavItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
      active 
        ? 'bg-indigo-600/10 text-indigo-400' 
        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
    }`}
  >
    <Icon size={20} className={active ? 'text-indigo-500' : 'text-slate-500 group-hover:text-slate-300'} />
    {label}
    {active && (
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-l-full"></div>
    )}
  </button>
);

const Sidebar = ({ activeTab, setActiveTab, setIsMobileMenuOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'wallet', label: 'Transactions', icon: Wallet },
    { id: 'investments', label: 'Portfolio', icon: PieIcon },
    { id: 'planning', label: 'Planning', icon: CreditCard },
  ];

  return (
    <div className="flex flex-col h-full bg-[#020617] border-r border-white/5 p-6 relative">
       <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/20">F</div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-white leading-none">Fintesa<span className="text-indigo-500">.</span></h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase mt-1">Pro Finance</p>
          </div>
       </div>

       <nav className="space-y-1 flex-1">
          {menuItems.map((item) => (
            <NavItem 
              key={item.id} 
              icon={item.icon} 
              label={item.label} 
              active={activeTab === item.id} 
              onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }} 
            />
          ))}
       </nav>

       <div className="mt-auto pt-6 border-t border-white/5 space-y-2">
          <button onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'settings' ? 'text-indigo-400 bg-indigo-600/10' : 'text-slate-400 hover:text-slate-200'}`}>
             <Settings size={20}/> Settings
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-all">
             <LogOut size={20}/> Logout
          </button>
       </div>
    </div>
  );
};

// --- 2. VIEW COMPONENTS (DI LUAR APP - Menerima Props) ---

const DashboardView = ({ totalBalance, totalIncome, totalExpense, bills, chartData, setModalState, handlePayBill, removeBill }) => (
  <div className="space-y-8 animate-enter">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Balance Card */}
         <div className="lg:col-span-2 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 to-violet-700 p-8 text-white shadow-2xl shadow-indigo-900/40 group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-all duration-700"></div>
            <div className="relative z-10 h-full flex flex-col justify-between">
               <div className="flex justify-between items-start">
                  <div>
                     <p className="text-indigo-200 font-medium text-sm flex items-center gap-2 mb-2"><Wallet size={16}/> Total Net Worth</p>
                     <h1 className="text-4xl md:text-5xl font-black tracking-tight">{formatIDR(totalBalance)}</h1>
                  </div>
                  <div className="hidden md:block p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
                     <TrendingUp size={24} className="text-white"/>
                  </div>
               </div>
               <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="bg-black/20 rounded-2xl p-4 backdrop-blur-sm border border-white/5">
                     <div className="flex items-center gap-2 mb-1 text-emerald-300 text-xs font-bold uppercase"><ArrowDownRight size={14}/> Income</div>
                     <p className="text-lg font-bold">{formatIDR(totalIncome)}</p>
                  </div>
                  <div className="bg-black/20 rounded-2xl p-4 backdrop-blur-sm border border-white/5">
                     <div className="flex items-center gap-2 mb-1 text-rose-300 text-xs font-bold uppercase"><ArrowUpRight size={14}/> Expense</div>
                     <p className="text-lg font-bold">{formatIDR(totalExpense)}</p>
                  </div>
               </div>
            </div>
         </div>

         {/* Bills Widget */}
         <div className="glass-card rounded-[2rem] p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-white flex items-center gap-2"><Bell size={18} className="text-amber-400"/> Upcoming Bills</h3>
               <button onClick={() => setModalState({ type: 'bill' })} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 transition-colors"><Plus size={16}/></button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar max-h-[250px] pr-2">
               {bills.length === 0 && <div className="text-center py-8 text-slate-500 text-sm">No bills due. Relax! 🌴</div>}
               {bills.map((bill) => (
                  <div key={bill.id} className="group flex items-center justify-between p-3 rounded-2xl bg-slate-800/40 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-sm shadow-inner">{bill.name.charAt(0)}</div>
                        <div>
                           <p className="text-sm font-bold text-white leading-tight">{bill.name}</p>
                           <p className="text-[10px] text-slate-400 font-medium mt-0.5">Due: {bill.date}th</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-sm font-bold text-slate-200">{formatIDR(bill.amount)}</p>
                        <div className="flex justify-end gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => handlePayBill(bill)} className="text-emerald-400 hover:text-emerald-300 p-1"><CheckCircle size={14}/></button>
                           <button onClick={() => removeBill(bill.id)} className="text-rose-400 hover:text-rose-300 p-1"><Trash2 size={14}/></button>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* Analytics Chart */}
      <div className="glass-card rounded-[2rem] p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
             <div>
               <h3 className="font-bold text-white text-lg flex items-center gap-2"><TrendingUp size={20} className="text-indigo-500"/> Financial Analytics</h3>
               <p className="text-sm text-slate-400">Cashflow overview for this period</p>
             </div>
             <div className="flex gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300"><span className="w-3 h-3 rounded-full bg-indigo-500"></span> Income</div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300"><span className="w-3 h-3 rounded-full bg-rose-500"></span> Expense</div>
             </div>
          </div>
          <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="gradInc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="gradExp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" tick={{fontSize: 12}} axisLine={false} tickLine={false} dy={10} />
                  <YAxis stroke="#64748b" tick={{fontSize: 12}} axisLine={false} tickLine={false} dx={-10} />
                  <Tooltip 
                    contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '16px', color: '#fff', boxShadow: '0 10px 40px rgba(0,0,0,0.5)'}}
                    itemStyle={{fontSize: '12px', fontWeight: 'bold'}}
                  />
                  <Area type="monotone" dataKey="income" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#gradInc)" />
                  <Area type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#gradExp)" />
                </AreaChart>
              </ResponsiveContainer>
          </div>
      </div>
  </div>
);

const TransactionsView = ({ filteredTransactions, searchTerm, setSearchTerm, setModalState, removeTransaction }) => (
  <div className="space-y-6 animate-enter">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-2xl font-bold text-white">History</h2>
          <div className="flex gap-3 w-full md:w-auto">
               <div className="relative flex-1 md:w-64">
                  <Search size={18} className="absolute left-4 top-3.5 text-slate-500"/>
                  <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"/>
               </div>
               <button onClick={() => setModalState({ type: 'transaction', data: null })} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-indigo-900/20 flex items-center gap-2 transition-transform active:scale-95"><Plus size={18}/> New</button>
          </div>
      </div>
      <div className="glass-card rounded-2xl overflow-hidden overflow-x-auto">
         <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
               <tr className="bg-slate-900/50 border-b border-slate-700/50 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="p-5 font-bold">Date</th>
                  <th className="p-5 font-bold">Details</th>
                  <th className="p-5 font-bold">Type</th>
                  <th className="p-5 font-bold">Amount</th>
                  <th className="p-5 font-bold text-right">Action</th>
               </tr>
            </thead>
            <tbody className="text-sm text-slate-300 divide-y divide-slate-800">
               {filteredTransactions.length === 0 && <tr><td colSpan="5" className="p-10 text-center text-slate-500 italic">No transactions found.</td></tr>}
               {filteredTransactions.slice().reverse().map(t => (
                  <tr key={t.id} className="hover:bg-slate-800/40 transition-colors group">
                     <td className="p-5 text-slate-400 font-mono text-xs">{formatDate(t.date)}</td>
                     <td className="p-5 font-semibold text-white">{t.category}</td>
                     <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${t.type === 'income' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                           {t.type}
                        </span>
                     </td>
                     <td className="p-5 font-bold text-white">{formatIDR(t.amount)}</td>
                     <td className="p-5 text-right">
                        <div className="flex justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => setModalState({ type: 'transaction', data: t })} className="p-2 bg-slate-800 rounded-lg text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all"><Edit3 size={14}/></button>
                           <button onClick={() => { if(window.confirm('Delete?')) removeTransaction(t.id) }} className="p-2 bg-slate-800 rounded-lg text-rose-400 hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={14}/></button>
                        </div>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
  </div>
);

const InvestmentsView = ({ investments, setModalState, removeInvestment }) => (
   <div className="space-y-6 animate-enter">
      <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Investment Portfolio</h2>
          <button onClick={() => setModalState({ type: 'investment', data: null })} className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-indigo-900/20 flex items-center gap-2"><Plus size={18}/> New Asset</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {investments.length === 0 && <p className="col-span-3 text-center text-slate-500 py-10">No assets in portfolio yet.</p>}
         {investments.map(inv => (
           <div key={inv.id} className="card-pro rounded-xl p-6 relative group hover:border-indigo-500/30 transition-all">
              <div className="flex justify-between items-start mb-6">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center font-bold text-white border border-slate-700">{inv.name.substring(0,2).toUpperCase()}</div>
                    <div>
                       <h4 className="font-bold text-white text-base">{inv.name}</h4>
                       <span className="text-[10px] text-slate-400 uppercase tracking-widest">{inv.type}</span>
                    </div>
                 </div>
                 <span className={`text-sm font-bold px-2 py-1 rounded ${inv.roi >= 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>{inv.roi > 0 ? '+' : ''}{inv.roi}%</span>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-4">
                 <div><p className="text-xs text-slate-500 mb-1">Invested</p><p className="text-slate-300 font-mono text-sm">{formatIDR(inv.initialAmount)}</p></div>
                 <div className="text-right"><p className="text-xs text-slate-500 mb-1">Current Value</p><p className="text-white font-bold font-mono text-sm">{formatIDR(inv.initialAmount + (inv.initialAmount * (inv.roi / 100)))}</p></div>
              </div>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                 <button onClick={() => setModalState({ type: 'investment', data: inv })} className="text-slate-400 hover:text-indigo-400"><Edit3 size={14}/></button>
                 <button onClick={() => removeInvestment(inv.id)} className="text-slate-400 hover:text-rose-400"><Trash2 size={14}/></button>
              </div>
           </div>
         ))}
      </div>
   </div>
);

const PlanningView = ({ budgets, transactions, goals, setModalState, removeBudget, removeGoal }) => (
   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-enter">
      <div className="card-pro rounded-xl p-6">
         <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-white text-sm uppercase tracking-wide">Monthly Budgets</h3>
            <button onClick={() => setModalState({ type: 'budget' })} className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"><Plus size={16}/></button>
         </div>
         <div className="space-y-6">
            {budgets.length === 0 && <p className="text-xs text-slate-500 text-center">No budgets set.</p>}
            {budgets.map(b => {
                const spent = transactions.filter(t => t.type === 'expense' && t.category.toLowerCase().includes(b.category.toLowerCase())).reduce((a,c) => a+c.amount,0);
                const pct = Math.min((spent/b.limit)*100, 100);
                return (
                  <div key={b.id} className="group">
                    <div className="flex justify-between text-xs font-bold text-slate-400 mb-2"><span>{b.category}</span><span className="text-white">{Math.round(pct)}%</span></div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2"><div className={`h-full ${pct > 90 ? 'bg-rose-500' : 'bg-indigo-500'} rounded-full transition-all duration-500`} style={{width: `${pct}%`}}></div></div>
                    <div className="flex justify-between items-center">
                       <p className="text-[10px] text-slate-500 font-mono">{formatIDR(spent)} / {formatIDR(b.limit)}</p>
                       <button onClick={() => removeBudget(b.id)} className="text-[10px] text-rose-500 opacity-0 group-hover:opacity-100 hover:underline">Remove</button>
                    </div>
                  </div>
                )
            })}
         </div>
      </div>
      <div className="card-pro rounded-xl p-6">
         <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-white text-sm uppercase tracking-wide">Savings Goals</h3>
            <button onClick={() => setModalState({ type: 'goal' })} className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"><Plus size={16}/></button>
         </div>
         <div className="space-y-4">
            {goals.length === 0 && <p className="text-xs text-slate-500 text-center">No goals set.</p>}
            {goals.map(g => {
               const pct = Math.min((g.currentSaved / g.targetAmount) * 100, 100);
               return (
                  <div key={g.id} className="bg-slate-800/30 p-4 rounded-lg border border-slate-700 group">
                     <div className="flex justify-between mb-3"><span className="font-bold text-white text-sm">{g.name}</span><span className="text-xs font-bold text-indigo-400">{Math.round(pct)}%</span></div>
                     <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2"><div className="h-full bg-indigo-500" style={{width: `${pct}%`}}></div></div>
                     <div className="flex justify-between items-center">
                        <p className="text-[10px] text-slate-500 font-mono">{formatIDR(g.currentSaved)} of {formatIDR(g.targetAmount)}</p>
                        <button onClick={() => removeGoal(g.id)} className="text-[10px] text-rose-500 opacity-0 group-hover:opacity-100 hover:underline">Delete</button>
                     </div>
                  </div>
               )
            })}
         </div>
      </div>
   </div>
);

const SettingsView = ({ handleBackup, handleRestore }) => (
  <div className="max-w-2xl mx-auto space-y-8 animate-enter">
     <h2 className="text-2xl font-bold text-white">System Settings</h2>
     <div className="card-pro rounded-xl p-8">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Settings size={20} className="text-indigo-500"/> Data Management</h3>
        <p className="text-sm text-slate-400 mb-8 leading-relaxed">Securely backup your financial data to a local JSON file or restore from a previous backup.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <button onClick={handleBackup} className="flex flex-col items-center justify-center p-6 border border-slate-700 rounded-xl hover:bg-slate-800 hover:border-indigo-500 transition-all group">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors"><Download size={24} className="text-white"/></div>
              <span className="font-bold text-white text-sm">Backup Data</span>
           </button>
           <label className="flex flex-col items-center justify-center p-6 border border-slate-700 rounded-xl hover:bg-slate-800 hover:border-emerald-500 transition-all group cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-emerald-600 transition-colors"><Upload size={24} className="text-white"/></div>
              <span className="font-bold text-white text-sm">Restore Data</span>
              <input type="file" accept=".json" onChange={handleRestore} className="hidden" />
           </label>
        </div>
     </div>
     <div className="bg-rose-950/20 rounded-xl p-6 border border-rose-900/30 flex items-center justify-between">
        <div>
           <h3 className="font-bold text-rose-500 text-sm mb-1 flex items-center gap-2"><AlertTriangle size={16}/> Danger Zone</h3>
           <p className="text-xs text-rose-200/60">Permanently delete all data.</p>
        </div>
        <button onClick={() => { if(window.confirm("RESET TOTAL? Semua data akan hilang.")) { localStorage.clear(); window.location.reload(); }}} className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors">Reset</button>
     </div>
  </div>
);

// --- 3. MAIN APP ---

function App() {
  const { 
    transactions, investments, budgets, goals, bills,
    addTransaction, editTransaction, removeTransaction,
    addInvestment, editInvestment, removeInvestment,
    addBudget, removeBudget, addGoal, removeGoal,
    addBill, removeBill
  } = useFinance();
  
  const [modalState, setModalState] = useState(null);
  const [dateRange, setDateRange] = useState([new Date(new Date().setDate(new Date().getDate() - 30)), new Date()]);
  const [startDate, endDate] = dateRange;
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Logic Hitungan
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const tDate = new Date(t.date);
      const start = new Date(startDate); start.setHours(0,0,0,0);
      const end = new Date(endDate); end?.setHours(23,59,59,999);
      const inDate = tDate >= start && (!end || tDate <= end);
      const inSearch = t.category.toLowerCase().includes(searchTerm.toLowerCase());
      return inDate && inSearch;
    });
  }, [transactions, startDate, endDate, searchTerm]);

  const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = filteredTransactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const investmentTotal = investments.reduce((acc, inv) => acc + (inv.initialAmount + (inv.initialAmount * (inv.roi / 100))), 0);
  const totalBalance = (totalIncome - totalExpense) + investmentTotal;

  const chartData = useMemo(() => {
    return filteredTransactions.slice().reverse().map(t => ({
      name: formatDate(t.date).split(' ')[0],
      income: t.type === 'income' ? t.amount : 0,
      expense: t.type === 'expense' ? t.amount : 0,
    }));
  }, [filteredTransactions]);

  const handlePayBill = (bill) => {
    if (window.confirm(`Bayar "${bill.name}" sekarang?`)) {
      addTransaction({ amount: bill.amount, category: 'Tagihan & Utilitas', type: 'expense' });
      alert('Paid!');
    }
  };

  const handleBackup = () => {
    const data = { transactions, investments, budgets, goals, bills, date: new Date() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `Fintesa_Backup.json`;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const handleRestore = (e) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target.result);
        if(data.transactions && window.confirm("Overwrite data?")) {
          localStorage.setItem('finance_transactions', JSON.stringify(data.transactions));
          localStorage.setItem('finance_investments', JSON.stringify(data.investments));
          localStorage.setItem('finance_budgets', JSON.stringify(data.budgets));
          localStorage.setItem('finance_goals', JSON.stringify(data.goals));
          localStorage.setItem('finance_bills', JSON.stringify(data.bills));
          window.location.reload();
        }
      } catch (error) { console.error(error); alert("File corrupt."); }
    };
    if(e.target.files[0]) reader.readAsText(e.target.files[0]);
  };

  return (
    <div className="flex h-screen bg-[#020617] text-slate-100 font-sans overflow-hidden">
      
      {/* MOBILE HEADER */}
      <div className="md:hidden fixed top-0 w-full z-50 bg-[#0f172a]/90 backdrop-blur border-b border-white/5 px-4 py-3 flex justify-between items-center shadow-lg">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white text-sm shadow-md shadow-indigo-500/20">F</div>
            <span className="font-bold text-white tracking-tight">Fintesa<span className="text-indigo-500">.</span></span>
         </div>
         <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-300 p-1"><Menu size={24}/></button>
      </div>

      {/* SIDEBAR OVERLAY (Mobile) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 md:hidden backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)}>
           <div className="w-72 h-full bg-[#020617] shadow-2xl animate-enter" onClick={e => e.stopPropagation()}>
              <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} setIsMobileMenuOpen={setIsMobileMenuOpen} />
           </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:block w-72 h-full z-20 shadow-2xl">
         <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        
        {/* TOP HEADER */}
        <header className="h-20 px-6 flex items-center justify-between border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl z-10 sticky top-0 mt-14 md:mt-0">
           <div className="flex items-center gap-4">
              <div>
                 <h2 className="text-xl font-bold text-white capitalize tracking-tight">{activeTab}</h2>
              </div>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="hidden md:block relative z-50">
                <DatePicker selectsRange={true} startDate={startDate} endDate={endDate} onChange={(update) => setDateRange(update)} dateFormat="dd MMM yyyy" className="bg-slate-900 border border-slate-700 text-slate-300 text-sm font-medium px-4 py-2 rounded-xl focus:outline-none cursor-pointer text-center w-[220px] transition-colors hover:border-indigo-500" />
              </div>
              <button className="relative p-2.5 bg-slate-900 rounded-xl border border-slate-700 text-slate-400 hover:text-white transition-colors">
                 <Bell size={18}/>
                 <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-900"></span>
              </button>
           </div>
        </header>

        {/* CONTENT SCROLL AREA */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 custom-scrollbar">
           {activeTab === 'dashboard' && <DashboardView totalBalance={totalBalance} totalIncome={totalIncome} totalExpense={totalExpense} bills={bills} chartData={chartData} setModalState={setModalState} handlePayBill={handlePayBill} removeBill={removeBill} />}
           {activeTab === 'wallet' && <TransactionsView filteredTransactions={filteredTransactions} searchTerm={searchTerm} setSearchTerm={setSearchTerm} setModalState={setModalState} removeTransaction={removeTransaction} />}
           {activeTab === 'investments' && <InvestmentsView investments={investments} setModalState={setModalState} removeInvestment={removeInvestment} />}
           {activeTab === 'planning' && <PlanningView budgets={budgets} transactions={transactions} goals={goals} setModalState={setModalState} removeBudget={removeBudget} removeGoal={removeGoal} />}
           {activeTab === 'settings' && <SettingsView handleBackup={handleBackup} handleRestore={handleRestore} />}
        </div>
      </main>

      {/* MODAL */}
      {modalState && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-enter">
          <div className="bg-[#0f172a] w-full max-w-md rounded-3xl border border-slate-700 shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
               <h3 className="font-bold text-white text-lg">
                  {modalState.type === 'transaction' && 'New Transaction'}
                  {modalState.type === 'investment' && 'Update Portfolio'}
                  {modalState.type === 'budget' && 'Set Budget'}
                  {modalState.type === 'goal' && 'Set Goal'}
                  {modalState.type === 'bill' && 'Add Bill'}
               </h3>
               <button onClick={() => setModalState(null)} className="text-slate-500 hover:text-white bg-slate-800 p-1.5 rounded-full transition-colors"><X size={18}/></button>
            </div>
            <div className="p-6">
               {modalState.type === 'transaction' && <TransactionForm onSave={(d) => { modalState.data ? editTransaction(modalState.data.id, d) : addTransaction(d); setModalState(null); }} initialData={modalState.data} />}
               {modalState.type === 'investment' && <InvestmentForm onSave={(d) => { modalState.data ? editInvestment(modalState.data.id, d) : addInvestment(d); setModalState(null); }} initialData={modalState.data} />}
               {modalState.type === 'budget' && <BudgetForm onSave={(d) => { addBudget(d); setModalState(null); }} onClose={() => setModalState(null)} />}
               {modalState.type === 'goal' && <GoalForm onSave={(d) => { addGoal(d); setModalState(null); }} onClose={() => setModalState(null)} />}
               {modalState.type === 'bill' && <BillForm onSave={(d) => { addBill(d); setModalState(null); }} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;