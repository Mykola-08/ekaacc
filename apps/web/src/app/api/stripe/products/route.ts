import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function getStripeClient(): Stripe | null {
  const apiKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!apiKey || !apiKey.startsWith('sk_')) {
    return null;
  }
  try {
    return new Stripe(apiKey, { apiVersion: '2025-10-29.clover' });
  } catch (e) {
    console.warn('Stripe initialization failed in products route:', e);
    return null;
  }
}

export async function GET() {
  const stripe = getStripeClient();
  if (!stripe) {
    return NextResponse.json({ success: true, stripeConfigured: false, products: [], prices: [] });
  }
  try {
    const products = await stripe.products.list({ limit: 100, active: true });
    const prices = await stripe.prices.list({ limit: 100, active: true });
    return NextResponse.json({ success: true, stripeConfigured: true, products: products.data, prices: prices.data });
  } catch (error) {
    console.error('Error fetching Stripe products:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch Stripe products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const stripe = getStripeClient();
  if (!stripe) {
    return NextResponse.json({ success: false, error: 'Stripe not configured' }, { status: 400 });
  }
  try {
    const body = await request.json();
    const { name, description, images, metadata } = body;
    const product = await stripe.products.create({ name, description, images, metadata: metadata || {} });
    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Error creating Stripe product:', error);
    return NextResponse.json({ success: false, error: 'Failed to create Stripe product' }, { status: 500 });
  }
}