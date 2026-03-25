'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Command, ArrowRight, Flame } from 'lucide-react';
import Image from 'next/image';
import { useShopStore } from '@/lib/store';
import styles from './OmniSearch.module.css';

const OmniSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const { categories, setSelectedDrawerProduct } = useShopStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const allProducts = categories.flatMap(c => c.products || []);
    const filtered = allProducts.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 6);
    
    setResults(filtered);
  }, [query, categories]);

  const handleResultClick = (product: any) => {
    setSelectedDrawerProduct(product);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <>
      {/* Search Trigger Button (Optionally shown in header) */}
      <button className={styles.trigger} onClick={() => setIsOpen(true)}>
        <Search size={18} />
        <span>Search menu...</span>
        <span className={styles.hotkey}><Command size={12} />K</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div 
              className={styles.modal}
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.searchHeader}>
                <Search className={styles.searchIcon} size={20} />
                <input 
                  ref={inputRef}
                  type="text" 
                  placeholder="What are you craving?" 
                  className={styles.input}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className={styles.resultsArea}>
                {!query ? (
                  <div className={styles.emptyResults}>
                    <p className={styles.hint}>Try searching for "Burgers", "Wings", or "Ember Soda"</p>
                  </div>
                ) : results.length > 0 ? (
                  <div className={styles.resultsList}>
                    {results.map((product) => (
                      <motion.button 
                        key={product.id} 
                        className={styles.resultItem}
                        whileHover={{ x: 5, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                        onClick={() => handleResultClick(product)}
                      >
                        <div className={styles.resultImage}>
                          {product.imageUrl ? (
                            <Image src={product.imageUrl} alt={product.name} width={40} height={40} />
                          ) : (
                            <span className={styles.emoji}>{product.id.startsWith('b') ? '🍔' : '🍟'}</span>
                          )}
                        </div>
                        <div className={styles.resultInfo}>
                          <h4 className={styles.resultName}>{product.name}</h4>
                          <p className={styles.resultDesc}>{product.description.substring(0, 60)}...</p>
                        </div>
                        <div className={styles.resultMeta}>
                          <span className={styles.resultPrice}>${product.price ? product.price.toFixed(2) : product.basePrice.toFixed(2)}</span>
                          <ArrowRight size={16} className={styles.arrow} />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <div className={styles.noResults}>
                    <p>No products found for "{query}"</p>
                  </div>
                )}
              </div>

              <footer className={styles.modalFooter}>
                <div className={styles.shortcut}>
                  <span>ESC</span> to close
                </div>
                <div className={styles.shortcut}>
                  <span>↑↓</span> to navigate
                </div>
                <div className={styles.shortcut}>
                  <span>ENTER</span> to select
                </div>
              </footer>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default OmniSearch;
