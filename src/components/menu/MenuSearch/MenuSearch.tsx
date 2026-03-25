import React from 'react';
import { Search, X } from 'lucide-react';
import styles from './MenuSearch.module.css';

interface MenuSearchProps {
  query: string;
  setQuery: (query: string) => void;
}

const MenuSearch: React.FC<MenuSearchProps> = ({ query, setQuery }) => {
  return (
    <div className={styles.menuSearch}>
      <div className={styles.container}>
        <div className={styles.inputWrapper}>
          <Search size={20} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search our flavors..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.input}
          />
          {query && (
            <button 
              className={styles.clearBtn}
              onClick={() => setQuery('')}
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuSearch;
