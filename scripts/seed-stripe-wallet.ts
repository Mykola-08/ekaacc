
import { Stripe } from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
});

// Define products to sync
const WALLET_PRODUCTS = [
  {
    name: 'Wallet Top-up 50€',
    amount: 5000,
    currency: 'eur',
    metadata: { credit_amount: '5000', type: 'wallet_credit' }
  },
  {
    name: 'Wallet Top-up 100€ + 5€ Bonus',
    amount: 10000,
    currency: 'eur',
    metadata: { credit_amount: '10500', type: 'wallet_credit', bonus: '500' }
  },
  {
    name: 'Wallet Top-up 200€ + 20€ Bonus',
    amount: 20000,
    currency: 'eur',
    metadata: { credit_amount: '22000', type: 'wallet_credit', bonus: '2000' }
  }
];

async function seedStripe() {
  console.log('Synchronizing Stripe Products...');

  for (const product of WALLET_PRODUCTS) {
    // 1. Check if exists
    const search = await stripe.products.search({
      query: `name:'${product.name}' AND active:'true'`,
    });

    if (search.data.length > 0) {
      console.log(`✅ Product already exists: ${product.name}`);
      continue;
    }

    // 2. Create Product
    const stripeProduct = await stripe.products.create({
      name: product.name,
      metadata: product.metadata,
    });

    // 3. Create Price
    const price = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: product.amount,
      currency: product.currency,
    });

    console.log(`✨ Created Product: ${product.name}`);
    console.log(`ID_LOG: ${product.name}|${stripeProduct.id}|${price.id}`);
  }
}

// Check for direct execution
if (process.argv[1] === __filename) {
  seedStripe().catch(console.error);
}

export { seedStripe };
