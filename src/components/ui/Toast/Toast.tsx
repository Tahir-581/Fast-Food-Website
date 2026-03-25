import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import styles from './Toast.module.css';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose }) => {
  const Icon = type === 'success' ? CheckCircle : type === 'error' ? AlertCircle : Info;

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <Icon size={20} className={styles.icon} />
      <span className={styles.message}>{message}</span>
      <button className={styles.closeButton} onClick={onClose}>
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
