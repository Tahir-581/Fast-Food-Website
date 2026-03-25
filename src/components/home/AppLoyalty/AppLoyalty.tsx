import React from 'react';
import { Smartphone, Gift, Star, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button/Button';
import styles from './AppLoyalty.module.css';

const AppLoyalty = () => {
  return (
    <section className={styles.appLoyalty}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.content}>
            <span className={styles.badge}>EMBER REWARDS</span>
            <h2 className={styles.title}>Join the Circle, <br /> Reap the Sparks.</h2>
            <p className={styles.description}>
              Download the Midnight & Ember app and claim your first 500 points. 
              Earn sparks on every bite and unlock exclusive secret menu items.
            </p>
            
            <div className={styles.pointsTeaser}>
              <div className={styles.pointItem}>
                <div className={styles.pointIcon}><Star size={20} /></div>
                <div>
                  <h4>Earn Sparks</h4>
                  <p>10 points for every $1 spent.</p>
                </div>
              </div>
              <div className={styles.pointItem}>
                <div className={styles.pointIcon}><Gift size={20} /></div>
                <div>
                  <h4>Claim Rewards</h4>
                  <p>Free sides from 1000 points.</p>
                </div>
              </div>
            </div>

            <div className={styles.actions}>
              <Button variant="primary" size="lg">Join Loyalty</Button>
              <Button variant="secondary" size="lg">Download App</Button>
            </div>
          </div>

          <div className={styles.visuals}>
            <div className={styles.phoneMockup}>
              <div className={styles.phoneScreen}>
                <Smartphone size={120} strokeWidth={1} />
                <div className={styles.screenGlow} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppLoyalty;
