import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NeonCard from '@/components/NeonCard';
import { Wallet, TrendingDown, Target, Activity, Plus, Loader2, Trash2, BrainCircuit, Sparkles } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
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

const data = [
  { name: 'Food', value: 400 },
  { name: 'Transport', value: 300 },
  { name: 'Shopping', value: 300 },
  { name: 'Bills', value: 200 },
];

const lineData = [
  { name: 'Jan', savings: 4000 },
  { name: 'Feb', savings: 3000 },
  { name: 'Mar', savings: 5000 },
  { name: 'Apr', savings: 4500 },
  { name: 'May', savings: 6000 },
];

const COLORS = ['#00F5FF', '#FF00FF', '#7C3AED', '#FFD700'];

const Dashboard = () => {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [aiInsights, setAiInsights] = useState<Record<string, any>>({});
  
  const [newGoal, setNewGoal] = useState({
    goalName: '',
    targetAmount: '',
    currentSavings: '',
    months: ''
  });

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const data = await goalService.fetchGoals();
      setGoals(data);
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
      loadGoals();
    } catch (error: any) {
      showError(error.message);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    try {
      await goalService.deleteGoal(id);
      showSuccess('Goal purged from database.');
      loadGoals();
    } catch (error: any) {
      showError(error.message);
    }
  };

  const handleAnalyze = async (goal: any) => {
    setAnalyzingId(goal.id);
    try {
      const insight = await goalService.analyzeGoal(goal);
      setAiInsights(prev => ({ ...prev, [goal.id]: insight }));
      showSuccess('AI Analysis complete.');
    } catch (error: any) {
      showError('AI System Offline: ' + error.message);
    } finally {
      setAnalyzingId(null);
    }
  };

  const totalSavings = goals.reduce((acc, goal) => acc + goal.current_savings, 0);

  return (
    <div className="min-h-screen bg-background p-6 md:p-10 neon-grid">
      <div className="max-w-7xl mx-auto relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter">
              <span className="neon-text-cyan">FINANCIAL</span> COMMAND
            </h1>
            <p className="text-muted-foreground font-mono text-sm">SYSTEM STATUS: OPTIMAL // USER: AUTHENTICATED</p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard icon={<Wallet className="text-primary" />} label="TOTAL CAPITAL" value={`₹${totalSavings.toLocaleString()}`} variant="cyan" />
          <StatCard icon={<TrendingDown className="text-secondary" />} label="BURN RATE" value="₹12,400" variant="pink" />
          <StatCard icon={<Target className="text-accent" />} label="ACTIVE MISSIONS" value={goals.length.toString()} variant="purple" />
          <StatCard icon={<Activity className="text-primary" />} label="EFFICIENCY" value="85%" variant="cyan" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-white tracking-widest uppercase">Active Objectives</h2>
              <div className="h-px flex-1 bg-white/10 mx-4" />
            </div>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="animate-spin text-primary" size={48} />
                <p className="text-primary font-mono animate-pulse">SCANNING DATABASE...</p>
              </div>
            ) : goals.length > 0 ? (
              <div className="space-y-6">
                <AnimatePresence>
                  {goals.map((goal, index) => (
                    <GoalProgressCard 
                      key={goal.id}
                      goal={goal}
                      variant={index % 3 === 0 ? 'cyan' : index % 3 === 1 ? 'pink' : 'purple'}
                      onDelete={() => handleDeleteGoal(goal.id)}
                      onAnalyze={() => handleAnalyze(goal)}
                      isAnalyzing={analyzingId === goal.id}
                      insight={aiInsights[goal.id]}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <NeonCard className="text-center py-20 border-dashed border-white/10">
                <Target className="mx-auto mb-4 text-muted-foreground opacity-20" size={64} />
                <p className="text-muted-foreground font-mono">NO ACTIVE OBJECTIVES DETECTED.</p>
                <p className="text-xs text-muted-foreground/50 mt-2">INITIALIZE A GOAL TO BEGIN TRACKING.</p>
              </NeonCard>
            )}
          </div>

          <div className="space-y-8">
            <NeonCard className="relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10"><Activity size={80} /></div>
              <h3 className="text-xs font-black text-primary mb-6 tracking-widest uppercase">Resource Allocation</h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid rgba(0,245,255,0.3)', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </NeonCard>

            <NeonCard variant="pink">
              <h3 className="text-xs font-black text-secondary mb-6 tracking-widest uppercase">Growth Projection</h3>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData}>
                    <XAxis dataKey="name" stroke="#444" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#444" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,0,255,0.3)', borderRadius: '8px' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="savings" 
                      stroke="#FF00FF" 
                      strokeWidth={3} 
                      dot={{ fill: '#FF00FF', r: 4 }} 
                      activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </NeonCard>
          </div>
        </div>
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

const GoalProgressCard = ({ goal, variant = 'cyan', onDelete, onAnalyze, isAnalyzing, insight }: any) => {
  const progress = Math.round((goal.current_savings / goal.target_amount) * 100);
  const color = variant === 'cyan' ? '#00F5FF' : variant === 'pink' ? '#FF00FF' : '#7C3AED';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <NeonCard variant={variant} className="relative group">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-white tracking-tight uppercase">{goal.goal_name}</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-muted-foreground">ID: {goal.id.slice(0,8)}</span>
            </div>
            <p className="text-xs text-muted-foreground font-mono mt-1">TIMEFRAME: {goal.deadline_months} MONTHS</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={onAnalyze}
              disabled={isAnalyzing}
              className="p-2 rounded-lg bg-white/5 hover:bg-primary/20 text-primary transition-all disabled:opacity-50"
              title="AI Analysis"
            >
              {isAnalyzing ? <Loader2 className="animate-spin" size={18} /> : <BrainCircuit size={18} />}
            </button>
            <button 
              onClick={onDelete}
              className="p-2 rounded-lg bg-white/5 hover:bg-destructive/20 text-destructive transition-all"
              title="Delete Goal"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="space-y-1">
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Target</p>
            <p className="text-sm font-black text-white">₹{goal.target_amount.toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Saved</p>
            <p className="text-sm font-black text-white">₹{goal.current_savings.toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Monthly Req.</p>
            <p className="text-sm font-black text-primary">₹{goal.monthly_required.toLocaleString()}</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Progress</p>
            <p className="text-xl font-black" style={{ color }}>{progress}%</p>
          </div>
        </div>

        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-2">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.5, ease: "circOut" }}
            className="h-full rounded-full"
            style={{ backgroundColor: color, boxShadow: `0 0 15px ${color}` }}
          />
        </div>

        {insight && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20 flex gap-3 items-start"
          >
            <Sparkles className="text-primary shrink-0 mt-1" size={16} />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">AI Insight</span>
                <span className="text-[10px] font-mono text-muted-foreground">FEASIBILITY: {insight.feasibility} // PROBABILITY: {insight.probability}%</span>
              </div>
              <p className="text-xs text-white/80 leading-relaxed italic">"{insight.advice}"</p>
            </div>
          </motion.div>
        )}
      </NeonCard>
    </motion.div>
  );
};

export default Dashboard;