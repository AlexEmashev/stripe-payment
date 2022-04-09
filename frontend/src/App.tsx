import React, { useMemo, useReducer } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import cartReducer, { cartDefaultState } from 'reducers/cartReducer';
import CartContext from 'hooks/useCartContext';
import PageCart from 'components/PageCart/PageCart';
import PageProducts from 'components/PageProducts/PageProducts';
import './App.css';
import PagePayment from 'components/PagePayment/PagePayment';
import PagePaymentResult from 'components/PagePaymentResult/PagePaymentResult';

function initStripeKey() {
  const stripePublicKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY;
  if (!stripePublicKey) throw new Error('No stripe public key provided');

  return stripePublicKey;
}

const stripePromise = loadStripe(initStripeKey());

function App() {
  // Initialize cart state and despatch method
  const [cartState, cartDispatch] = useReducer(cartReducer, cartDefaultState);
  // Create cart context with state and dispatch
  // This context object will be provided for child components
  const providerState = useMemo(() => ({
    cartState,
    cartDispatch,
    stripePromise,
  }), [cartState]);

  return (
    <CartContext.Provider value={providerState}>
      <div className="w3-bar w3-xlarge w3-padding w3-purple w3-opacity-min">
        <a
          href="/"
          className="w3-bar-item w3-button"
        >
          HOME
        </a>
        <a
          href="/cart"
          className="w3-bar-item w3-button"
        >
          CART
        </a>
      </div>
      <div className="w3-content w3-padding">
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={<PageProducts />}
            />
            <Route
              path="/cart"
              element={<PageCart />}
            />
            <Route
              path="/payment"
              element={<PagePayment />}
            />
            <Route
              path="/payment-result"
              element={<PagePaymentResult />}
            />
          </Routes>
        </BrowserRouter>
      </div>
    </CartContext.Provider>
  );
}

export default App;
