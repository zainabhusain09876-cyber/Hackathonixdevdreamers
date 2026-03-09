import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import NeonCard from '@/components/NeonCard';
import { goalService } from '@/services/goalService';
import { showError } from '@/utils/toast';
import { Loader2, Target, CheckCircle2, Activity, Wallet, Clock } from 'lucide-react';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const SmartDashboard = () => {
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

  const stats = {
    total: goals.length,
    active: goals.filter(g => g.current_savings < g.target).length,
    completed: goals.filter(g => g.current_savings >= g.target).length,
    totalSaved: goals.reduce((acc, g) => acc + g.current_savings, 0)
  };

  const getComparisonData = () => {
    return {
      labels: goals.map(g => g.objective_name),
      datasets: [
        {
          label: 'Progress (%)',
          data: goals.map(g => Math.round((g.current_savings / g.target) * 100)),
          backgroundColor: goals.map((_, i) => 
            i % 3 === 0 ? 'rgba(0, 245, 255, 0.6)' : 
            i % 3 === 1 ? 'rgba(255, 0, 255, 0.6)' : 
            'rgba(124, 58, 237, 0.6)'
          ),
          borderColor: goals.map((_, i) => 
            i % 3 === 0 ? '#00F5FF' : 
            i % 3 === 1 ? '#FF00FF' : 
            '#7C3AED'
          ),
          borderWidth: 1,
          borderRadius: 8,
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        padding: 12,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
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
            SMART <span className="neon-text-cyan">DASHBOARD</span>
          </h1>
          <p className="text-muted-foreground font-mono text-sm">CENTRAL COMMAND // FINANCIAL INTELLIGENCE</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard icon={<Target className="text-primary" />} label="Total Goals" value={stats.total} variant="cyan" />
          <StatCard icon={<Activity className="text-secondary" />} label="Active Goals" value={stats.active} variant="pink" />
          <StatCard icon={<CheckCircle2 className="text-accent" />} label="Completed" value={stats.completed} variant="purple" />
          <StatCard icon={<Wallet className="text-primary" />} label="Total Saved" value={`₹${stats.totalSaved.toLocaleString()}`} variant="cyan" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <NeonCard className="lg:col-span-2">
            <h3 className="text-xs font-black text-primary mb-8 tracking-widest uppercase">Goal Progress Comparison</h3>
            <div className="h-[350px] w-full">
              <Bar data={getComparisonData()} options={chartOptions} />
            </div>
          </NeonCard>

          <NeonCard variant="pink">
            <h3 className="text-xs font-black text-secondary mb-8 tracking-widest uppercase">Recent Activity</h3>
            <div className="space-y-6">
              {transactions.slice(0, 6).map((t) => (
                <div key={t.id} className="flex items-start gap-4 group">
                  <div className="p-2 rounded-lg bg-white/5 group-hover:bg-secondary/20 transition-colors">
                    <Clock size={16} className="text-secondary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">₹{t.amount.toLocaleString()} added</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t.goals?.objective_name || 'Goal'}</p>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {new Date(t.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              ))}
              {transactions.length === 0 && (
                <p className="text-center text-xs text-muted-foreground font-mono py-10">NO RECENT ACTIVITY DETECTED.</p>
              )}
            </div>
          </NeonCard>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, variant }: any) => (
  <NeonCard variant={variant} className="flex items-center gap-4">
    <div className="p-3 rounded-lg bg-white/5">{icon}</div>
    <div>
      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-black text-white tracking-tight">{value}</p>
    </div>
  </NeonCard>
);

export default SmartDashboard;