import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import NeonButton from '@/components/NeonButton';
import { supabase } from '@/integrations/supabase/client';
import { showSuccess, showError } from '@/utils/toast';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { 
  Target, 
  Activity, 
  Mail, 
  Phone, 
  Instagram, 
  Twitter, 
  Linkedin,
  Github,
  LayoutDashboard,
  Zap,
  Loader2,
  ChevronRight,
  MapPin
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([
          { 
            name: contactForm.name, 
            email: contactForm.email, 
            message: contactForm.message 
          }
        ]);

      if (error) throw error;

      showSuccess('Transmission received. We will contact you shortly.');
      setContactForm({ name: '', email: '', message: '' });
    } catch (error: any) {
      showError('System Error: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary/30">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/5 px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <img src="/src/assets/logo.png" alt="SmartSaver Logo" className="h-16 w-auto" />
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-sm font-bold hover:text-primary transition-colors">HOME</button>
            <button onClick={() => scrollToSection('features')} className="text-sm font-bold hover:text-primary transition-colors">FEATURES</button>
            <button onClick={() => navigate('/progress')} className="text-sm font-bold hover:text-primary transition-colors">PROGRESS MONITORING</button>
            <button onClick={() => navigate('/dashboard')} className="text-sm font-bold hover:text-primary transition-colors">SMART DASHBOARD</button>
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
      <section className="relative pt-40 pb-20 px-6 overflow-hidden neon-grid">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Target className="text-primary" size={32} />}
              title="Goal Tracking"
              description="Set specific financial targets and watch your progress grow in real-time."
              delay={0.1}
              onClick={() => navigate('/dashboard')}
            />
            <FeatureCard 
              icon={<Activity className="text-secondary" size={32} />}
              title="Progress Monitoring"
              description="Visual indicators, risk analysis, and milestone tracking to keep you on course."
              delay={0.2}
              onClick={() => navigate('/progress')}
            />
            <FeatureCard 
              icon={<LayoutDashboard className="text-accent" size={32} />}
              title="Smart Dashboard"
              description="Advanced analytics, trend analysis, and AI-powered predictions for your wealth."
              delay={0.3}
              onClick={() => navigate('/dashboard')}
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
              
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <input 
                  type="text" 
                  placeholder="NAME" 
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-6 py-4 focus:border-primary outline-none transition-all" 
                />
                <input 
                  type="email" 
                  placeholder="EMAIL" 
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-6 py-4 focus:border-primary outline-none transition-all" 
                />
                <textarea 
                  placeholder="MESSAGE" 
                  required
                  rows={4} 
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-6 py-4 focus:border-primary outline-none transition-all resize-none"
                ></textarea>
                <NeonButton 
                  type="submit" 
                  className="w-full py-4"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : 'SEND TRANSMISSION'}
                </NeonButton>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Redesigned Footer */}
      <footer className="relative pt-20 pb-10 px-6 border-t border-white/5 bg-black/80 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand Column */}
            <div className="space-y-6">
              <img src="/src/assets/logo.png" alt="SmartSaver Logo" className="h-20 w-auto" />
              <p className="text-muted-foreground leading-relaxed">
                The next generation of financial intelligence. Track, analyze, and achieve your goals with AI-powered precision.
              </p>
              <div className="flex gap-4">
                <SocialIcon icon={<Twitter size={18} />} href="#" />
                <SocialIcon icon={<Github size={18} />} href="#" />
                <SocialIcon icon={<Linkedin size={18} />} href="#" />
                <SocialIcon icon={<Instagram size={18} />} href="#" />
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-black mb-8 tracking-widest uppercase text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full" /> QUICK LINKS
              </h4>
              <ul className="space-y-4">
                <FooterLink label="Home" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
                <FooterLink label="Features" onClick={() => scrollToSection('features')} />
                <FooterLink label="Goal Tracking" onClick={() => navigate('/dashboard')} />
                <FooterLink label="Smart Dashboard" onClick={() => navigate('/dashboard')} />
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-white font-black mb-8 tracking-widest uppercase text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-secondary rounded-full" /> SERVICES
              </h4>
              <ul className="space-y-4">
                <FooterLink label="Progress Monitoring" onClick={() => navigate('/progress')} />
                <FooterLink label="AI Analysis" onClick={() => navigate('/dashboard')} />
                <FooterLink label="Trend Prediction" onClick={() => navigate('/dashboard')} />
                <FooterLink label="Milestone Tracking" onClick={() => navigate('/progress')} />
              </ul>
            </div>

            {/* Contact Us */}
            <div>
              <h4 className="text-white font-black mb-8 tracking-widest uppercase text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full" /> CONTACT US
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-muted-foreground text-sm">
                  <MapPin size={18} className="text-primary shrink-0" />
                  <span>Cyber City, Sector 24, <br />Neo Delhi, 110001</span>
                </li>
                <li className="flex items-center gap-3 text-muted-foreground text-sm">
                  <Phone size={18} className="text-secondary shrink-0" />
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-center gap-3 text-muted-foreground text-sm">
                  <Mail size={18} className="text-accent shrink-0" />
                  <span>hello@smartsaver.ai</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground font-mono">
              © 2026 SMARTSAVER INC. ALL SYSTEMS OPERATIONAL.
            </p>
            <div className="flex gap-6 text-[10px] font-bold text-muted-foreground tracking-widest">
              <a href="#" className="hover:text-primary transition-colors">PRIVACY POLICY</a>
              <a href="#" className="hover:text-primary transition-colors">TERMS OF SERVICE</a>
              <a href="#" className="hover:text-primary transition-colors">COOKIE SETTINGS</a>
            </div>
            <MadeWithDyad />
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, delay, onClick }: { icon: React.ReactNode, title: string, description: string, delay: number, onClick?: () => void }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -10 }}
    onClick={onClick}
    className={`glass-card p-8 rounded-2xl border-white/5 hover:border-primary/30 transition-all group ${onClick ? 'cursor-pointer' : ''}`}
  >
    <div className="mb-6 p-4 rounded-xl bg-white/5 w-fit group-hover:bg-white/10 transition-colors">{icon}</div>
    <h3 className="text-xl font-bold mb-3 text-white tracking-tight">{title}</h3>
    <p className="text-muted-foreground leading-relaxed">{description}</p>
  </motion.div>
);

const FooterLink = ({ label, onClick }: { label: string, onClick: () => void }) => (
  <li>
    <button 
      onClick={onClick}
      className="text-muted-foreground hover:text-primary text-sm transition-all flex items-center gap-2 group"
    >
      <ChevronRight size={12} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
      {label}
    </button>
  </li>
);

const SocialIcon = ({ icon, href }: { icon: React.ReactNode, href: string }) => (
  <a 
    href={href} 
    className="p-2.5 rounded-lg bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-primary/10 hover:text-primary transition-all"
  >
    {icon}
  </a>
);

export default Landing;