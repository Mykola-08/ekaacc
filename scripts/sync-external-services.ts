/**
 * Sync External Services Script
 * Fetches products and prices from Stripe and Square, then syncs to database
 * Run with: tsx scripts/sync-external-services.ts
 */

// Load environment variables FIRST
import { config } from 'dotenv';
import { resolve } from 'path';

// Try .env.local first, then .env
const envPath = resolve(process.cwd(), '.env.local');
config({ path: envPath });

import ExternalServicesSync from '../src/services/external-services-sync';

// Mock Stripe data (replace with actual Stripe API calls when available)
const stripeProducts = [
  {
    id: 'prod_TS8drwYdiXwS47',
    name: 'Kinesiology Session',
    type: 'service',
    description: 'Integrative Therapy: Body, Mind, Emotions.',
    active: true,
  },
  {
    id: 'prod_TS8dF50t9BeV9Y',
    name: 'Constellations',
    type: 'service',
    description: 'Systemic Constellations session.',
    active: true,
  },
  {
    id: 'prod_TS8dBgOv4qSDlP',
    name: '360° Review',
    type: 'service',
    description: 'Deep diagnosis at all levels: Physical, Biochemical, Psycho-emotional.',
    active: true,
  },
  {
    id: 'prod_TS8dhiATaMuB4Y',
    name: 'Muscle Tension Relief 4 in 1',
    type: 'service',
    description:
      'Personalized sessions to relieve muscle tension and pain. Combination of massage, osteopathy techniques, and neuro-movement.',
    active: true,
  },
  {
    id: 'prod_TS8Jocrst4dhCz',
    name: 'EKA Privé VIP',
    type: 'service',
    description: 'Top tier. 24h support, atención directa, visitas a domicilio.',
    active: true,
  },
  {
    id: 'prod_TS8JeIarwUHOVx',
    name: 'Servicios Corporativos',
    type: 'service',
    description: 'Servicios para empresas: Individual, Grupos y Seminarios.',
    active: true,
  },
  {
    id: 'prod_TS8J0ggYJXApPp',
    name: 'Suscripción Diamond',
    type: 'service',
    description: 'Nivel máximo. Todo incluido.',
    active: true,
  },
  {
    id: 'prod_TS8JGwfEPr72Em',
    name: 'Movement Lesson',
    type: 'service',
    description: 'Lecciones de movimiento especializadas.',
    active: true,
  },
  {
    id: 'prod_TS8JfQuQl0tZN0',
    name: 'Nutrición Integrativa',
    type: 'service',
    description: 'Enfoque integral de la nutrición y el bienestar.',
    active: true,
  },
  {
    id: 'prod_TS8JuRvSgYKGxz',
    name: 'Suscripción Silver',
    type: 'service',
    description: 'Nivel intermedio. Más sesiones y prioridad.',
    active: true,
  },
  {
    id: 'prod_TS8JV8jzkfVXdH',
    name: 'Suscripción Gold',
    type: 'service',
    description: 'Nivel avanzado. Atención preferente y más servicios.',
    active: true,
  },
  {
    id: 'prod_TS8JEL8dsRqD4g',
    name: 'Sesión Individual',
    type: 'service',
    description: 'Sesión base del negocio. Sirve para masaje, kinesiología, osteobalance, emocions, todo.',
    active: true,
  },
  {
    id: 'prod_TS8JhyBkCuQbxy',
    name: 'Feldenkrais',
    type: 'service',
    description: 'Método Feldenkrais para la conciencia a través del movimiento.',
    active: true,
  },
  {
    id: 'prod_TS8JZoNVhVc3jO',
    name: 'Suscripción Bronze',
    type: 'service',
    description: 'Nivel de entrada. Incluye sesiones y consultas online.',
    active: true,
  },
  {
    id: 'prod_TS8JB5147pRCZj',
    name: 'Pack de Sesiones',
    type: 'service',
    description: 'Packs para clientes recurrentes. Ahorro por sesión.',
    active: true,
  },
  {
    id: 'prod_Sp3w3fQSZQdLZJ',
    name: 'Free Consultation',
    type: 'service',
    description: null,
    active: true,
  },
  {
    id: 'prod_Sp3irKlQV5itAs',
    name: 'Massage Rubí Premium',
    type: 'service',
    description: null,
    active: true,
  },
  {
    id: 'prod_Sp3gI9ZYTX3tuN',
    name: 'Massage Rubí Full',
    type: 'service',
    description: null,
    active: true,
  },
  {
    id: 'prod_Sp3dFrzGA1X2Sn',
    name: 'Massage Rubí Basic',
    type: 'service',
    description: null,
    active: true,
  },
  {
    id: 'prod_SonVixpIkqR3vd',
    name: '360° Revision',
    type: 'service',
    description: 'Una experiència completa dissenyada per entendre i tractar totes les dimensions del teu benestar',
    active: true,
  },
  {
    id: 'prod_SoOVpSUzSi5XVV',
    name: 'Kinesiology Barcelona',
    type: 'service',
    description: null,
    active: true,
  },
  {
    id: 'prod_SoHrIYeNvSTzwC',
    name: 'Massage Barcelona VIP',
    type: 'service',
    description: null,
    active: true,
  },
  {
    id: 'prod_SoHq4a1F8jY1K3',
    name: 'Massage Barcelona Premium',
    type: 'service',
    description: null,
    active: true,
  },
  {
    id: 'prod_SoHp4eTHIKpL5D',
    name: 'Massage Barcelona Full',
    type: 'service',
    description: null,
    active: true,
  },
  {
    id: 'prod_SFz1AAPT4Su1Hy',
    name: 'Massage Barcelona Basic',
    type: 'service',
    description: null,
    active: true,
  },
];

