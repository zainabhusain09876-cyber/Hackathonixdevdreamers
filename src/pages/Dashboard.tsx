import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NeonCard from '@/components/NeonCard';
import { Wallet, Target, Activity, Plus, Loader2, BrainCircuit, Sparkles, TrendingUp, History, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import NeonButton from '@/components/NeonButton';
import { goalService } from '@/services/goalService';
import { showSuccess, showError } from '@/utils/toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const COLORS = ['#00F5FF', '#FF00FF', '#7C3AED', '#FFD700'];

const Dashboard = () => {
  const [goals, setGoals] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [newGoal, setNewGoal] = useState({
    goalName: '',
    targetAmount: '',
    currentSavings: '',
    months: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [goalsData, txData] = await Promise.all([
        goalService.fetchGoals(),
        goalService.fetchTransactions()
      ]);
      setGoals(goalsData);
      setTransactions(txData);
    } catch (error: any) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await goalService.createGoal({
        goalName: newGoal.goalName,
        targetAmount: Number(newGoal.targetAmount),
        currentSavings: Number(newGoal.currentSavings),
        months: Number(newGoal.months)
      });
      showSuccess('Goal initialized in the system.');
      setIsDialogOpen(false);
      setNewGoal({ goalName: '', targetAmount: '', currentSavings: '', months: '' });
      loadData();
    } catch (error: any) {
      showError(error.message);
    }
  };

  const totalSaved = goals.reduce((acc, goal) => acc + (goal.current_savings || 0), 0);
  const completedGoals = goals.filter(g => (g.current_savings || 0) >= (g.target || 1)).length;
  const activeGoals = goals.length - completedGoals;

  // Trend Analysis
  const lastMonthTx = transactions.filter(tx => {
    const date = new Date(tx.created_at);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return date > oneMonthAgo;
  });
  const prevMonthTx = transactions.filter(tx => {
    const date = new Date(tx.created_at);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    return date <= oneMonthAgo && date > twoMonthsAgo;
  });

  const lastMonthTotal = lastMonthTx.reduce((a, b) => a + b.amount, 0);
  const prevMonthTotal = prevMonthTx.reduce((a, b) => a + b.amount, 0);

  let trendMessage = "🚀 You are saving faster than your target rate.";
  if (lastMonthTotal < prevMonthTotal) {
    trendMessage = "⚠ Your savings have slowed this month.";
  } else if (lastMonthTotal > prevMonthTotal * 1.2) {
    trendMessage = "📈 Your savings trend is improving.";
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-10 neon-grid">
      <div className="max-w-7xl mx-auto relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter">
              SMART <span className="neon-text-cyan">DASHBOARD</span>
            </h1>
            <p className="text-muted-foreground font-mono text-sm">SYSTEM STATUS: OPTIMAL // ANALYTICS: ACTIVE</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <NeonButton variant="cyan" size="lg" className="flex gap-2">
                <Plus size={20} /> INITIALIZE NEW GOAL
              </NeonButton>
            </DialogTrigger>
            <DialogContent className="glass-card border-primary/20 text-white max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black neon-text-cyan">NEW OBJECTIVE</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateGoal} className="space-y-4 mt-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Objective Name</label>
                  <input 
                    required
                    value={newGoal.goalName}
                    onChange={e => setNewGoal({...newGoal, goalName: e.target.value})}
                    className="w-full bg-black/50 border border-primary/30 rounded-lg px-4 py-3 focus:border-primary outline-none transition-all"
                    placeholder="e.g. CYBERTRUCK"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Target (₹)</label>
                    <input 
                      required
                      type="number"
                      value={newGoal.targetAmount}
                      onChange={e => setNewGoal({...newGoal, targetAmount: e.target.value})}
                      className="w-full bg-black/50 border border-primary/30 rounded-lg px-4 py-3 focus:border-primary outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Initial (₹)</label>
                    <input 
                      required
                      type="number"
                      value={newGoal.currentSavings}
                      onChange={e => setNewGoal({...newGoal, currentSavings: e.target.value})}
                      className="w-full bg-black/50 border border-primary/30 rounded-lg px-4 py-3 focus:border-primary outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Timeframe (Months)</label>
                  <input 
                    required
                    type="number"
                    value={newGoal.months}
                    onChange={e => setNewGoal({...newGoal, months: e.target.value})}
                    className="w-full bg-black/50 border border-primary/30 rounded-lg px-4 py-3 focus:border-primary outline-none"
                  />
                </div>
                <NeonButton type="submit" className="w-full py-4 text-lg">CONFIRM MISSION</NeonButton>
              </form>
            </DialogContent>
          </Dialog>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-primary" size={48} />
            <p className="text-primary font-mono animate-pulse">SCANNING DATABASE...</p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard icon={<Target className="text-primary" />} label="TOTAL GOALS" value={goals.length.toString()} variant="cyan" />
              <StatCard icon={<Activity className="text-secondary" />} label="ACTIVE GOALS" value={activeGoals.toString()} variant="pink" />
              <StatCard icon={<CheckCircle2 className="text-accent" />} label="COMPLETED" value={completedGoals.toString()} variant="purple" />
              <StatCard icon={<Wallet className="text-primary" />} label="TOTAL SAVED" value={`₹${totalSaved.toLocaleString()}`} variant="cyan" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Goal Comparison Chart */}
                <NeonCard>
                  <h3 className="text-xs font-black text-primary mb-8 tracking-widest uppercase flex items-center gap-2">
                    <TrendingUp size={16} /> GOAL PROGRESS COMPARISON
                  </h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={goals.map(g => ({ name: g.objective_name, progress: Math.round(((g.current_savings || 0) / (g.target || 1)) * 100) }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                        <XAxis dataKey="name" stroke="#444" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#444" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid rgba(0,245,255,0.3)', borderRadius: '8px' }}
                        />
                        <Bar dataKey="progress" radius={[4, 4, 0, 0]}>
                          {goals.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </NeonCard>

                {/* Goal Predictions */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-white tracking-widest uppercase">Goal Completion Predictions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {goals.filter(g => (g.current_savings || 0) < (g.target || 1)).map((goal, i) => (
                      <PredictionCard key={goal.id} goal={goal} variant={i % 2 === 0 ? 'cyan' : 'pink'} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {/* Trend Analysis */}
                <NeonCard variant="purple" className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-10"><BrainCircuit size={60} /></div>
                  <h3 className="text-xs font-black text-accent mb-4 tracking-widest uppercase">Saving Trend Analysis</h3>
                  <p className="text-sm font-medium text-white leading-relaxed">{trendMessage}</p>
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase mb-2">
                      <span>Last 30 Days</span>
                      <span className="text-white">₹{lastMonthTotal.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-accent" style={{ width: `${Math.min(100, (lastMonthTotal / (prevMonthTotal || 1)) * 50)}%` }} />
                    </div>
                  </div>
                </NeonCard>

                {/* Recent Activity Feed */}
                <NeonCard className="flex-1">
                  <h3 className="text-xs font-black text-primary mb-6 tracking-widest uppercase flex items-center gap-2">
                    <History size={16} /> Recent Activity
                  </h3>
                  <div className="space-y-6">
                    {transactions.slice(0, 5).map((tx, i) => (
                      <div key={i} className="flex items-start gap-3 group">
                        <div className="w-1 h-8 bg-primary/30 group-hover:bg-primary transition-colors rounded-full" />
                        <div>
                          <p className="text-xs font-bold text-white">₹{tx.amount.toLocaleString()} added to {tx.goals?.objective_name}</p>
                          <p className="text-[10px] font-mono text-muted-foreground mt-1">{new Date(tx.created_at).toLocaleDateString()} // {new Date(tx.created_at).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    ))}
                    {transactions.length === 0 && (
                      <p className="text-xs text-muted-foreground font-mono text-center py-10">NO RECENT ACTIVITY DETECTED.</p>
                    )}
                  </div>
                </NeonCard>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, variant }: any) => (
  <NeonCard variant={variant} className="flex items-center gap-4 group">
    <div className="p-3 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">{icon}</div>
    <div>
      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{label}</p>
      <p className="text-2xl font-black text-white tracking-tight">{value}</p>
    </div>
  </NeonCard>
);

const PredictionCard = ({ goal, variant }: any) => {
  const createdAt = new Date(goal.created_at);
  const now = new Date();
  const monthsPassed = Math.max(1, (now.getFullYear() - createdAt.getFullYear()) * 12 + now.getMonth() - createdAt.getMonth());
  const avgMonthly = (goal.current_savings || 0) / monthsPassed;
  const remaining = (goal.target || 0) - (goal.current_savings || 0);
  const predictedMonths = avgMonthly > 0 ? Math.ceil(remaining / avgMonthly) : '∞';

  return (
    <NeonCard variant={variant} className="p-4 border-white/5">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="text-primary" size={14} />
        <span className="text-[10px] font-black text-white uppercase tracking-widest">{goal.objective_name}</span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        At your current saving rate, you will complete this goal in <span className="text-white font-black">{predictedMonths} months</span>.
      </p>
    </NeonCard>
  );
};

export default Dashboard;