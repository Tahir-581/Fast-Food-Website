'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button/Button';
import styles from './Hero.module.css';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" as any },
    },
  };

  return (
    <section className={styles.hero}>
      {/* Video Background with slow zoom */}
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className={styles.videoWrapper}
      >
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className={styles.video}
          poster="/images/hero-poster.jpg"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-meat-burger-being-assembled-43213-large.mp4" type="video/mp4" />
        </video>
        <div className={styles.videoOverlay} />
      </motion.div>
      
      <div className={styles.container}>
        <motion.div 
          className={styles.content}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.span variants={itemVariants} className={styles.badge}>
            PREMIERE SELECTION
          </motion.span>
          <motion.h1 variants={itemVariants} className={styles.title}>
            ELEVATED FAST FOOD. <br />
            <span className={styles.highlight}>REDEFINED.</span>
          </motion.h1>
          <motion.p variants={itemVariants} className={styles.description}>
            Discover the perfect balance of smoke and spice. Crafted for the bold, 
            delivered with precision. Experience high-fidelity flavors in every bite.
          </motion.p>
          <motion.div variants={itemVariants} className={styles.actions}>
            <Button size="lg" variant="primary" onClick={() => window.location.href = '/menu'}>Explore the Collection</Button>
            <Button size="lg" variant="secondary" onClick={() => window.location.href = '/menu?category=combos'}>Curated Pairings</Button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Decorative Glow Elements */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 1 }}
        className={styles.glowLeft} 
      />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 1 }}
        className={styles.glowRight} 
      />
    </section>
  );
};

export default Hero;
