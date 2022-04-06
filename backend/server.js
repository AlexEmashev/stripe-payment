// Load environment variables from the .env file
import dotenv from 'dotenv';
import express from 'express';
import stripe from 'stripe';

dotenv.config();

const app = express();

// For all paths convert body to json
app.use(express.json());

// Setup Stripe
const stripe = stripe(process.env.STRIPE_PRIVATE_KEY);

// ToDo: change me
// This is a list of items for selling

const store = new Map([
  [1, { price: 10000, name: 'JavaScript weird parts' }],
  [1, { price: 10000, name: 'The Twelve-Factor App' }],
]);

// Start server on port
app.listen(4242);