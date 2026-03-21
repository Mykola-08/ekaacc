import { useDiscount } from '@/marketing/contexts/DiscountContext';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowTurnDownIcon, AnalyticsUpIcon, StarIcon } from '@hugeicons/core-free-icons';

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
    <div className={`flex items-center ${className}`}>
      {/* Main Price */}
      <div className={`font-light text-gray-900 tabular-nums ${sizeClasses[size]}`}>
        {formatPrice(actualFinalPrice)}
      </div>

      {/* Price Change Indicator */}
      {showCalculation && actualFinalPrice !== basePriceCents && (
        <div className="flex items-center">
          {hasDiscount && (
            <>
              <HugeiconsIcon icon={ArrowTurnDownIcon} className="size-4 text-green-500" />
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(basePriceCents)}
              </span>
            </>
          )}

          {hasSurcharge && (
            <>
              <HugeiconsIcon icon={AnalyticsUpIcon} className="size-4 text-orange-500" />
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(basePriceCents)}
              </span>
            </>
          )}
        </div>
      )}

      {/* Special Badge */}
      {hasDiscount && selectedDiscount && (
        <div className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
          <HugeiconsIcon icon={StarIcon} className="mr-1 size-3" />
          {selectedDiscount.name} -{selectedDiscount.percentage}%
        </div>
      )}
    </div>
  );
}
