// pages/api/create-checkout-session.ts
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { priceId } = req.body;

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

    res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe checkout error:', err.message);
    res.status(500).json({ error: 'Stripe checkout failed. ' + err.message });
  }
}



