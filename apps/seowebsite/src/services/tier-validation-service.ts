export const getTierValidationService = () => ({
    validate: async (args: any) => ({ valid: true }),
    assignTier: async (args: any) => ({ success: true }),
});
