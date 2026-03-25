'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ShoppingCart, Menu as MenuIcon, User, Search, X } from 'lucide-react';
import { useShopStore } from '@/lib/store';
import Button from '@/components/ui/Button/Button';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const { getTotalItems, setIsCartOpen, setAuthOpen, user } = useShopStore();
  const totalItems = getTotalItems();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchOpen]);

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''} ${isSearchOpen ? styles.navbarSearchOpen : ''}`}>
      <div className={styles.container}>
        <Link href="/" className={`${styles.logo} ${isSearchOpen ? styles.hideOnSearch : ''}`}>
          <span>Midnight</span>
          <span className={styles.amp}>&</span>
          <span>Ember</span>
        </Link>

        {/* Desktop Links */}
        <div className={`${styles.navLinks} ${isSearchOpen ? styles.hideOnSearch : ''}`}>
          <Link href="/menu" className={styles.navLink}>The Collection</Link>
          <Link href="/locations" className={styles.navLink}>Our Kitchens</Link>
          <Link href="/rewards" className={styles.navLink}>The Craft</Link>
        </div>

        <div className={styles.actions}>
          <div ref={searchRef} className={`${styles.searchWrapper} ${isSearchOpen ? styles.searchExpanded : ''}`}>
            <button 
              className={styles.iconLink}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              {isSearchOpen ? <X size={20} /> : <Search size={20} />}
            </button>
            {isSearchOpen && (
              <input 
                autoFocus
                type="text" 
                placeholder="What are you craving?" 
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            )}
          </div>

          <button 
            className={`${styles.iconLink} ${isSearchOpen ? styles.hideOnSearch : ''}`}
            onClick={() => user ? window.location.href = '/dashboard' : setAuthOpen(true)}
          >
            <User size={20} className={user ? styles.activeUser : ''} />
          </button>
          
          <button 
            className={`${styles.cartButton} ${isSearchOpen ? styles.hideOnSearch : ''}`}
            onClick={() => setIsCartOpen(true)}
            aria-label="View Bag"
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className={styles.badge}>{totalItems}</span>
            )}
          </button>

          <Link href="/menu" className={isSearchOpen ? styles.hideOnSearch : ''}>
            <Button size="md" variant="primary">Order Now</Button>
          </Link>
          
          {/* Mobile Toggle */}
          <button 
            className={`${styles.mobileToggle} ${isSearchOpen ? styles.hideOnSearch : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className={`${styles.burger} ${isMobileMenuOpen ? styles.open : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
        <Link href="/menu" onClick={() => setIsMobileMenuOpen(false)}>The Collection</Link>
        <Link href="/locations" onClick={() => setIsMobileMenuOpen(false)}>Our Kitchens</Link>
        <Link href="/rewards" onClick={() => setIsMobileMenuOpen(false)}>The Craft</Link>
        <hr className={styles.divider} />
        {user ? (
          <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Studio (Welcome, {user.name})</Link>
        ) : (
          <button className={styles.mobileAuthBtn} onClick={() => { setIsMobileMenuOpen(false); setAuthOpen(true); }}>
            Welcome Back / Join the Circle
          </button>
        )}
        <Button size="lg" variant="primary" fullWidth onClick={() => window.location.href = '/menu'}>Order Now</Button>
      </div>

    </nav>
  );
};

export default Navbar;
