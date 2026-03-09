import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import NeonButton from '@/components/NeonButton';
import { 
  Target, 
  Activity, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Instagram, 
  Twitter, 
  Linkedin,
  LayoutDashboard,
  PieChart,
  Zap
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary/30">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/5 px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <img src="/src/assets/logo.png" alt="SmartSaver Logo" className="h-10 w-auto" />
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-sm font-bold hover:text-primary transition-colors">HOME</button>
            <button onClick={() => scrollToSection('features')} className="text-sm font-bold hover:text-primary transition-colors">FEATURES</button>
            <button onClick={() => navigate('/dashboard')} className="text-sm font-bold hover:text-primary transition-colors">DASHBOARD</button>
            <button onClick={() => scrollToSection('contact')} className="text-sm font-bold hover:text-primary transition-colors">CONTACT</button>
          </div>

          <div className="flex items-center gap-4">
            <NeonButton variant="cyan" size="sm" onClick={() => navigate('/auth')}>
              LOGIN
            </NeonButton>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden neon-grid">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tighter">
              TRACK YOUR <br />
              <span className="neon-text-cyan">FINANCIAL GOALS</span> <br />
              <span className="neon-text-pink">SMARTLY</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed">
              Take control of your future with our AI-powered tracking system. Monitor savings, analyze spending, and reach your milestones faster than ever.
            </p>
            <div className="flex flex-wrap gap-4">
              <NeonButton size="lg" onClick={() => navigate('/auth')}>
                GET STARTED
              </NeonButton>
              <NeonButton variant="purple" size="lg" onClick={() => scrollToSection('features')}>
                LEARN MORE
              </NeonButton>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full animate-pulse" />
            <img 
              src="/src/assets/hero-image.png" 
              alt="Financial Goal Tracking Illustration" 
              className="relative z-10 w-full max-w-2xl mx-auto drop-shadow-[0_0_50px_rgba(0,245,255,0.3)]"
            />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-black/40">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4 tracking-tight">POWERFUL <span className="neon-text-cyan">CAPABILITIES</span></h2>
            <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Target className="text-primary" size={32} />}
              title="Goal Tracking"
              description="Set specific financial targets and watch your progress grow in real-time."
              delay={0.1}
            />
            <FeatureCard 
              icon={<Activity className="text-secondary" size={32} />}
              title="Progress Monitoring"
              description="Visual indicators and milestones keep you motivated on your journey."
              delay={0.2}
            />
            <FeatureCard 
              icon={<PieChart className="text-accent" size={32} />}
              title="Financial Planning"
              description="Smart allocation tools help you distribute resources effectively."
              delay={0.3}
            />
            <FeatureCard 
              icon={<LayoutDashboard className="text-primary" size={32} />}
              title="Smart Dashboard"
              description="A centralized command center for all your financial data and insights."
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="glass-card p-12 rounded-3xl border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5"><Zap size={200} /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-black mb-6">GET IN <span className="neon-text-pink">TOUCH</span></h2>
                <p className="text-muted-foreground mb-8">Have questions about our system? Our support team is available 24/7 to assist you.</p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary"><Mail size={20} /></div>
                    <span className="font-mono">support@smartsaver.ai</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-secondary/10 text-secondary"><Phone size={20} /></div>
                    <span className="font-mono">+1 (555) NEON-SAVER</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <input type="text" placeholder="NAME" className="w-full bg-black/50 border border-white/10 rounded-xl px-6 py-4 focus:border-primary outline-none transition-all" />
                <input type="email" placeholder="EMAIL" className="w-full bg-black/50 border border-white/10 rounded-xl px-6 py-4 focus:border-primary outline-none transition-all" />
                <textarea placeholder="MESSAGE" rows={4} className="w-full bg-black/50 border border-white/10 rounded-xl px-6 py-4 focus:border-primary outline-none transition-all resize-none"></textarea>
                <NeonButton className="w-full py-4">SEND TRANSMISSION</NeonButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 bg-black/60">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
            <img src="/src/assets/logo.png" alt="SmartSaver Logo" className="h-8 w-auto opacity-80" />
            
            <div className="flex gap-6">
              <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary transition-all"><Instagram size={20} /></a>
              <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary transition-all"><Twitter size={20} /></a>
              <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary transition-all"><Linkedin size={20} /></a>
            </div>
          </div>
          
          <div className="text-center text-sm text-muted-foreground font-mono">
            <p>© 2026 SmartSaver. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -10 }}
    className="glass-card p-8 rounded-2xl border-white/5 hover:border-primary/30 transition-all group"
  >
    <div className="mb-6 p-4 rounded-xl bg-white/5 w-fit group-hover:bg-white/10 transition-colors">{icon}</div>
    <h3 className="text-xl font-bold mb-3 text-white tracking-tight">{title}</h3>
    <p className="text-muted-foreground leading-relaxed">{description}</p>
  </motion.div>
);

export default Landing;