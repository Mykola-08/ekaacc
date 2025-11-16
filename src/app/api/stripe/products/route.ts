import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

export async function GET() {
  try {
    // Fetch all products
    const products = await stripe.products.list({
      limit: 100,
      active: true,
    });

    // Fetch all prices
    const prices = await stripe.prices.list({
      limit: 100,
      active: true,
    });

    return NextResponse.json({
      success: true,
      products: products.data,
      prices: prices.data,
    });
  } catch (error) {
    console.error('Error fetching Stripe products:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch Stripe products' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, images, metadata } = body;

    // Create product
    const product = await stripe.products.create({
      name,
      description,
      images,
      metadata: metadata || {},
    });

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('Error creating Stripe product:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create Stripe product' 
      },
      { status: 500 }
    );
  }
}