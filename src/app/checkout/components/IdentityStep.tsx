'use client';

import React from 'react';
import Card from '@/components/ui/Card/Card';
import Input from '@/components/ui/Input/Input';
import Button from '@/components/ui/Button/Button';
import { User, LogIn, ChevronRight } from 'lucide-react';
import styles from '../page.module.css';

interface IdentityStepProps {
  onNext: (data: { email: string; isGuest: boolean }) => void;
}

const IdentityStep: React.FC<IdentityStepProps> = ({ onNext }) => {
  const [email, setEmail] = React.useState('');

  const handleGuestContinue = () => {
    if (email) {
      onNext({ email, isGuest: true });
    }
  };

  return (
    <div className={styles.stepContainer}>
      <Card className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <User size={24} className={styles.sectionIcon} />
          <h2 className={styles.sectionTitle}>1. Who's ordering?</h2>
        </div>
        
        <div className={styles.identityOptions}>
          <div className={styles.guestSection}>
            <p className={styles.description}>
              Continue as guest to place your order quickly.
            </p>
            <div className={styles.formGrid}>
              <Input
                label="Email Address"
                placeholder="john@example.com"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
              />
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleGuestContinue}
                disabled={!email}
              >
                Continue as Guest <ChevronRight size={20} />
              </Button>
            </div>
          </div>

          <div className={styles.divider}>
            <span>OR</span>
          </div>

          <div className={styles.loginSection}>
            <p className={styles.description}>
              Log in to use your saved addresses and earn 2x points!
            </p>
            <Button
              variant="outline"
              size="lg"
              fullWidth
              className={styles.loginBtn}
              onClick={() => {}} // Handle login modal
            >
              <LogIn size={20} /> Sign In / Create Account
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default IdentityStep;
