'use client';

import { useEffect } from 'react';
import { useFirestore } from './provider';
import { seedDatabase } from './seed';

/**
 * An invisible component that triggers the database seeding function
 * once on application startup.
 */
export function SeedTrigger() {
  const firestore = useFirestore();

  useEffect(() => {
    if (firestore) {
      seedDatabase(firestore);
    }
  }, [firestore]);

  // This component renders nothing.
  return null;
}
