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
      <div className={`font-light text-foreground tabular-nums dark:text-foreground ${sizeClasses[size]}`}>
        {formatPrice(actualFinalPrice)}
      </div>

      {/* Price Change Indicator */}
      {showCalculation && actualFinalPrice !== basePriceCents && (
        <div className="flex items-center space-x-1">
          {hasDiscount && (
            <>
              <TrendingDown className="h-4 w-4 text-success" />
              <span className="text-sm text-muted-foreground line-through dark:text-muted-foreground/60">
                {formatPrice(basePriceCents)}
              </span>
            </>
          )}

          {hasSurcharge && (
            <>
              <TrendingUp className="h-4 w-4 text-warning" />
              <span className="text-sm text-muted-foreground line-through dark:text-muted-foreground/60">
                {formatPrice(basePriceCents)}
              </span>
            </>
          )}
        </div>
      )}

      {/* Special Badge */}
      {hasDiscount && selectedDiscount && (
        <div className="inline-flex items-center rounded-full bg-success/20 px-2 py-1 text-xs font-medium text-success-foreground dark:bg-success/10 dark:text-success">
          <Star className="mr-1 h-3 w-3" />
          {selectedDiscount.name} -{selectedDiscount.percentage}%
        </div>
      )}
    </div>
  );
}
