'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Settings, 
  Clock, 
  MapPin, 
  Heart, 
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Flame,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button/Button';
import styles from './studio.module.css';

const PersonalStudio = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [taste, setTaste] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchData = async () => {
      if (status !== 'authenticated') return;
      
      try {
        const [profRes, tasteRes] = await Promise.all([
          fetch('/api/user/profile'),
          fetch('/api/user/taste')
        ]);
        
        const [profData, tasteData] = await Promise.all([
          profRes.json(),
          tasteRes.json()
        ]);
        
        setProfile(profData);
        setTaste(tasteData);
      } catch (err) {
        console.error("Failed to load studio data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [status]);

  if (status === 'loading' || isLoading) {
    return (
      <div className={styles.loaderContainer}>
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <Sparkles className={styles.loaderIcon} size={48} />
        </motion.div>
        <p>Polishing your Studio...</p>
      </div>
    );
  }

  return (
    <div className={styles.studioRoot}>
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.welcome}
          >
            <span className={styles.badge}>PERSONAL STUDIO</span>
            <h1 className={styles.title}>Welcome home, {session?.user?.name?.split(' ')[0]}</h1>
            <p className={styles.subtitle}>Your preferences are refined. Your sparks are glowing.</p>
          </motion.div>
          
          <div className={styles.loyaltyCard}>
            <div className={styles.cardHeader}>
              <div className={styles.tierInfo}>
                <span className={styles.tierBadge}>
                  <Flame size={14} /> {profile?.loyaltyTier || 'SPROUT'}
                </span>
                <span className={styles.sparksCount}>
                  <Zap size={14} className={styles.zap} /> {profile?.sparks || 0} Sparks
                </span>
              </div>
              <div className={styles.tierNext}>
                <span>350 to <span className={styles.nextTier}>FLAME</span></span>
              </div>
            </div>
            <div className={styles.progressBar}>
              <motion.div 
                className={styles.progressFill}
                initial={{ width: 0 }}
                animate={{ width: '45%' }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className={styles.grid}>
        {/* Quick Actions */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>The Directorials</h3>
            <p>Immediate control over your experience.</p>
          </div>
          <div className={styles.actionsGrid}>
            <button className={styles.actionItem}>
              <Clock size={24} />
              <span>Order History</span>
            </button>
            <button className={styles.actionItem}>
              <MapPin size={24} />
              <span>Saved Locales</span>
            </button>
            <button className={styles.actionItem}>
              <Settings size={24} />
              <span>Studio Configuration</span>
            </button>
          </div>
        </section>

        {/* Taste Profile */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>Taste Profile</h3>
            <p>How we tailor the menu to your palette.</p>
          </div>
          <div className={styles.tasteCard}>
            <div className={styles.tasteTags}>
              {['Extra Spicy', 'Late Night', 'Plant-Based Priority'].map(tag => (
                <span key={tag} className={styles.tasteTag}>{tag}</span>
              ))}
              <button className={styles.addTag}>+ Add Nuance</button>
            </div>
          </div>
        </section>

        {/* Recent Performance */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>Recent Performance</h3>
            <p>Tracking your latest Midnight & Ember encounters.</p>
          </div>
          <div className={styles.recentOrders}>
            <div className={styles.emptyRecent}>
              <TrendingUp size={32} />
              <p>Your performance log is currently silent. Time to ignite the forge?</p>
              <Button onClick={() => router.push('/menu')} variant="primary" size="sm">Explore Menus</Button>
            </div>
          </div>
        </section>

        {/* Studio Security */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>Studio Security</h3>
            <p>Verification and identity management.</p>
          </div>
          <div className={styles.securityCard}>
            <div className={styles.securityItem}>
              <ShieldCheck size={20} className={styles.verified} />
              <div>
                <p className={styles.secLabel}>Official Email Verified</p>
                <p className={styles.secValue}>{session?.user?.email}</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PersonalStudio;
