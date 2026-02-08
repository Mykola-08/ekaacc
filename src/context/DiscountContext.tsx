'use client';

import React, { useState, useEffect, createContext } from 'react';
// import { supabase } from '@/lib/supabase';
import { useAnalytics } from '@/hooks/useAnalytics';

import { Discount, DiscountContextType } from './DiscountTypes';

// Types are imported for internal use, but not re-exported to avoid HMR issues.
// Import types directly from './DiscountTypes'.

const DiscountContext = createContext<DiscountContextType | undefined>(undefined);

export function DiscountProvider({ children }: { children: React.ReactNode }) {
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);
  const [availableDiscounts, setAvailableDiscounts] = useState<Discount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { logEvent } = useAnalytics();

  // Load discounts from Supabase
  useEffect(() => {
    const fetchDiscounts = async () => {
      // Fallback discounts (Supabase removed)
      const fallbackDiscounts: Discount[] = [
        {
          id: '1',
          name: 'Amic Mykola',
          percentage: 20,
          code: 'MYKOLA20',
          description: 'Descompte especial del 20% per a amics de Mykola',
          isActive: true,
        },
        {
          id: '2',
          name: 'Conegut Mykola',
          percentage: 10,
          code: 'MYKOLA10',
          description: 'Descompte del 10% per a coneguts de Mykola',
          isActive: true,
        },
        {
          id: '3',
          name: 'Benvinguda',
          percentage: 20,
          code: 'WELCOME20',
          description: 'Descompte de benvinguda',
          isActive: true,
        },
      ];
      setAvailableDiscounts(fallbackDiscounts);

      // Check for saved discount
      const savedDiscountCode = localStorage.getItem('eka-applied-discount');
      if (savedDiscountCode) {
        const discount = fallbackDiscounts.find((d) => d.code === savedDiscountCode);
        if (discount) {
          setSelectedDiscount(discount);
        } else {
          localStorage.removeItem('eka-applied-discount');
        }
      }
      setIsLoading(false);
    };

    fetchDiscounts();
  }, []);

  const applyDiscount = async (code: string): Promise<boolean> => {
    const discount = availableDiscounts.find((d) => d.code.toLowerCase() === code.toLowerCase());

    if (discount) {
      setSelectedDiscount(discount);
      localStorage.setItem('eka-applied-discount', discount.code);

      // Log the interaction
      logEvent(
        'apply_discount',
        {
          discount_id: discount.id,
          discount_name: discount.name,
          percentage: discount.percentage,
          success: true,
        },
        code
      );

      return true;
    }

    // Log failed attempt
    logEvent(
      'apply_discount_failed',
      {
        success: false,
        reason: 'Invalid code',
      },
      code
    );

    return false;
  };

  const removeDiscount = () => {
    setSelectedDiscount(null);
    localStorage.removeItem('eka-applied-discount');
  };

  const calculateDiscountedPrice = (originalPrice: number): number => {
    if (!selectedDiscount) return originalPrice;
    const discountAmount = (originalPrice * selectedDiscount.percentage) / 100;
    return Math.round((originalPrice - discountAmount) * 100) / 100;
  };

  const getDiscountAmount = (originalPrice: number): number => {
    if (!selectedDiscount) return 0;
    return Math.round(((originalPrice * selectedDiscount.percentage) / 100) * 100) / 100;
  };

  return (
    <DiscountContext.Provider
      value={{
        selectedDiscount,
        availableDiscounts,
        applyDiscount,
        removeDiscount,
        calculateDiscountedPrice,
        getDiscountAmount,
        isLoading,
      }}
    >
      {children}
    </DiscountContext.Provider>
  );
}

export function useDiscount() {
  const context = React.useContext(DiscountContext);
  if (context === undefined) {
    throw new Error('useDiscount must be used within a DiscountProvider');
  }
  return context;
}
