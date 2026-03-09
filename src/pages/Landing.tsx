import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import NeonButton from '@/components/NeonButton';
import { TrendingUp, Target, Brain, ShieldCheck } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden neon-grid">
      {/* Hero Section */}
      <div className="container mx-auto px-6 pt-32 pb-20 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter">
            <span className="neon-text-cyan">FINANCIAL</span> <br />
            <span className="text-white">FUTURE</span> <span className="neon-text-pink">AI</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Track goals, analyze spending, and get AI-powered advice in a futuristic neon ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <NeonButton size="lg" onClick={() => navigate('/auth')}>
              GET STARTED
            </NeonButton>
            <NeonButton variant="pink" size="lg" onClick={() => navigate('/auth')}>
              VIEW DEMO
            </NeonButton>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Target className="text-primary" size={32} />}
            title="Goal Tracking"
            description="Set and monitor your financial milestones with real-time progress visualization."
          />
          <FeatureCard 
            icon={<TrendingUp className="text-secondary" size={32} />}
            title="Expense Analytics"
            description="Deep dive into your spending habits with interactive neon charts and insights."
          />
          <FeatureCard 
            icon={<Brain className="text-accent" size={32} />}
            title="AI Advisor"
            description="Receive personalized financial recommendations powered by advanced AI models."
          />
        </div>
      </div>

      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full" />
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <motion.div 
    whileHover={{ scale: 1.05 }}
    className="glass-card p-8 rounded-2xl border-white/5 hover:border-primary/30 transition-all"
  >
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </motion.div>
);

export default Landing;