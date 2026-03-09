import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import NeonButton from '@/components/NeonButton';
import { supabase } from '@/lib/supabase';
import { showSuccess, showError } from '@/utils/toast';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        showSuccess('Welcome back!');
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        showSuccess('Check your email for the confirmation link!');
      }
      navigate('/dashboard');
    } catch (error: any) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center neon-grid p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-md p-8 rounded-2xl border-primary/20 shadow-[0_0_30px_rgba(0,245,255,0.1)]"
      >
        <h2 className="text-3xl font-black mb-6 text-center">
          {isLogin ? <span className="neon-text-cyan">LOGIN</span> : <span className="neon-text-pink">SIGN UP</span>}
        </h2>
        
        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">EMAIL ADDRESS</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-primary/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              placeholder="neon@future.ai"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">PASSWORD</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-primary/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          
          <NeonButton 
            type="submit" 
            className="w-full" 
            variant={isLogin ? 'cyan' : 'pink'}
            disabled={loading}
          >
            {loading ? 'PROCESSING...' : isLogin ? 'ENTER SYSTEM' : 'CREATE ACCOUNT'}
          </NeonButton>
        </form>

        <p className="mt-6 text-center text-muted-foreground">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:underline font-bold"
          >
            {isLogin ? 'SIGN UP' : 'LOGIN'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;