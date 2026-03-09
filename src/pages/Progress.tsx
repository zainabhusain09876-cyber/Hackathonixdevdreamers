import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NeonCard from '@/components/NeonCard';
import { Target, TrendingUp, AlertCircle, CheckCircle2, Calendar, ArrowRight, Loader2, Trophy } from 'lucide-react';
import { goalService } from '@/services/goalService';
import { showError } from '@/utils/toast';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const Progress = () => {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);

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

  // Prepare chart data
  const chartData = transactions.reduce((acc: any[], tx: any) => {
    const date = new Date(tx.created_at).toLocaleDateString('en-US', { month: 'short' });
    const existing = acc.find(d => d.name === date);
    if (existing) {
      existing.amount += tx.amount;
    } else {
      acc.push({ name: date, amount: tx.amount });
    }
    return acc;
  }, []).reverse();

  return (
    <div className="min-h-screen bg-background p-6 md:p-10 neon-grid">
      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-white tracking-tighter">
            PROGRESS <span className="neon-text-cyan">MONITORING</span>
          </h1>
          <p className="text-muted-foreground font-mono text-sm">REAL-TIME TRACKING // RISK ANALYSIS // MILESTONES</p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-primary" size={48} />
            <p className="text-primary font-mono animate-pulse">CALCULATING TRAJECTORIES...</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Goal Progress Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <AnimatePresence>
                {goals.map((goal, index) => (
                  <GoalProgressCard 
                    key={goal.id} 
                    goal={goal} 
                    variant={index % 2 === 0 ? 'cyan' : 'pink'} 
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Savings Growth Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <NeonCard className="lg:col-span-2">
                <h3 className="text-xs font-black text-primary mb-8 tracking-widest uppercase flex items-center gap-2">
                  <TrendingUp size={16} /> SAVINGS GROWTH TRAJECTORY
                </h3>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                      <XAxis dataKey="name" stroke="#444" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#444" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid rgba(0,245,255,0.3)', borderRadius: '12px' }}
                        itemStyle={{ color: '#00F5FF' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="#00F5FF" 
                        strokeWidth={4} 
                        dot={{ fill: '#00F5FF', r: 6, strokeWidth: 2, stroke: '#000' }} 
                        activeDot={{ r: 8, stroke: '#fff', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </NeonCard>

              <div className="space-y-6">
                <PerformanceCard 
                  label="AVERAGE MONTHLY SAVING" 
                  value={`₹${Math.round(chartData.reduce((a, b) => a + b.amount, 0) / (chartData.length || 1)).toLocaleString()}`}
                  variant="cyan"
                />
                <PerformanceCard 
                  label="BEST SAVING MONTH" 
                  value={chartData.length > 0 ? `₹${Math.max(...chartData.map(d => d.amount)).toLocaleString()}` : '₹0'}
                  variant="pink"
                />
                <PerformanceCard 
                  label="LOWEST SAVING MONTH" 
                  value={chartData.length > 0 ? `₹${Math.min(...chartData.map(d => d.amount)).toLocaleString()}` : '₹0'}
                  variant="purple"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const GoalProgressCard = ({ goal, variant }: any) => {
  const target = goal.target || 1;
  const saved = goal.current_savings || 0;
  const remaining = Math.max(0, target - saved);
  const progress = Math.min(100, Math.round((saved / target) * 100));
  
  // Risk Calculation
  const createdAt = new Date(goal.created_at);
  const now = new Date();
  const monthsPassed = Math.max(1, (now.getFullYear() - createdAt.getFullYear()) * 12 + now.getMonth() - createdAt.getMonth());
  const expectedPerMonth = target / (goal.timeframe || 1);
  const expectedCurrent = expectedPerMonth * monthsPassed;
  
  let status = { label: 'ON TRACK', color: 'text-green-400', bg: 'bg-green-400/10', icon: <CheckCircle2 size={14} /> };
  if (saved < expectedCurrent * 0.7) {
    status = { label: 'HIGH RISK', color: 'text-red-400', bg: 'bg-red-400/10', icon: <AlertCircle size={14} /> };
  } else if (saved < expectedCurrent) {
    status = { label: 'SLIGHTLY BEHIND', color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: <AlertCircle size={14} /> };
  }

  // Milestones
  const milestones = [
    { label: '20%', value: target * 0.2 },
    { label: '50%', value: target * 0.5 },
    { label: '80%', value: target * 0.8 },
    { label: '100%', value: target }
  ];

  return (
    <NeonCard variant={variant} className="relative overflow-hidden">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-2xl font-black text-white tracking-tight uppercase">{goal.objective_name}</h3>
          <div className="flex items-center gap-3 mt-2">
            <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${status.bg} ${status.color}`}>
              {status.icon} {status.label}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
              <Calendar size={12} /> DEADLINE: {new Date(createdAt.setMonth(createdAt.getMonth() + goal.timeframe)).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black neon-text-cyan">{progress}%</p>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">COMPLETED</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatItem label="TARGET" value={`₹${target.toLocaleString()}`} />
        <StatItem label="SAVED" value={`₹${saved.toLocaleString()}`} />
        <StatItem label="REMAINING" value={`₹${remaining.toLocaleString()}`} />
      </div>

      {/* Progress Bar */}
      <div className="relative h-3 bg-white/5 rounded-full overflow-hidden mb-10">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: "circOut" }}
          className="h-full bg-primary shadow-[0_0_15px_rgba(0,245,255,0.5)]"
        />
      </div>

      {/* Milestones */}
      <div className="space-y-4">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">MILESTONE TRACKER</p>
        <div className="flex justify-between relative">
          <div className="absolute top-1/2 left-0 w-full h-px bg-white/10 -translate-y-1/2" />
          {milestones.map((m, i) => {
            const isReached = saved >= m.value;
            return (
              <div key={i} className="relative z-10 flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${isReached ? 'bg-primary border-primary shadow-[0_0_10px_rgba(0,245,255,0.5)]' : 'bg-black border-white/10'}`}>
                  {isReached ? <Trophy size={14} className="text-black" /> : <span className="text-[10px] font-bold text-white/20">{m.label}</span>}
                </div>
                {isReached && (
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -top-6 text-[8px] font-black text-primary whitespace-nowrap"
                  >
                    🎉 REACHED!
                  </motion.span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </NeonCard>
  );
};

const StatItem = ({ label, value }: any) => (
  <div>
    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
    <p className="text-sm font-black text-white">{value}</p>
  </div>
);

const PerformanceCard = ({ label, value, variant }: any) => (
  <NeonCard variant={variant} className="py-4">
    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
    <p className="text-xl font-black text-white">{value}</p>
  </NeonCard>
);

export default Progress;