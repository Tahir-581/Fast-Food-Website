'use client';

import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  glass?: boolean;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  padding = 'md',
  hoverable = false,
  glass = false,
  className = '',
  onClick
}) => {
  const combinedClassName = `
    ${styles.card} 
    ${styles[`p-${padding}`]} 
    ${hoverable ? styles.hoverable : ''} 
    ${glass ? styles.glass : ''} 
    ${className}
  `.trim();

  return (
    <div className={combinedClassName} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
