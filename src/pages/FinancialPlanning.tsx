import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import NeonCard from '@/components/NeonCard';
import { goalService } from '@/services/goalService';
import { showError } from '@/utils/toast';
import { Loader2, Calculator, ArrowRight, Info } from 'lucide-react';

const FinancialPlanning = () => {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await goalService.fetchGoals();
        setGoals(data);
      } catch (error: any) {
        showError(error.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center neon-grid">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-10 neon-grid">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-white tracking-tighter">
            FINANCIAL <span className="neon-text-pink">PLANNING</span>
          </h1>
          <p className="text-muted-foreground font-mono text-sm">STRATEGIC ALLOCATION // SAVINGS OPTIMIZATION</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {goals.map((goal) => {
            const remaining = goal.target - goal.current_savings;
            const progress = Math.round((goal.current_savings / goal.target) * 100);
            const monthlyNeeded = Math.ceil(remaining / goal.timeframe);
            const weeklyNeeded = Math.ceil(monthlyNeeded / 4);

            return (
              <NeonCard key={goal.id} variant="pink" className="flex flex-col md:flex-row gap-8 items-center">
                <div className="relative w-40 h-40 shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-white/5"
                    />
                    <motion.circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={440}
                      initial={{ strokeDashoffset: 440 }}
                      animate={{ strokeDashoffset: 440 - (440 * progress) / 100 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="text-secondary"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-white">{progress}%</span>
                    <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Complete</span>
                  </div>
                </div>

                <div className="flex-1 space-y-6 w-full">
                  <div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-1">{goal.objective_name}</h3>
                    <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                      <span>TARGET: ₹{goal.target.toLocaleString()}</span>
                      <ArrowRight size={12} />
                      <span>SAVED: ₹{goal.current_savings.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">Monthly Saving</p>
                      <p className="text-xl font-black text-white">₹{monthlyNeeded.toLocaleString()}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">Weekly Saving</p>
                      <p className="text-xl font-black text-white">₹{weeklyNeeded.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-3 rounded-lg bg-secondary/5 border border-secondary/20">
                    <Info size={14} className="text-secondary shrink-0 mt-0.5" />
                    <p className="text-[10px] text-white/70 leading-relaxed">
                      To reach your goal in <span className="text-secondary font-bold">{goal.timeframe} months</span>, you need to maintain a consistent saving rate of ₹{monthlyNeeded.toLocaleString()} per month.
                    </p>
                  </div>
                </div>
              </NeonCard>
            );
          })}
        </div>

        {goals.length === 0 && (
          <NeonCard className="text-center py-20">
            <Calculator className="mx-auto mb-4 text-muted-foreground opacity-20" size={64} />
            <p className="text-muted-foreground font-mono">NO DATA AVAILABLE FOR PLANNING.</p>
          </NeonCard>
        )}
      </div>
    </div>
  );
};

export default FinancialPlanning;