import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia', 
});

export async function POST(req: Request) {
  try {
    // We expect the Dad's Firebase ID to be sent here
    const { dadId } = await req.json();

    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'The Coach - Father of the Year Pool',
              description: '$100 Annual Buy-in. 50% goes to the prize pool. The top 20% of highest-scoring dads win the cash pot. Good luck.',
            },
            unit_amount: 10000, // $100.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: {
        dadId: dadId,
      },
      success_url: `${req.headers.get('origin')}/app/dashboard?stripe_success=true`,
      cancel_url: `${req.headers.get('origin')}/app/dashboard?stripe_canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
