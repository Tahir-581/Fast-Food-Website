import React from 'react';
import { Quote, Star } from 'lucide-react';
import styles from './Testimonials.module.css';

const testimonials = [
  {
    id: 1,
    name: 'Marcus Chen',
    role: 'Food Critic',
    content: "The Midnight Wagyu is a revelation. The balance of flavors and the quality of the cut is something you'd expect from a Michelin-star grill, not a burger joint.",
    rating: 5,
  },
  {
    id: 2,
    name: 'Sarah Jenkins',
    role: 'Local Guide',
    content: 'Finally, a fast food place that takes ingredients seriously. The charcoal fries are not just a gimmick; they are perfectly seasoned and crispy.',
    rating: 5,
  },
  {
    id: 3,
    name: 'David Rossi',
    role: 'Burger Enthusiast',
    content: "The vibe of the place is matched only by the intensity of the flavor. It's the ultimate late-night spot for premium comfort food.",
    rating: 4,
  }
];

const Testimonials = () => {
  return (
    <section className={styles.testimonials}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Quote size={48} className={styles.quoteIcon} />
          <h2 className={styles.title}>The Ember Echoes</h2>
          <p className={styles.subtitle}>Words from our community of flavor seekers.</p>
        </div>

        <div className={styles.grid}>
          {testimonials.map((t) => (
            <div key={t.id} className={styles.card}>
              <div className={styles.stars}>
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="var(--color-primary)" color="var(--color-primary)" />
                ))}
              </div>
              <p className={styles.content}>"{t.content}"</p>
              <div className={styles.author}>
                <div className={styles.avatarPlaceholder}>{t.name.charAt(0)}</div>
                <div className={styles.info}>
                  <h4 className={styles.name}>{t.name}</h4>
                  <span className={styles.role}>{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
