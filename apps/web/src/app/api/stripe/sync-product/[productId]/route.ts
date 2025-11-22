import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { supabase } from '@/lib/supabase';

function getStripeClient(): Stripe | null {
  const apiKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!apiKey || !apiKey.startsWith('sk_')) {
    return null;
  }
  try {
    return new Stripe(apiKey, { apiVersion: '2025-10-29.clover' });
  } catch (e) {
    console.warn('Stripe initialization failed in sync-product route:', e);
    return null;
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
  
  const stripe = getStripeClient();
  if (!stripe) {
    return NextResponse.json({ success: false, error: 'Stripe not configured' }, { status: 400 });
  }
  try {
    // Fetch product from database
    const { data: product, error: dbError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (dbError || !product) {
      return NextResponse.json(
        { success: false, error: 'Product not found in database' },
        { status: 404 }
      );
    }

    let stripeProductId = product.stripe_product_id;
    let stripePriceId = product.stripe_price_id;

    // Create or update Stripe product
    if (!stripeProductId) {
      // Create new product
      const stripeProduct = await stripe.products.create({
        name: product.name,
        description: product.description,
        images: product.images || [],
        metadata: {
          database_id: product.id,
          category: product.category,
          type: product.type,
          difficulty: product.difficulty,
          duration: product.duration.toString(),
        },
        active: product.is_active,
      });

      stripeProductId = stripeProduct.id;

      // Create price for the product
      const stripePrice = await stripe.prices.create({
        product: stripeProductId,
        unit_amount: Math.round(product.price * 100), // Convert to cents
        currency: 'eur',
        active: product.is_active,
      });

      stripePriceId = stripePrice.id;
    } else {
      // Update existing product
      await stripe.products.update(stripeProductId, {
        name: product.name,
        description: product.description,
        images: product.images || [],
        metadata: {
          database_id: product.id,
          category: product.category,
          type: product.type,
          difficulty: product.difficulty,
          duration: product.duration.toString(),
        },
        active: product.is_active,
      });

      // Update or create price
      if (stripePriceId) {
        // Deactivate old price
        await stripe.prices.update(stripePriceId, { active: false });
      }

      // Create new price
      const newStripePrice = await stripe.prices.create({
        product: stripeProductId,
        unit_amount: Math.round(product.price * 100),
        currency: 'eur',
        active: product.is_active,
      });

      stripePriceId = newStripePrice.id;
    }

    // Update database with Stripe IDs and sync status
    const { error: updateError } = await supabase
      .from('products')
      .update({
        stripe_product_id: stripeProductId,
        stripe_price_id: stripePriceId,
        sync_status: 'synced',
        last_sync_at: new Date().toISOString(),
        sync_error: null,
      })
      .eq('id', productId);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      data: {
        stripe_product_id: stripeProductId,
        stripe_price_id: stripePriceId,
      },
    });
  } catch (error) {
    console.error('Error syncing product with Stripe:', error);

    // Update database with sync error
    await supabase
      .from('products')
      .update({
        sync_status: 'error',
        sync_error: error instanceof Error ? error.message : 'Unknown error',
      })
      .eq('id', productId);

    return NextResponse.json({ success: false, error: 'Failed to sync product with Stripe' }, { status: 500 });
  }
}