'use client';
import {
  Firestore,
  collection,
  getDocs,
  writeBatch,
  doc,
} from 'firebase/firestore';
import { services, vipPlans } from '@/lib/data';

// A flag to ensure seeding doesn't run multiple times
let hasSeeded = false;

/**
 * Seeds the Firestore database with initial data for services and plans.
 * This function checks if the collections are empty before seeding to prevent
 * duplicate data on subsequent runs or hot reloads.
 */
export async function seedDatabase(db: Firestore) {
  if (hasSeeded) {
    console.log('Database has already been seeded in this session.');
    return;
  }
  
  console.log('Checking if database needs seeding...');

  try {
    // Seed Services (formerly Therapies)
    const servicesRef = collection(db, 'services');
    const servicesSnap = await getDocs(servicesRef);
    if (servicesSnap.empty) {
      console.log('Seeding services...');
      const batch = writeBatch(db);
      services.forEach((service) => {
        const docRef = doc(servicesRef, service.name.toLowerCase().replace(/\s+/g, '-').replace(/[°()]/g, ''));
        batch.set(docRef, service);
      });
      await batch.commit();
      console.log('Services seeded successfully.');
    } else {
      console.log('Services collection already exists. Skipping seeding.');
    }

    // Seed VIP Plans
    const plansRef = collection(db, 'vipPlans');
    const plansSnap = await getDocs(plansRef);
    if (plansSnap.empty) {
      console.log('Seeding VIP plans...');
      const batch = writeBatch(db);
      vipPlans.forEach((plan) => {
        const docId = plan.tier.toLowerCase().replace(/\s+/g, '-');
        const docRef = doc(plansRef, docId);
        batch.set(docRef, plan);
      });
      await batch.commit();
      console.log('VIP Plans seeded successfully.');
    } else {
      console.log('VIP Plans collection already exists. Skipping seeding.');
    }

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    hasSeeded = true;
  }
}
