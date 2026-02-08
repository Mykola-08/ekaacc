
export interface Discount {
    id: string;
    name: string;
    percentage: number;
    code: string;
    description?: string;
    isActive: boolean;
}

export interface DiscountContextType {
    selectedDiscount: Discount | null;
    availableDiscounts: Discount[];
    applyDiscount: (code: string) => Promise<boolean>;
    removeDiscount: () => void;
    calculateDiscountedPrice: (originalPrice: number) => number;
    getDiscountAmount: (originalPrice: number) => number;
    isLoading: boolean;
}

