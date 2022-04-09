// Load environment variables from the .env file
import dotenv from 'dotenv';
import express from 'express';
import stripe from 'stripe';

dotenv.config({path: '../.env'});

console.log(`🔰 Env:`, process.env);

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
 * Create payment intent
 */
app.post('/checkout', async (req, res) => {
  try {
    const buyingItems = getBuyingItems(req.body.items);
    const orderAmount = buyingItems.reduce((amount, currentItem) => (
      currentItem.price_data.unit_amount * currentItem.quantity + amount), 0);

    console.log(`🔰 Order amount:`, orderAmount);

    const paymentIntent = await stripeAPI.paymentIntents.create({
      amount: orderAmount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      }
    });

    res.json({clientSecret: paymentIntent.client_secret});
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

function getBuyingItems(items) {
  if (items === null || items === undefined) {
    throw new Error(`No shopping cart object passed`);
  }

  if (items.length === 0) {
    throw new Error(`Shopping cart is empty`);
  }

  const buyingItems = items.map(item => {
    const buyingProduct = products.find(p => p.id === item.id);

    if (!buyingProduct) {
      throw new Error(`Can't find product with id=${item.id} and name=${item.name}`);
    }

    if (item.amount <= 0) {
      throw new Error(`Can't buy ${amount} of ${item.name}`);
    }

    return {
      price_data: {
        currency: 'usd',
        product_data: {
          name: buyingProduct.name
        },
        unit_amount:getItemPriceInCents(buyingProduct.id, buyingProduct.price),
      },
      quantity: item.amount
    }
  });

  return buyingItems;
}

function getItemPriceInCents(id, priceInDollars) {
  if (priceInDollars === undefined
    || priceInDollars === null
    || Number.priceInDollars < 0
  ) {
    throw new Error(`Price should be 0 or more cents. Price of item with id=${id} is ${priceInDollars}`);
  }
  return priceInDollars * 100;
}

console.log(`🔰 Server is running on port: ${process.env.BACKEND_SERVER_PORT}`);
// Start server
app.listen(process.env.BACKEND_SERVER_PORT);
