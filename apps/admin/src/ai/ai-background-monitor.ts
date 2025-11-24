/**
 * Re-export AI background monitor from shared package
 * This wrapper ensures proper dependency injection for AISDKNextService
 */
import { AIBackgroundMonitor as BaseAIBackgroundMonitor } from '@ekaacc/ai-services';
import { AISDKNextService } from './ai-sdk-next-service';
import { AIPersonalizationService } from './ai-personalization-service';

export class AIBackgroundMonitor extends BaseAIBackgroundMonitor {
  constructor() {
    const aiService = AISDKNextService.getInstance();
    const personalizationService = new AIPersonalizationService();
    super(aiService, personalizationService);
  }
}

// For direct import compatibility
export { AIBackgroundMonitor as default };
