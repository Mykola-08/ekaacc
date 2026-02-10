'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  TrendingDown,
  TrendingUp,
  Star,
  Info,
  Calendar,
  Clock,
  Euro,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

interface PriceBreakdown {
  base_price_cents: number;
  duration_minutes: number;
  weekend_multiplier: number;
  vip_discount: number;
  back_to_back_discount: number;
  high_demand_surcharge: number;
  last_slot_surcharge: number;
  final_price_cents: number;
  modifiers: PriceModifier[];
}

interface PriceModifier {
  type: 'discount' | 'surcharge';
  label: string;
  amount_cents: number;
  percentage?: number;
  icon: string;
}

interface DynamicPriceCalculatorProps {
  serviceId: number | null;
  duration: number;
  selectedDate: string;
  selectedTime: string;
  location: string;
  showDetailed?: boolean;
  className?: string;
}

export default function DynamicPriceCalculator({
  serviceId,
  duration,
  selectedDate,
  selectedTime,
  location,
  showDetailed = true,
  className = '',
}: DynamicPriceCalculatorProps) {
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculatePrice = useCallback(async () => {
    if (!serviceId || !selectedDate || !selectedTime) {
      setPriceBreakdown(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        serviceId: serviceId.toString(),
        duration: duration.toString(),
        date: selectedDate,
        time: selectedTime,
        location: location || 'barcelona',
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`/api/pricing/calculate?${params}`, {
        credentials: 'include',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Servei no trobat');
        } else if (response.status >= 500) {
          throw new Error('Error del servidor. Torna-ho a intentar.');
        } else {
          throw new Error('Error calculant el preu');
        }
      }

      const data = (await response.json()) as Partial<PriceBreakdown>;

      // Validate response data
      if (!data || typeof data.final_price_cents !== 'number') {
        throw new Error('Resposta del servidor invàlida');
      }

      setPriceBreakdown(data as PriceBreakdown);
    } catch (err) {
      console.error('Error calculating price:', err);
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setError("Temps d'espera esgotat. Torna-ho a intentar.");
        } else {
          setError(err.message);
        }
      } else {
        setError("No s'ha pogut calcular el preu");
      }
      setPriceBreakdown(null);
    } finally {
      setLoading(false);
    }
  }, [serviceId, duration, selectedDate, selectedTime, location]);

  useEffect(() => {
    calculatePrice();
  }, [calculatePrice]);

  const formatPrice = (cents: number) => {
    if (cents < 0) return '€0';
    return `€${(cents / 100).toFixed(0)}`;
  };

  const getModifierIcon = (iconName: string) => {
    switch (iconName) {
      case 'weekend':
        return <Calendar className="h-3 w-3" />;
      case 'vip':
        return <Star className="h-3 w-3" />;
      case 'back_to_back':
        return <TrendingDown className="h-3 w-3" />;
      case 'high_demand':
        return <TrendingUp className="h-3 w-3" />;
      case 'last_slot':
        return <Clock className="h-3 w-3" />;
      default:
        return <Euro className="h-3 w-3" />;
    }
  };

  // Empty state when no service selected
  if (!serviceId || !duration) {
    return (
      <div className={`rounded-[20px] bg-gray-50 p-6 dark:bg-gray-800 ${className}`}>
        <div className="mb-4 flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 dark:bg-yellow-900/30">
            <Euro className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">Calculadora de preu</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Selecciona sessió i durada per veure el preu
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className={`rounded-[20px] bg-gray-50 p-6 dark:bg-gray-800 ${className}`}>
        <div className="flex items-center space-x-3">
          <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-yellow-500"></div>
          <span className="text-gray-600 dark:text-gray-400">Calculant preu...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className={`rounded-[20px] border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20 ${className}`}
      >
        <div className="mb-4 flex items-start space-x-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          <div className="flex-1">
            <p className="mb-1 font-medium text-red-700 dark:text-red-400">Error de càlcul</p>
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
        <button
          onClick={calculatePrice}
          className="inline-flex items-center text-sm text-red-600 transition-colors hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
        >
          <RefreshCw className="mr-1 h-4 w-4" />
          Tornar a calcular
        </button>
      </div>
    );
  }

  // Incomplete selection state
  if (!selectedDate || !selectedTime) {
    return (
      <div
        className={`rounded-[20px] border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20 ${className}`}
      >
        <div className="flex items-center space-x-3">
          <Info className="h-5 w-5 text-blue-500" />
          <span className="text-blue-700 dark:text-blue-400">
            Selecciona data i hora per veure el preu exacte
          </span>
        </div>
      </div>
    );
  }

  // No price data available
  if (!priceBreakdown) {
    return (
      <div
        className={`rounded-[20px] border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-900/20 ${className}`}
      >
        <div className="flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <span className="text-amber-700 dark:text-amber-400">
            No s'ha pogut obtenir informació de preus per aquesta selecció
          </span>
        </div>
      </div>
    );
  }

  const hasDiscounts = priceBreakdown.modifiers.some((m) => m.type === 'discount');
  const hasSurcharges = priceBreakdown.modifiers.some((m) => m.type === 'surcharge');

  return (
    <div
      className={`rounded-[20px] border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900 ${className}`}
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 dark:bg-yellow-900/30">
            <Euro className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">Preu de la sessió</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{duration} minuts</p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-light text-gray-900 dark:text-white">
            {formatPrice(priceBreakdown.final_price_cents)}
          </div>
          {priceBreakdown.final_price_cents !== priceBreakdown.base_price_cents && (
            <div className="text-sm text-gray-500 line-through dark:text-gray-400">
              {formatPrice(priceBreakdown.base_price_cents)}
            </div>
          )}
        </div>
      </div>

      {/* Price Breakdown */}
      {showDetailed && priceBreakdown.modifiers.length > 0 && (
        <div className="mb-6 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Preu base ({duration} min)</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatPrice(priceBreakdown.base_price_cents)}
            </span>
          </div>

          {priceBreakdown.modifiers.map((modifier, index) => (
            <div
              key={index}
              className={`flex items-center justify-between text-sm ${
                modifier.type === 'discount'
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-orange-600 dark:text-orange-400'
              }`}
            >
              <div className="flex items-center space-x-2">
                {getModifierIcon(modifier.icon)}
                <span>
                  {modifier.label}
                  {modifier.percentage && ` (${modifier.percentage}%)`}
                </span>
              </div>
              <span className="font-medium">
                {modifier.type === 'discount' ? '-' : '+'}
                {formatPrice(Math.abs(modifier.amount_cents))}
              </span>
            </div>
          ))}

          <div className="flex items-center justify-between border-t border-gray-200 pt-3 font-medium dark:border-gray-700">
            <span className="text-gray-900 dark:text-white">Total</span>
            <span className="text-xl text-gray-900 dark:text-white">
              {formatPrice(priceBreakdown.final_price_cents)}
            </span>
          </div>
        </div>
      )}

      {/* Special Badges */}
      <div className="mb-4 flex flex-wrap gap-2">
        {hasDiscounts && (
          <div className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
            <TrendingDown className="mr-1 h-3 w-3" />
            Descompte aplicat
          </div>
        )}

        {hasSurcharges && (
          <div className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
            <TrendingUp className="mr-1 h-3 w-3" />
            Suplement aplicat
          </div>
        )}

        {priceBreakdown.modifiers.some((m) => m.icon === 'vip') && (
          <div className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
            <Star className="mr-1 h-3 w-3" />
            VIP
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
        <div className="flex items-start space-x-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
          <div className="text-sm">
            <p className="mb-1 font-medium text-blue-900 dark:text-blue-100">Preus dinàmics</p>
            <p className="text-blue-700 dark:text-blue-300">
              Els preus varien segons el dia, hora i disponibilitat. Aquest preu està garantit per a
              la reserva.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
