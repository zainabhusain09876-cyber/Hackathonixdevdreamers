import React from 'react';
import { motion } from 'framer-motion';
import NeonCard from '@/components/NeonCard';
import { Wallet, TrendingDown, Target, Activity, Plus } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import NeonButton from '@/components/NeonButton';

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
  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-white">DASHBOARD</h1>
            <p className="text-muted-foreground">Welcome back, Commander.</p>
          </div>
          <NeonButton variant="cyan" size="sm" className="flex gap-2">
            <Plus size={18} /> NEW GOAL
          </NeonButton>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard icon={<Wallet className="text-primary" />} label="TOTAL SAVINGS" value="₹1,24,500" variant="cyan" />
          <StatCard icon={<TrendingDown className="text-secondary" />} label="MONTHLY EXPENSES" value="₹12,400" variant="pink" />
          <StatCard icon={<Target className="text-accent" />} label="ACTIVE GOALS" value="4" variant="purple" />
          <StatCard icon={<Activity className="text-primary" />} label="HEALTH SCORE" value="85%" variant="cyan" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Goals Section */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-white mb-4">ACTIVE GOALS</h2>
            <GoalProgressCard title="Buy Laptop" saved={35000} target={80000} deadline="6 Months" />
            <GoalProgressCard title="Travel Fund" saved={15000} target={50000} deadline="3 Months" variant="pink" />
            <GoalProgressCard title="Emergency Fund" saved={20000} target={100000} deadline="12 Months" variant="purple" />
          </div>

          {/* Charts Section */}
          <div className="space-y-8">
            <NeonCard title="EXPENSE CATEGORIES">
              <h3 className="text-sm font-bold text-muted-foreground mb-4">EXPENSE CATEGORIES</h3>
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
                      contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </NeonCard>

            <NeonCard variant="pink">
              <h3 className="text-sm font-bold text-muted-foreground mb-4">SAVINGS TREND</h3>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData}>
                    <XAxis dataKey="name" stroke="#666" fontSize={12} />
                    <YAxis stroke="#666" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                    />
                    <Line type="monotone" dataKey="savings" stroke="#FF00FF" strokeWidth={3} dot={{ fill: '#FF00FF' }} />
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
  <NeonCard variant={variant} className="flex items-center gap-4">
    <div className="p-3 rounded-lg bg-white/5">{icon}</div>
    <div>
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-black text-white">{value}</p>
    </div>
  </NeonCard>
);

const GoalProgressCard = ({ title, saved, target, deadline, variant = 'cyan' }: any) => {
  const progress = Math.round((saved / target) * 100);
  const color = variant === 'cyan' ? '#00F5FF' : variant === 'pink' ? '#FF00FF' : '#7C3AED';

  return (
    <NeonCard variant={variant}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <p className="text-sm text-muted-foreground">Deadline: {deadline}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-black" style={{ color }}>{progress}%</p>
          <p className="text-xs text-muted-foreground">₹{saved.toLocaleString()} / ₹{target.toLocaleString()}</p>
        </div>
      </div>
      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full shadow-[0_0_10px_rgba(0,245,255,0.5)]"
          style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
        />
      </div>
    </NeonCard>
  );
};

export default Dashboard;