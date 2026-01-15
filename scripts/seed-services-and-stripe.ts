
import { Stripe } from 'stripe';
import { createClient } from '@supabase/supabase-js';

// --- CONFIG ---
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!STRIPE_SECRET_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ Missing Env Vars: STRIPE_SECRET_KEY, SUPABASE_URL, or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const stripe = new Stripe(STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
});
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Define the "Unified Services" that need Stripe Products
// (Mirroring the migration 20260115000005_unified_services_v2.sql)
const SERVICES_TO_SYNC = [
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', // Fixed UUID
    name: 'Psychology Session',
    description: 'Professional therapy session tailored to your needs.',
    category: 'therapy',
    variants: [
       { name: '1h Rubi', amount: 6000, currency: 'eur' },
       { name: '1.5h Rubi', amount: 8500, currency: 'eur' },
       { name: '1h Barcelona', amount: 7000, currency: 'eur' },
       { name: '1.5h Barcelona', amount: 9500, currency: 'eur' }
    ]
  },
  {
      id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', // Fixed UUID
      name: '3 Session Pack',
      description: 'Bundle of 3 sessions. Save 10%.',
      category: 'therapy',
      variants: [
          { name: 'Standard Pack', amount: 16000, currency: 'eur' }
      ]
  },
  {
      id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', // Fixed UUID
      name: 'Office Decompression',
      description: 'Targeted release for desk-bound professionals.',
      category: 'personalized',
      variants: [
          { name: '45min Express (Rubi)', amount: 5000, currency: 'eur' },
          { name: '45min Express (BCN)', amount: 5500, currency: 'eur' }
      ]
  },
  {
      id: 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', // Fixed UUID
      name: '360 Wellness Review',
      description: 'Complete assessment of mental and physical state.',
      category: 'review_360',
      variants: [
          { name: '2h Full Assessment', amount: 15000, currency: 'eur' }
      ]
  }
];

async function main() {
  console.log('🚀 Starting Stripe <-> Supabase Service Sync...');

  for (const service of SERVICES_TO_SYNC) {
    console.log(`\n📦 Processing Service: ${service.name}`);

    // A. Create/Get Stripe Product (Parent)
    // Basic search to prevent dupes
    const search = await stripe.products.search({ query: `name:'${service.name}' AND active:'true'` });
    let product: Stripe.Product;

    if (search.data.length > 0) {
        console.log(`   ✅ Found existing product in Stripe: ${search.data[0].id}`);
        product = search.data[0];
    } else {
        console.log(`   ✨ Creating new Stripe Product...`);
        product = await stripe.products.create({
            name: service.name,
            description: service.description,
            metadata: { 
                category: service.category,
                service_id: service.id
            }
        });
    }

    // B. Update Supabase Service with Stripe Product ID
    const { error: svcError } = await supabase
        .from('service')
        .update({ stripe_product_id: product.id })
        .eq('id', service.id);
    
    if (svcError) console.error(`   ❌ Failed to update Service DB: ${svcError.message}`);
    else console.log(`   ✅ Linked Service DB to Stripe Product: ${product.id}`);


    // C. Process Variants (Prices)
    for (const variantDef of service.variants) {
        console.log(`     🔹 Processing Variant: ${variantDef.name}`);
        
        // Strategy: We always create a fresh price because Price API is immutable for amounts
        // But for this "Seed" script, we can search by lookup_key or metadata if specific
        // For simplicity, we create and just grab ID. In production, prevent endless duplicates.
        
        // Search for a price with same product + amount + currency
        const prices = await stripe.prices.list({
             product: product.id,
             currency: variantDef.currency,
             limit: 100
        });
        
        let price = prices.data.find(p => p.unit_amount === variantDef.amount);

        if (!price) {
            console.log(`       ✨ Creating new Stripe Price (${variantDef.amount/100} ${variantDef.currency})...`);
            price = await stripe.prices.create({
                product: product.id,
                currency: variantDef.currency,
                unit_amount: variantDef.amount,
                nickname: variantDef.name,
                metadata: { variant_name: variantDef.name }
            });
        } else {
            console.log(`       ✅ Found existing price: ${price.id}`);
        }

        // D. Update Supabase Service Variant with Stripe Price ID
        // Note: We need to match the variant in DB. 
        // We'll match by Name + Service ID broadly since IDs are random in DB unless seeded strictly.
        // The migration seeded them by insert, so names should match.
        // "1h Rubi" vs "45min Express"
        
        // Fuzzy match name or starts with (since some map '45min Express (Rubi)' -> '45min Express')
        const { error: varError } = await supabase
            .from('service_variant')
            .update({ stripe_price_id: price.id, stripe_product_id: product.id })
            .eq('service_id', service.id)
            .ilike('name', `%${variantDef.name.substring(0, 10)}%`); // Loose match for demo script
            
        if (varError) console.error(`       ❌ Update DB Failed: ${varError.message}`);
        else console.log(`       ✅ Linked Variant DB to Price: ${price.id}`);
    }
  }

  console.log('\n✅ Sync Complete!');
}

if (process.argv[1] === __filename) {
    main().catch(console.error);
}
