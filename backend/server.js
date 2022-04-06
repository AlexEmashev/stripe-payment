// Load environment variables from the .env file
import dotenv from 'dotenv';
import express from 'express';
import stripe from 'stripe';

dotenv.config();

const app = express();

// For all paths convert body to json
app.use(express.json());

// Setup Stripe
const stripeAPI = stripe(process.env.STRIPE_PRIVATE_KEY);

// ToDo: change me
// This is a list of items for selling

const store = new Map([
  [1, { price: 10000, name: 'JavaScript weird parts' }],
  [1, { price: 10000, name: 'The Twelve-Factor App' }],
]);

app.post(async (req, res) => {
  console.log(`🔰 Request:`, req);
  try {
    res.json({success: 'OK'});
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
})

// Start server on port
app.listen(4242);