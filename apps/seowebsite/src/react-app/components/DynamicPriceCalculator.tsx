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
  RefreshCw
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
  className = ''
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
        location: location || 'barcelona'
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`/api/pricing/calculate?${params}`, {
        credentials: 'include',
        signal: controller.signal
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
      
      const data = await response.json();
      
      // Validate response data
      if (!data || typeof (data as any).final_price_cents !== 'number') {
        throw new Error('Resposta del servidor invàlida');
      }
      
      setPriceBreakdown(data as PriceBreakdown);
    } catch (err) {
      console.error('Error calculating price:', err);
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setError('Temps d\'espera esgotat. Torna-ho a intentar.');
        } else {
          setError(err.message);
        }
      } else {
        setError('No s\'ha pogut calcular el preu');
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
        return <Calendar className="w-3 h-3" />;
      case 'vip':
        return <Star className="w-3 h-3" />;
      case 'back_to_back':
        return <TrendingDown className="w-3 h-3" />;
      case 'high_demand':
        return <TrendingUp className="w-3 h-3" />;
      case 'last_slot':
        return <Clock className="w-3 h-3" />;
      default:
        return <Euro className="w-3 h-3" />;
    }
  };

  // Empty state when no service selected
  if (!serviceId || !duration) {
    return (
      <div className={`bg-muted/30 dark:bg-gray-800 rounded-2xl p-6 ${className}`}>
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
            <Euro className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <h3 className="font-medium text-foreground dark:text-white">Calculadora de preu</h3>
            <p className="text-sm text-muted-foreground dark:text-muted-foreground/80">
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
      <div className={`bg-muted/30 dark:bg-gray-800 rounded-2xl p-6 ${className}`}>
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500"></div>
          <span className="text-muted-foreground dark:text-muted-foreground/80">Calculant preu...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 ${className}`}>
        <div className="flex items-start space-x-3 mb-4">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-red-700 dark:text-red-400 font-medium mb-1">Error de càlcul</p>
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        </div>
        <button
          onClick={calculatePrice}
          className="inline-flex items-center text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-1" />
          Tornar a calcular
        </button>
      </div>
    );
  }

  // Incomplete selection state
  if (!selectedDate || !selectedTime) {
    return (
      <div className={`bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 ${className}`}>
        <div className="flex items-center space-x-3">
          <Info className="w-5 h-5 text-blue-500" />
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
      <div className={`bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 ${className}`}>
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-amber-500" />
          <span className="text-amber-700 dark:text-amber-400">
            No s'ha pogut obtenir informació de preus per aquesta selecció
          </span>
        </div>
      </div>
    );
  }

  const hasDiscounts = priceBreakdown.modifiers.some(m => m.type === 'discount');
  const hasSurcharges = priceBreakdown.modifiers.some(m => m.type === 'surcharge');

  return (
    <div className={`bg-card dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
            <Euro className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <h3 className="font-medium text-foreground dark:text-white">Preu de la sessió</h3>
            <p className="text-sm text-muted-foreground dark:text-muted-foreground/80">
              {duration} minuts
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-light text-foreground dark:text-white">
            {formatPrice(priceBreakdown.final_price_cents)}
          </div>
          {priceBreakdown.final_price_cents !== priceBreakdown.base_price_cents && (
            <div className="text-sm text-muted-foreground dark:text-muted-foreground/80 line-through">
              {formatPrice(priceBreakdown.base_price_cents)}
            </div>
          )}
        </div>
      </div>

      {/* Price Breakdown */}
      {showDetailed && priceBreakdown.modifiers.length > 0 && (
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground dark:text-muted-foreground/80">Preu base ({duration} min)</span>
            <span className="font-medium text-foreground dark:text-white">
              {formatPrice(priceBreakdown.base_price_cents)}
            </span>
          </div>
          
          {priceBreakdown.modifiers.map((modifier, index) => (
            <div 
              key={index}
              className={`flex justify-between items-center text-sm ${
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
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between items-center font-medium">
            <span className="text-foreground dark:text-white">Total</span>
            <span className="text-xl text-foreground dark:text-white">
              {formatPrice(priceBreakdown.final_price_cents)}
            </span>
          </div>
        </div>
      )}

      {/* Special Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {hasDiscounts && (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
            <TrendingDown className="w-3 h-3 mr-1" />
            Descompte aplicat
          </div>
        )}
        
        {hasSurcharges && (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400">
            <TrendingUp className="w-3 h-3 mr-1" />
            Suplement aplicat
          </div>
        )}
        
        {priceBreakdown.modifiers.some(m => m.icon === 'vip') && (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
            <Star className="w-3 h-3 mr-1" />
            VIP
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="text-blue-900 dark:text-blue-100 font-medium mb-1">
              Preus dinàmics
            </p>
            <p className="text-blue-700 dark:text-blue-300">
              Els preus varien segons el dia, hora i disponibilitat. Aquest preu està garantit per a la reserva.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
