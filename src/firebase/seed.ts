'use client';
import {
  Firestore,
  collection,
  getDocs,
  writeBatch,
  doc,
} from 'firebase/firestore';
import { therapies, vipPlans } from '@/lib/data';

// A flag to ensure seeding doesn't run multiple times
let hasSeeded = false;

/**
 * Seeds the Firestore database with initial data for therapies and plans.
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
    // Seed Therapies
    const therapiesRef = collection(db, 'therapies');
    const therapiesSnap = await getDocs(therapiesRef);
    if (therapiesSnap.empty) {
      console.log('Seeding therapies...');
      const batch = writeBatch(db);
      therapies.forEach((therapy) => {
        const docRef = doc(therapiesRef); // Auto-generate ID
        batch.set(docRef, therapy);
      });
      await batch.commit();
      console.log('Therapies seeded successfully.');
    } else {
      console.log('Therapies collection already exists. Skipping seeding.');
    }

    // Seed Plans
    const plansRef = collection(db, 'plans');
    const plansSnap = await getDocs(plansRef);
    if (plansSnap.empty) {
      console.log('Seeding plans...');
      const batch = writeBatch(db);
      vipPlans.forEach((plan) => {
        // Use a slugified name as the document ID for plans
        const docId = plan.name.toLowerCase().replace(/\s+/g, '-');
        const docRef = doc(plansRef, docId);
        batch.set(docRef, plan);
      });
      await batch.commit();
      console.log('Plans seeded successfully.');
    } else {
      console.log('Plans collection already exists. Skipping seeding.');
    }

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    hasSeeded = true;
  }
}
