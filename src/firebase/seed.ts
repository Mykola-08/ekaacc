'use client';
import {
  Firestore,
  collection,
  getDocs,
  writeBatch,
  doc,
  query,
  where,
} from 'firebase/firestore';
import { services, vipPlans, allUsers } from '@/lib/data';

// A flag to ensure seeding doesn't run multiple times
let hasSeeded = false;

/**
 * Seeds the Firestore database with initial data for services, plans, and a sample user.
 * This function checks if the collections are empty before seeding to prevent
 * duplicate data on subsequent runs or hot reloads.
 */
export async function seedDatabase(db: Firestore) {
  if (hasSeeded) {
    // console.log('Database has already been seeded in this session.');
    return;
  }
  
  console.log('Checking if database needs seeding...');

  try {
    const batch = writeBatch(db);

    // Seed Services
    const servicesRef = collection(db, 'services');
    const servicesSnap = await getDocs(servicesRef);
    if (servicesSnap.empty) {
      console.log('Seeding services...');
      services.forEach((service) => {
        const docRef = doc(servicesRef, service.name.toLowerCase().replace(/\s+/g, '-').replace(/[°()]/g, ''));
        batch.set(docRef, service);
      });
      console.log('Services queued for seeding.');
    } else {
      // console.log('Services collection already exists. Skipping seeding.');
    }

    // Seed VIP Plans
    const plansRef = collection(db, 'vipPlans');
    const plansSnap = await getDocs(plansRef);
    if (plansSnap.empty) {
      console.log('Seeding VIP plans...');
      vipPlans.forEach((plan) => {
        const docId = plan.tier.toLowerCase().replace(/\s+/g, '-');
        const docRef = doc(plansRef, docId);
        batch.set(docRef, plan);
      });
      console.log('VIP Plans queued for seeding.');
    } else {
      // console.log('VIP Plans collection already exists. Skipping seeding.');
    }
    
    // Seed Sample User
    const usersRef = collection(db, 'users');
    const sampleUser = allUsers[0]; // Using Alex Doe
    if (sampleUser) {
        const userDocRef = doc(usersRef, sampleUser.id);
        const userSnap = await getDocs(query(usersRef, where('id', '==', sampleUser.id)));

        // For simplicity, we just check for any user. A real app might check for specific user IDs.
        const usersSnap = await getDocs(usersRef);
        if (usersSnap.empty) {
            console.log('Seeding sample user...');
            // We are creating a user document with a specific ID 'user-1'
            // In a real app, this ID would come from Firebase Auth. For this seed, it's pre-defined.
            const { id, ...userData } = sampleUser;
            batch.set(doc(usersRef, id), userData);
            console.log('Sample user queued for seeding.');
        } else {
            // console.log('Users collection is not empty. Skipping user seeding.');
        }
    }


    await batch.commit();
    console.log('Database seeding committed successfully.');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    hasSeeded = true;
  }
}
