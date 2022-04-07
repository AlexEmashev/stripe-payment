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

// Products to sell
const products =  [
  {
    id: 1,
    name: 'JavaScript Understanding the Weird Parts',
    author: 'Anthony Alicea',
    price: 15.95,
  },
  {
    id: 2,
    name: 'CSS: The Missing Manual',
    author: 'David McFarland',
    price: 15.95,
  },
  {
    id: 3,
    name: 'Design Patterns: Elements of Reusable Object-Oriented Software',
    author: 'Erich Gamma, Richard Helm, John Vlissides, Ralph Johnson',
    price: 15.95,
  },
];

/**
 * Returns list of products
 */
app.get('/products', (req, res) => {
  res.json(products);
});

/**
 * Supports products checkout
 */
app.post('/checkout', async (req, res) => {
  console.log(`🔰 Request:`, req);
  try {
    res.json({success: 'OK'});
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

console.log(`🔰 Server is running on port: ${process.env.SERVER_PORT}`);
// Start server
app.listen(process.env.SERVER_PORT);