const stripePrices = [
  { id: 'price_1SVEMvGpCi2bO2ATJmBKgdUo', amount: 7000, currency: 'eur', product: 'prod_Sp3gI9ZYTX3tuN', type: 'one_time', recurring: null },
  { id: 'price_1SVEMvGpCi2bO2ATQXGsiSDG', amount: 7500, currency: 'eur', product: 'prod_TS8drwYdiXwS47', type: 'one_time', recurring: null as null | { interval: string; interval_count: number; trial_period_days?: number } },
  { id: 'price_1SVEMYGpCi2bO2ATxby49WbZ', amount: 7500, currency: 'eur', product: 'prod_TS8drwYdiXwS47', type: 'one_time', recurring: null as null | { interval: string; interval_count: number; trial_period_days?: number } },
  { id: 'price_1SVEMYGpCi2bO2ATP9PfqUJH', amount: 7000, currency: 'eur', product: 'prod_TS8dhiATaMuB4Y', type: 'one_time', recurring: null as null | { interval: string; interval_count: number; trial_period_days?: number } },
  { id: 'price_1SVEMYGpCi2bO2AT8I6ZxmMc', amount: 5000, currency: 'eur', product: 'prod_TS8drwYdiXwS47', type: 'one_time', recurring: null as null | { interval: string; interval_count: number; trial_period_days?: number } },
  { id: 'price_1SVEMYGpCi2bO2ATdGmsL2m5', amount: 7500, currency: 'eur', product: 'prod_TS8dF50t9BeV9Y', type: 'one_time', recurring: null as null | { interval: string; interval_count: number; trial_period_days?: number } },
  { id: 'price_1SVEMYGpCi2bO2ATj6KtDKG3', amount: 8500, currency: 'eur', product: 'prod_TS8dF50t9BeV9Y', type: 'one_time', recurring: null as null | { interval: string; interval_count: number; trial_period_days?: number } },
  { id: 'price_1SVEMYGpCi2bO2ATK4lyoEiM', amount: 17000, currency: 'eur', product: 'prod_TS8dBgOv4qSDlP', type: 'one_time', recurring: null as null | { interval: string; interval_count: number; trial_period_days?: number } },
  { id: 'price_1SVEMYGpCi2bO2ATB9ffzfPs', amount: 6000, currency: 'eur', product: 'prod_TS8drwYdiXwS47', type: 'one_time', recurring: null as null | { interval: string; interval_count: number; trial_period_days?: number } },
  { id: 'price_1SVEMYGpCi2bO2ATJgcLejnC', amount: 8000, currency: 'eur', product: 'prod_TS8dhiATaMuB4Y', type: 'one_time', recurring: null as null | { interval: string; interval_count: number; trial_period_days?: number } },
  { id: 'price_1SVEMYGpCi2bO2ATZcQWCiAd', amount: 15000, currency: 'eur', product: 'prod_TS8dBgOv4qSDlP', type: 'one_time', recurring: null as null | { interval: string; interval_count: number; trial_period_days?: number } },
  { id: 'price_1SVEMYGpCi2bO2ATYt6vmxgW', amount: 5500, currency: 'eur', product: 'prod_TS8dhiATaMuB4Y', type: 'one_time', recurring: null as null | { interval: string; interval_count: number; trial_period_days?: number } },
  { id: 'price_1SVE3gGpCi2bO2ATjMEoOay1', amount: 6000, currency: 'eur', product: 'prod_TS8JGwfEPr72Em', type: 'one_time', recurring: null as null | { interval: string; interval_count: number; trial_period_days?: number } },
  {
    id: 'price_1SVE3fGpCi2bO2ATR6nND30U',
    amount: 50000,
    currency: 'eur',
    product: 'prod_TS8Jocrst4dhCz',
    type: 'recurring',
    recurring: { interval: 'month' as const, interval_count: 1, trial_period_days: undefined },
  },
  { id: 'price_1SVE3fGpCi2bO2ATPqPqzGcM', amount: 6000, currency: 'eur', product: 'prod_TS8JhyBkCuQbxy', type: 'one_time', recurring: null as null | { interval: string; interval_count: number; trial_period_days?: number } },
  { id: 'price_1SVE3fGpCi2bO2ATuTGitjUR', amount: 6000, currency: 'eur', product: 'prod_TS8JfQuQl0tZN0', type: 'one_time', recurring: null as null | { interval: string; interval_count: number; trial_period_days?: number } },
  {
    id: 'price_1SVE3fGpCi2bO2AT3QVAVvTh',
    amount: 17500,
    currency: 'eur',
    product: 'prod_TS8JV8jzkfVXdH',
    type: 'recurring',
    recurring: { interval: 'month' as const, interval_count: 1, trial_period_days: undefined },
  },
  { id: 'price_1SVE3fGpCi2bO2ATMd9MdFoC', amount: 10000, currency: 'eur', product: 'prod_TS8JeIarwUHOVx', type: 'one_time', recurring: null as null | { interval: string; interval_count: number; trial_period_days?: number } },
  { id: 'price_1SVE3fGpCi2bO2ATvQ3uD2LL', amount: 36000, currency: 'eur', product: 'prod_TS8JB5147pRCZj', type: 'one_time', recurring: null as null | { interval: string; interval_count: number; trial_period_days?: number } },
  { id: 'price_1SVE3fGpCi2bO2AT0zUbWHE7', amount: 6000, currency: 'eur', product: 'prod_TS8JEL8dsRqD4g', type: 'one_time', recurring: null as null | { interval: string; interval_count: number; trial_period_days?: number } },
  {
    id: 'price_1SVE3fGpCi2bO2ATP1Fepww2',
    amount: 25000,
    currency: 'eur',
    product: 'prod_TS8J0ggYJXApPp',
    type: 'recurring',
    recurring: { interval: 'month' as const, interval_count: 1, trial_period_days: undefined },
  },
  {
    id: 'price_1SVE3fGpCi2bO2ATqgom693C',
    amount: 10000,
    currency: 'eur',
    product: 'prod_TS8JuRvSgYKGxz',
    type: 'recurring',
    recurring: { interval: 'month' as const, interval_count: 1, trial_period_days: undefined },
  },
  {
    id: 'price_1SVE3fGpCi2bO2ATeYKFDWSO',
    amount: 5000,
    currency: 'eur',
    product: 'prod_TS8JZoNVhVc3jO',
    type: 'recurring',
    recurring: { interval: 'month' as const, interval_count: 1, trial_period_days: undefined },
  },
  { id: 'price_1SVE3fGpCi2bO2ATrh6SFhc3', amount: 7500, currency: 'eur', product: 'prod_TS8JEL8dsRqD4g', type: 'one_time', recurring: null as null | { interval: string; interval_count: number; trial_period_days?: number } },
  { id: 'price_1SVE3fGpCi2bO2AT9pI92nQa', amount: 22000, currency: 'eur', product: 'prod_TS8JB5147pRCZj', type: 'one_time', recurring: null as null | { interval: string; interval_count: number; trial_period_days?: number } },
  { id: 'price_1SVE3fGpCi2bO2ATRmeFm0Ua', amount: 30000, currency: 'eur', product: 'prod_TS8JB5147pRCZj', type: 'one_time', recurring: null as null | { interval: string; interval_count: number; trial_period_days?: number } },
  { id: 'price_1RtPo9GpCi2bO2ATXfH8ecQ4', amount: 0, currency: 'eur', product: 'prod_Sp3w3fQSZQdLZJ', type: 'one_time', recurring: null as null | { interval: string; interval_count: number; trial_period_days?: number } },
  { id: 'price_1RtPeTGpCi2bO2ATNDHvBQ0M', amount: 27500, currency: 'eur', product: 'prod_Sp3gI9ZYTX3tuN', type: 'one_time', recurring: null as null | { interval: string; interval_count: number; trial_period_days?: number } },
  { id: 'price_1RtPdlGpCi2bO2AToK1It9Qk', amount: 20000, currency: 'eur', product: 'prod_Sp3gI9ZYTX3tuN', type: 'one_time', recurring: null as null | { interval: string; interval_count: number; trial_period_days?: number } },
  { id: 'price_1RtPd2GpCi2bO2AT6LBI1obX', amount: 18000, currency: 'eur', product: 'prod_Sp3dFrzGA1X2Sn', type: 'one_time', recurring: null as null | { interval: string; interval_count: number; trial_period_days?: number } },
  { id: 'price_1RtPckGpCi2bO2AT69MYLCmv', amount: 13500, currency: 'eur', product: 'prod_Sp3dFrzGA1X2Sn', type: 'one_time', recurring: null as null | { interval: string; interval_count: number; trial_period_days?: number } },
  { id: 'price_1RtPb0GpCi2bO2ATTwU1uC4N', amount: 8000, currency: 'eur', product: 'prod_Sp3irKlQV5itAs', type: 'one_time', recurring: null as null | { interval: string; interval_count: number; trial_period_days?: number } },
  { id: 'price_1RtPZ5GpCi2bO2ATkaRPsNar', amount: 6500, currency: 'eur', product: 'prod_Sp3gI9ZYTX3tuN', type: 'one_time', recurring: null as null | { interval: string; interval_count: number; trial_period_days?: number } },
  { id: 'price_1RtPWEGpCi2bO2ATfPBp8ssN', amount: 5000, currency: 'eur', product: 'prod_Sp3dFrzGA1X2Sn', type: 'one_time', recurring: null as null | { interval: string; interval_count: number; trial_period_days?: number } },
  { id: 'price_1Rt9ugGpCi2bO2ATnF32KM2Q', amount: 15000, currency: 'eur', product: 'prod_SonVixpIkqR3vd', type: 'one_time', recurring: null as null | { interval: string; interval_count: number; trial_period_days?: number } },
  { id: 'price_1RslidGpCi2bO2ATa68cf8GD', amount: 7500, currency: 'eur', product: 'prod_SoOVpSUzSi5XVV', type: 'one_time', recurring: null as null | { interval: string; interval_count: number; trial_period_days?: number } },
  { id: 'price_1RslYqGpCi2bO2ATpmj7noiL', amount: 32500, currency: 'eur', product: 'prod_SoHp4eTHIKpL5D', type: 'one_time', recurring: null as null | { interval: string; interval_count: number; trial_period_days?: number } },
  { id: 'price_1RslYqGpCi2bO2AT5lT8FzRM', amount: 25000, currency: 'eur', product: 'prod_SoHp4eTHIKpL5D', type: 'one_time', recurring: null as null | { interval: string; interval_count: number; trial_period_days?: number } },
  { id: 'price_1RslVEGpCi2bO2ATSsj6oUsR', amount: 25000, currency: 'eur', product: 'prod_SFz1AAPT4Su1Hy', type: 'one_time', recurring: null as null | { interval: string; interval_count: number; trial_period_days?: number } },
  { id: 'price_1RslVEGpCi2bO2ATCxyyXyxi', amount: 16500, currency: 'eur', product: 'prod_SFz1AAPT4Su1Hy', type: 'one_time', recurring: null as null | { interval: string; interval_count: number; trial_period_days?: number } },
  { id: 'price_1RsfHQGpCi2bO2ATiDwhqNpo', amount: 15000, currency: 'eur', product: 'prod_SoHrIYeNvSTzwC', type: 'one_time', recurring: null as null | { interval: string; interval_count: number; trial_period_days?: number } },
  { id: 'price_1RsfGbGpCi2bO2ATLys33g4J', amount: 10000, currency: 'eur', product: 'prod_SoHq4a1F8jY1K3', type: 'one_time', recurring: null as null | { interval: string; interval_count: number; trial_period_days?: number } },
  { id: 'price_1RsfG9GpCi2bO2AT4qomh8Z8', amount: 7500, currency: 'eur', product: 'prod_SoHp4eTHIKpL5D', type: 'one_time', recurring: null as null | { interval: string; interval_count: number; trial_period_days?: number } },
  { id: 'price_1RsfByGpCi2bO2AT21GD2ehH', amount: 6000, currency: 'eur', product: 'prod_SFz1AAPT4Su1Hy', type: 'one_time', recurring: null as null | { interval: string; interval_count: number; trial_period_days?: number } },
  { id: 'price_1RLT39GpCi2bO2AT2gYvmK9o', amount: 5000, currency: 'eur', product: 'prod_SFz1AAPT4Su1Hy', type: 'one_time', recurring: null as null | { interval: string; interval_count: number; trial_period_days?: number } },
];

