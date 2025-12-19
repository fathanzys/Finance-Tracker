import { useState, useEffect } from 'react';

export const useFinance = () => {
  // 1. TRANSAKSI
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('finance_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  // 2. INVESTASI
  const [investments, setInvestments] = useState(() => {
    const saved = localStorage.getItem('finance_investments');
    return saved ? JSON.parse(saved) : [];
  });

  // 3. BUDGET
  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('finance_budgets');
    return saved ? JSON.parse(saved) : [];
  });

  // 4. GOALS
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('finance_goals');
    return saved ? JSON.parse(saved) : [];
  });

  // 5. BILLS (NEW: TAGIHAN RUTIN)
  const [bills, setBills] = useState(() => {
    const saved = localStorage.getItem('finance_bills');
    // Default dummy data jika kosong
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Netflix Premium', date: 25, amount: 186000 },
      { id: 2, name: 'Internet WiFi', date: 1, amount: 350000 }
    ];
  });

  // --- SAVE TO LOCAL STORAGE ---
  useEffect(() => { localStorage.setItem('finance_transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('finance_investments', JSON.stringify(investments)); }, [investments]);
  useEffect(() => { localStorage.setItem('finance_budgets', JSON.stringify(budgets)); }, [budgets]);
  useEffect(() => { localStorage.setItem('finance_goals', JSON.stringify(goals)); }, [goals]);
  useEffect(() => { localStorage.setItem('finance_bills', JSON.stringify(bills)); }, [bills]);

  // --- ACTIONS ---
  const addTransaction = (data) => setTransactions(prev => [{ id: Date.now(), date: new Date().toISOString(), ...data }, ...prev]);
  const editTransaction = (id, data) => setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
  const removeTransaction = (id) => setTransactions(prev => prev.filter(t => t.id !== id));

  const addInvestment = (data) => setInvestments(prev => [...prev, { id: Date.now(), ...data }]);
  const editInvestment = (id, data) => setInvestments(prev => prev.map(i => i.id === id ? { ...i, ...data } : i));
  const removeInvestment = (id) => setInvestments(prev => prev.filter(i => i.id !== id));

  const addBudget = (data) => setBudgets(prev => [...prev, { id: Date.now(), ...data }]);
  const removeBudget = (id) => setBudgets(prev => prev.filter(b => b.id !== id));

  const addGoal = (data) => setGoals(prev => [...prev, { id: Date.now(), ...data }]);
  const removeGoal = (id) => setGoals(prev => prev.filter(g => g.id !== id));

  // Bills Actions
  const addBill = (data) => setBills(prev => [...prev, { id: Date.now(), ...data }]);
  const removeBill = (id) => setBills(prev => prev.filter(b => b.id !== id));

  return { 
    transactions, investments, budgets, goals, bills,
    addTransaction, editTransaction, removeTransaction,
    addInvestment, editInvestment, removeInvestment,
    addBudget, removeBudget,
    addGoal, removeGoal,
    addBill, removeBill
  };
};