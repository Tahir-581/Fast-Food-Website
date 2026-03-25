'use client';

import React, { useState } from 'react';
import { X, Mail, Lock, Sparkles, Smartphone, Globe } from 'lucide-react';
import { useUIStore } from '@/lib/store/ui';
import { signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Input/Input';
import styles from './AuthDrawer.module.css';

const AuthDrawer = () => {
  const { isAuthOpen, setAuthOpen, showNotification } = useUIStore();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          setError('Authentication failed. Please verify your credentials.');
        } else {
          showNotification('success', 'Welcome back to the Studio.');
          setAuthOpen(false);
        }
      } else {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || 'Registration failed.');
        } else {
          showNotification('success', 'Studio account created. Welcome to the Circle.');
          setMode('login');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = () => setAuthOpen(false);

  return (
    <AnimatePresence>
      <div className={styles.overlay} onClick={handleOverlayClick}>
        <motion.div 
          className={styles.drawer} 
          onClick={(e) => e.stopPropagation()}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          <header className={styles.header}>
            <div className={styles.logoWrapper}>
              <Sparkles size={24} className={styles.sparkle} />
              <h2 className={styles.title}>{mode === 'login' ? 'Welcome Back' : 'Join the Forge'}</h2>
            </div>
            <button className={styles.closeBtn} onClick={() => setAuthOpen(false)}>
              <X size={24} />
            </button>
          </header>

          <div className={styles.content}>
            <p className={styles.subtitle}>
              {mode === 'login' 
                ? 'Enter your credentials to access your Studio.' 
                : 'Create an account to start earning sparks on every order.'}
            </p>

            {error && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={styles.errorBanner}>{error}</motion.div>}

            <div className={styles.socialGrid}>
              <button className={styles.socialBtn}>
                <Globe size={20} />
                <span>Google</span>
              </button>
              <button className={styles.socialBtn}>
                <Smartphone size={20} />
                <span>Apple</span>
              </button>
            </div>

            <div className={styles.divider}>
              <span>OR CONTINUE WITH EMAIL</span>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              {mode === 'signup' && (
                <div className={styles.inputGroup}>
                  <Sparkles size={18} className={styles.inputIcon} />
                  <Input 
                    type="text" 
                    placeholder="Full Name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    required
                  />
                </div>
              )}
              <div className={styles.inputGroup}>
                <Mail size={18} className={styles.inputIcon} />
                <Input 
                  type="email" 
                  placeholder="Email Address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <Lock size={18} className={styles.inputIcon} />
                <Input 
                  type="password" 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  required
                />
              </div>

              {mode === 'login' && (
                <button type="button" className={styles.forgotBtn}>Forgot password?</button>
              )}

              <Button 
                type="submit" 
                variant="primary" 
                size="lg" 
                fullWidth 
                className={styles.submitBtn}
                loading={isLoading}
              >
                {mode === 'login' ? 'Login to Studio' : 'Create Account'}
              </Button>
            </form>

            <footer className={styles.footer}>
              <p>
                {mode === 'login' ? "Don't have an account?" : "Already a member?"}
                <button 
                  className={styles.switchBtn}
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                >
                  {mode === 'login' ? 'Join Now' : 'Login'}
                </button>
              </p>
            </footer>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthDrawer;
