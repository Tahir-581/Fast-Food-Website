'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Camera, Globe, Users, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button/Button';
import styles from './Footer.module.css';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic for newsletter subscription
    console.log('Subscribed:', email);
    setEmail('');
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Brand Info */}
          <div className={styles.brandCol}>
            <Link href="/" className={styles.logo}>
              <span>Midnight</span>
              <span className={styles.amp}>&</span>
              <span>Ember</span>
            </Link>
            <p className={styles.description}>
              Modern flavors, premium ingredients, and a commitment to speed and quality. 
              The ultimate fast food experience reimagined.
            </p>
            
            <div className={styles.newsletter}>
              <h3>Elevate Your Inbox</h3>
              <p>Join our list for exclusive drops and secret menu items.</p>
              <form onSubmit={handleSubscribe} className={styles.newsletterForm}>
                <input 
                  type="email" 
                  placeholder="your@email.com" 
                  className={styles.newsletterInput}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className={styles.newsletterButton}>
                  <ArrowRight size={18} />
                </button>
              </form>
            </div>
          </div>

          {/* Links Columns */}
          <div className={styles.linksCol}>
            <h3>Menu</h3>
            <Link href="/menu">Full Menu</Link>
            <Link href="/menu/burgers">Burgers</Link>
            <Link href="/menu/sides">Sides</Link>
            <Link href="/menu/drinks">Drinks</Link>
          </div>

          <div className={styles.linksCol}>
            <h3>Support</h3>
            <Link href="/contact">Contact Us</Link>
            <Link href="/locations">Find a Store</Link>
            <Link href="/faq">FAQs</Link>
            <Link href="/delivery">Delivery Info</Link>
          </div>

          <div className={styles.linksCol}>
            <h3>Company</h3>
            <Link href="/about">Our Story</Link>
            <Link href="/careers">Careers</Link>
            <Link href="/press">Press</Link>
            <Link href="/privacy">Privacy Policy</Link>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} Midnight & Ember. All rights reserved.</p>
          <div className={styles.socials}>
            <Link href="https://instagram.com" className={styles.socialLink} aria-label="Instagram">
              <Camera size={20} />
            </Link>
            <Link href="https://twitter.com" className={styles.socialLink} aria-label="Twitter">
              <Globe size={20} />
            </Link>
            <Link href="https://facebook.com" className={styles.socialLink} aria-label="Facebook">
              <Users size={20} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

