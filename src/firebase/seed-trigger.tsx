'use client';

import { useEffect } from 'react';
import { useFirestore } from './provider';
import { seedDatabase } from './seed';

/**
 * An invisible client component that triggers the database seeding function
 * once when the app loads. This ensures sample data is available.
 */
export function SeedTrigger() {
  const firestore = useFirestore();

  useEffect(() => {
    if (firestore) {
      seedDatabase(firestore);
    }
  }, [firestore]);

  return null; // This component renders nothing.
}
