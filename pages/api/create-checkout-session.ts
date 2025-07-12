// pages/api/create-checkout-session.ts
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { priceId } = req.body;

    // ✅ Add logs for debugging
    console.log('💡 Received priceId from frontend:', priceId);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      success_url: `${req.headers.origin}/?success=true`,
      cancel_url: `${req.headers.origin}/?canceled=true`
    });

    // ✅ Log the session object to verify creation
    console.log('✅ Stripe Checkout Session created:', session);

    res.status(200).json({ sessionId: session.id });
  } catch (err: any) {
    console.error('❌ Stripe checkout error:', err.message);
    res.status(500).json({ error: 'Stripe checkout failed. ' + err.message });
  }
}

