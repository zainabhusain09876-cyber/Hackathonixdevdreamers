import React from 'react';
import { motion } from 'framer-motion';
import NeonCard from '@/components/NeonCard';
import NeonButton from '@/components/NeonButton';
import { 
  Wallet, 
  Target, 
  CheckCircle2, 
  TrendingUp, 
  Plus, 
  AlertCircle, 
  Clock, 
  Trophy,
  Calendar
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

// --- FAKE DATA ---
const SUMMARY_DATA = {
  totalGoals: 3,
  goalsAchieved: 1,
  totalSaved: 65000,
  savedThisMonth: 8000
};

const SAVINGS_HISTORY = [
  { month: 'Jan', amount: 5000 },
  { month: 'Feb', amount: 12000 },
  { month: 'Mar', amount: 18000 },
  { month: 'Apr', amount: 25000 },
  { month: 'May', amount: 30000 },
  { month: 'Jun', amount: 35000 },
];

const GOALS = [
  {
    id: 1,
    name: "Laptop Fund",
    target: 60000,
    saved: 35000,
    deadline: "2026-12-31",
    milestones: [10000, 25000, 40000, 60000],
    variant: 'cyan' as const
  },
  {
    id: 2,
    name: "Emergency Fund",
    target: 20000,
    saved: 20000,
    deadline: "2025-06-01",
    milestones: [5000, 10000, 15000, 20000],
    variant: 'purple' as const
  },
  {
    id: 3,
    name: "Vacation Fund",
    target: 40000,
    saved: 10000,
    deadline: "2026-08-01",
    milestones: [10000, 20000, 30000, 40000],
    variant: 'pink' as const
  }
];

// --- LOGIC HELPERS ---
const calculateHealth = (saved: number, target: number) => {
  const progress = (saved / target) * 100;
  if (progress >= 100) return { label: 'Achieved', color: 'text-green-400', icon: <CheckCircle2 size={14} /> };
  if (progress > 50) return { label: 'On Track', color: 'text-primary', icon: <CheckCircle2 size={14} /> };
  if (progress > 20) return { label: 'Slightly Behind', color: 'text-yellow-400', icon: <AlertCircle size={14} /> };
  return { label: 'High Risk', color: 'text-red-400', icon: <AlertCircle size={14} /> };
};

const calculatePrediction = (saved: number, target: number) => {
  const remaining = target - saved;
  const avgMonthly = 5000; // Simulated average
  const monthsLeft = Math.ceil(remaining / avgMonthly);
  return monthsLeft > 0 ? monthsLeft : 0;
};

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background p-6 md:p-10 neon-grid">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter">COMMAND <span className="neon-text-cyan">CENTER</span></h1>
            <p className="text-muted-foreground font-mono text-sm">SYSTEM STATUS: OPTIMAL // USER: COMMANDER</p>
          </div>
          <NeonButton variant="cyan" size="sm" className="flex gap-2">
            <Plus size={18} /> NEW OBJECTIVE
          </NeonButton>
        </header>

        {/* 1. FINANCIAL SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard icon={<Target className="text-primary" />} label="Total Goals" value={SUMMARY_DATA.totalGoals} variant="cyan" />
          <StatCard icon={<CheckCircle2 className="text-green-400" />} label="Goals Achieved" value={SUMMARY_DATA.goalsAchieved} variant="purple" />
          <StatCard icon={<Wallet className="text-secondary" />} label="Total Saved" value={`₹${SUMMARY_DATA.totalSaved.toLocaleString()}`} variant="pink" />
          <StatCard icon={<TrendingUp className="text-primary" />} label="Saved This Month" value={`₹${SUMMARY_DATA.savedThisMonth.toLocaleString()}`} variant="cyan" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* 2, 3, 4, 6. GOAL PROGRESS SECTION */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="text-primary" />
              <h2 className="text-2xl font-black text-white">ACTIVE OBJECTIVES</h2>
            </div>
            
            {GOALS.map((goal) => (
              <GoalDetailCard key={goal.id} goal={goal} />
            ))}

            {/* 5. SAVINGS GROWTH CHART */}
            <div className="mt-12">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="text-secondary" />
                <h2 className="text-2xl font-black text-white">SAVINGS GROWTH</h2>
              </div>
              <NeonCard variant="pink" className="h-[400px] w-full p-8">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={SAVINGS_HISTORY}>
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF00FF" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#FF00FF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis dataKey="month" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0D0D0D', border: '1px solid #FF00FF', borderRadius: '8px' }}
                      itemStyle={{ color: '#FF00FF' }}
                    />
                    <Area type="monotone" dataKey="amount" stroke="#FF00FF" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                  </AreaChart>
                </ResponsiveContainer>
              </NeonCard>
            </div>
          </div>

          {/* SIDEBAR INSIGHTS */}
          <div className="space-y-8">
            <NeonCard variant="cyan" className="p-6">
              <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                <Clock className="text-primary" size={20} />
                SYSTEM PREDICTIONS
              </h3>
              <div className="space-y-4">
                {GOALS.filter(g => g.saved < g.target).map(goal => (
                  <div key={goal.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-xs text-muted-foreground uppercase font-bold mb-1">{goal.name}</p>
                    <p className="text-sm text-white">
                      At current rate: <span className="text-primary font-bold">{calculatePrediction(goal.saved, goal.target)} months</span> to reach target.
                    </p>
                  </div>
                ))}
              </div>
            </NeonCard>

            <NeonCard variant="purple" className="p-6">
              <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                <Calendar className="text-accent" size={20} />
                UPCOMING DEADLINES
              </h3>
              <div className="space-y-4">
                {GOALS.map(goal => (
                  <div key={goal.id} className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{goal.name}</span>
                    <span className="text-xs font-mono text-white bg-white/10 px-2 py-1 rounded">{goal.deadline}</span>
                  </div>
                ))}
              </div>
            </NeonCard>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, variant }: any) => (
  <NeonCard variant={variant} className="flex items-center gap-5 p-6">
    <div className="p-4 rounded-xl bg-white/5 border border-white/10">{icon}</div>
    <div>
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
      <p className="text-3xl font-black text-white">{value}</p>
    </div>
  </NeonCard>
);

const GoalDetailCard = ({ goal }: { goal: any }) => {
  const progress = Math.round((goal.saved / goal.target) * 100);
  const remaining = goal.target - goal.saved;
  const health = calculateHealth(goal.saved, goal.target);
  const color = goal.variant === 'cyan' ? '#00F5FF' : goal.variant === 'pink' ? '#FF00FF' : '#7C3AED';

  return (
    <NeonCard variant={goal.variant} className="p-8">
      <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">{goal.name}</h3>
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase ${health.color}`}>
              {health.icon} {health.label}
            </div>
          </div>
          <p className="text-muted-foreground font-mono text-sm">TARGET: ₹{goal.target.toLocaleString()} | REMAINING: ₹{remaining.toLocaleString()}</p>
        </div>
        
        <div className="text-right">
          <div className="text-4xl font-black" style={{ color }}>{progress}%</div>
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Current Progress</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-4 bg-white/5 rounded-full overflow-hidden mb-8 border border-white/10">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ 
            backgroundColor: color, 
            boxShadow: `0 0 20px ${color}80` 
          }}
        />
      </div>

      {/* Milestones */}
      <div className="space-y-4">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Milestone Tracking</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {goal.milestones.map((m: number, idx: number) => {
            const isAchieved = goal.saved >= m;
            return (
              <div key={idx} className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${isAchieved ? 'bg-white/10 border-primary/50' : 'bg-black/20 border-white/5 opacity-40'}`}>
                {isAchieved ? <CheckCircle2 size={16} className="text-primary" /> : <div className="w-4 h-4 rounded-full border-2 border-white/20" />}
                <span className={`text-xs font-bold ${isAchieved ? 'text-white' : 'text-muted-foreground'}`}>₹{m.toLocaleString()}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prediction Widget */}
      {progress < 100 && (
        <div className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg text-primary"><Clock size={18} /></div>
            <p className="text-sm text-white">
              At your current saving rate, you will reach your goal in <span className="font-black text-primary">{calculatePrediction(goal.saved, goal.target)} months</span>.
            </p>
          </div>
          <NeonButton variant="cyan" size="sm" className="text-[10px] py-1 px-3">OPTIMIZE PLAN</NeonButton>
        </div>
      )}
    </NeonCard>
  );
};

export default Dashboard;