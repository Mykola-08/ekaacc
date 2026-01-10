export const getTierValidationService = async () => ({
    validate: async (args: any) => ({ valid: true }),
    assignTier: async (args: any) => ({ success: true }),
    validateVIPTierEligibility: async (_userId: string, _tier: any) => ({ isEligible: true, missingRequirements: [], progress: {} }),
    validateLoyaltyTierEligibility: async (_userId: string, _tier: any) => ({ isEligible: true, missingRequirements: [], progress: {} }),
    getVIPTierProgress: async (_userId: string, _tier: any) => ({ progress: 0, nextRequirements: [] }),
    getLoyaltyTierProgress: async (_userId: string, _tier: any) => ({ progress: 0, nextRequirements: [] }),
});
