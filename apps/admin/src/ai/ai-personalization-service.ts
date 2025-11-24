/**
 * Re-export AI personalization service from shared package
 * This wrapper ensures proper dependency injection for AISDKNextService
 */
import { AIPersonalizationService as BaseAIPersonalizationService } from '@ekaacc/ai-services';
import { AISDKNextService } from './ai-sdk-next-service';

export class AIPersonalizationService extends BaseAIPersonalizationService {
  constructor() {
    super(AISDKNextService.getInstance());
  }
}

// For direct import compatibility
export { AIPersonalizationService as default };
