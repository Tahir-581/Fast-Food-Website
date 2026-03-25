import React from 'react';
import Hero from '@/components/home/Hero/Hero';
import Categories from '@/components/home/Categories/Categories';
import BestSellers from '@/components/home/BestSellers/BestSellers';
import Promotions from '@/components/home/Promotions/Promotions';
import WhyChooseUs from '@/components/home/WhyChooseUs/WhyChooseUs';
import LocationBar from '@/components/home/LocationBar/LocationBar';
import AppLoyalty from '@/components/home/AppLoyalty/AppLoyalty';
import Testimonials from '@/components/home/Testimonials/Testimonials';
import QuickReorder from '@/components/home/QuickReorder/QuickReorder';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.home}>
      <Hero />
      <LocationBar />
      <Categories />
      <BestSellers />
      <Promotions />
      <WhyChooseUs />
      <QuickReorder />
      <AppLoyalty />
      <Testimonials />
    </main>
  );
}
