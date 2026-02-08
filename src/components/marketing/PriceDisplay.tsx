import { TrendingDown, TrendingUp, Star } from 'lucide-react';
import { useDiscount } from '@/context/marketing/DiscountContext';

interface PriceDisplayProps {
  basePriceCents: number;
  finalPriceCents?: number;
  showCalculation?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function PriceDisplay({
  basePriceCents,
  finalPriceCents,
  showCalculation = false,
  size = 'md',
  className = '',
}: PriceDisplayProps) {
  const { calculateDiscountedPrice, selectedDiscount } = useDiscount();
  const formatPrice = (cents: number) => `€${(cents / 100).toFixed(0)}`;

  // Apply discount to base price
  const basePrice = basePriceCents / 100;
  const discountedPrice = calculateDiscountedPrice(basePrice);
  const discountedPriceCents = Math.round(discountedPrice * 100);

  const actualFinalPrice = finalPriceCents || discountedPriceCents;
  const hasDiscount = actualFinalPrice < basePriceCents;
  const hasSurcharge = actualFinalPrice > basePriceCents;

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Main Price */}
      <div className={`font-light text-gray-900 tabular-nums dark:text-white ${sizeClasses[size]}`}>
        {formatPrice(actualFinalPrice)}
      </div>

      {/* Price Change Indicator */}
      {showCalculation && actualFinalPrice !== basePriceCents && (
        <div className="flex items-center space-x-1">
          {hasDiscount && (
            <>
              <TrendingDown className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-500 line-through dark:text-gray-400">
                {formatPrice(basePriceCents)}
              </span>
            </>
          )}

          {hasSurcharge && (
            <>
              <TrendingUp className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-gray-500 line-through dark:text-gray-400">
                {formatPrice(basePriceCents)}
              </span>
            </>
          )}
        </div>
      )}

      {/* Special Badge */}
      {hasDiscount && selectedDiscount && (
        <div className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
          <Star className="mr-1 h-3 w-3" />
          {selectedDiscount.name} -{selectedDiscount.percentage}%
        </div>
      )}
    </div>
  );
}
