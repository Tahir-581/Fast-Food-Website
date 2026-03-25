import React from 'react';
import { Leaf, ChefHat, Zap } from 'lucide-react';
import styles from './WhyChooseUs.module.css';

const features = [
  {
    icon: <Leaf size={32} />,
    title: 'Pure Origin',
    description: 'Locally sourced, 100% organic ingredients for every meal we craft.'
  },
  {
    icon: <ChefHat size={32} />,
    title: 'Chef Crafted',
    description: 'Our recipes are designed by top-tier chefs with a passion for flavor.'
  },
  {
    icon: <Zap size={32} />,
    title: 'Lightning Fast',
    description: 'Order in seconds, enjoy in minutes. Speed is our second name.'
  }
];

const WhyChooseUs = () => {
  return (
    <section className={styles.whyChooseUs}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.feature}>
              <div className={styles.iconWrapper}>
                {feature.icon}
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDesc}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
