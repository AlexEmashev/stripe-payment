import React, { useMemo, useReducer } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Routes, Route, BrowserRouter,
} from 'react-router-dom';
import reducer, { defaultState } from 'reducers/appReducer';
import CartContext from 'hooks/useAppContext';
import PageCart from 'components/PageCart/PageCart';
import PageProducts from 'components/PageProducts/PageProducts';
import PagePayment from 'components/PagePayment/PagePayment';
import StripePaymentResult from 'components/StripeCheckout/StripePaymentResult';
import './App.css';
import Layout from 'components/Layout/Layout';

// ToDo: move to specific part
function initStripeKey() {
  const stripePublicKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY;
  if (!stripePublicKey) throw new Error('No stripe public key provided');

  return stripePublicKey;
}

const stripePromise = loadStripe(initStripeKey());

function App() {
  // Initialize cart state and despatch method
  const [state, dispatch] = useReducer(reducer, defaultState);

  // Create cart context with state and dispatch
  // This context object will be provided for child components
  const providerState = useMemo(() => ({
    state,
    dispatch,
    stripePromise,
  }), [state, stripePromise]);

  return (
    <CartContext.Provider value={providerState}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Layout />}
          >
            <Route
              index
              element={<PageProducts />}
            />
            <Route
              path="cart"
              element={<PageCart />}
            />
            <Route
              path="payment"
              element={<PagePayment />}
            />
            <Route
              path="stripe-result"
              element={<StripePaymentResult />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartContext.Provider>
  );
}

export default App;
