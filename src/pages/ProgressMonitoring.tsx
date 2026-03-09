import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import NeonCard from '@/components/NeonCard';
import { goalService } from '@/services/goalService';
import { showError } from '@/utils/toast';
import { Loader2, TrendingUp, Calendar } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ProgressMonitoring = () => {
  const [goals, setGoals] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [goalsData, transData] = await Promise.all([
          goalService.fetchGoals(),
          goalService.fetchTransactions()
        ]);
        setGoals(goalsData);
        setTransactions(transData);
      } catch (error: any) {
        showError(error.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getGrowthData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonth = new Date().getMonth();
    const labels = months.slice(0, currentMonth + 1);
    
    const monthlySavings = new Array(labels.length).fill(0);
    
    transactions.forEach(t => {
      const date = new Date(t.created_at);
      const monthIndex = date.getMonth();
      if (monthIndex <= currentMonth) {
        monthlySavings[monthIndex] += t.amount;
      }
    });

    // Cumulative growth
    let cumulative = 0;
    const growth = monthlySavings.map(val => {
      cumulative += val;
      return cumulative;
    });

    return {
      labels,
      datasets: [
        {
          label: 'Total Savings Growth (₹)',
          data: growth,
          borderColor: '#00F5FF',
          backgroundColor: 'rgba(0, 245, 255, 0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#00F5FF',
          pointBorderColor: '#fff',
          pointHoverRadius: 6,
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 14, weight: 'bold' as const },
        bodyFont: { size: 13 },
        padding: 12,
        borderColor: 'rgba(0, 245, 255, 0.3)',
        borderWidth: 1,
      }
    },
    scales: {
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#888', font: { family: 'monospace' } }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#888', font: { family: 'monospace' } }
      }
    }
  };

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
            PROGRESS <span className="neon-text-cyan">MONITORING</span>
          </h1>
          <p className="text-muted-foreground font-mono text-sm">REAL-TIME DATA STREAM // GOAL TRACKING ANALYTICS</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {goals.map((goal) => {
            const progress = Math.round((goal.current_savings / goal.target) * 100);
            const remaining = goal.target - goal.current_savings;
            const deadline = new Date(goal.created_at);
            deadline.setMonth(deadline.getMonth() + goal.timeframe);

            return (
              <NeonCard key={goal.id} className="relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">{goal.objective_name}</h3>
                  <span className="text-2xl font-black neon-text-cyan">{progress}%</span>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Target</p>
                      <p className="text-lg font-black text-white">₹{goal.target.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Saved</p>
                      <p className="text-lg font-black text-primary">₹{goal.current_savings.toLocaleString()}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Remaining</p>
                    <p className="text-lg font-black text-secondary">₹{remaining.toLocaleString()}</p>
                  </div>

                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-primary shadow-[0_0_10px_rgba(0,245,255,0.5)]"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                    <Calendar size={14} />
                    <span>DEADLINE: {deadline.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              </NeonCard>
            );
          })}
        </div>

        <NeonCard variant="cyan" className="p-8">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="text-primary" />
            <h2 className="text-xl font-black text-white tracking-widest uppercase">Savings Growth Projection</h2>
          </div>
          <div className="h-[400px] w-full">
            <Line data={getGrowthData()} options={chartOptions} />
          </div>
        </NeonCard>
      </div>
    </div>
  );
};

export default ProgressMonitoring;