async function main() {
  console.log('🔄 Starting external services sync...\n');

  try {
    // Sync Stripe data
    console.log('📦 Syncing Stripe products and prices...');
    const result = await ExternalServicesSync.syncStripe(stripeProducts, stripePrices);

    console.log('\n✅ Stripe Products Sync Results:');
    console.log(`   Processed: ${result.products.itemsProcessed}`);
    console.log(`   Created: ${result.products.itemsCreated}`);
    console.log(`   Updated: ${result.products.itemsUpdated}`);
    console.log(`   Failed: ${result.products.itemsFailed}`);
    console.log(`   Duration: ${result.products.duration}ms`);

    if (result.products.errors.length > 0) {
      console.log('\n⚠️  Product Errors:');
      result.products.errors.forEach((error) => console.log(`   - ${error}`));
    }

    console.log('\n✅ Stripe Prices Sync Results:');
    console.log(`   Processed: ${result.prices.itemsProcessed}`);
    console.log(`   Created: ${result.prices.itemsCreated}`);
    console.log(`   Updated: ${result.prices.itemsUpdated}`);
    console.log(`   Failed: ${result.prices.itemsFailed}`);
    console.log(`   Duration: ${result.prices.duration}ms`);

    if (result.prices.errors.length > 0) {
      console.log('\n⚠️  Price Errors:');
      result.prices.errors.forEach((error) => console.log(`   - ${error}`));
    }

    // Get sync status
    console.log('\nSync Status:');
    const status = await ExternalServicesSync.getSyncStatus('stripe');
    if (status) {
      console.log(`   Last Sync: ${status.last_sync_at || 'Never'}`);
      console.log(`   Status: ${status.sync_status}`);
      if (status.sync_error) {
        console.log(`   Error: ${status.sync_error}`);
      }
    }

    console.log('\nSync completed successfully!');
  } catch (error) {
    console.error('\n❌ Sync failed:', error);
    process.exit(1);
  }
}

main();
