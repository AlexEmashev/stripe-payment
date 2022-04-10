import React, { useEffect, useState } from 'react';
import {
  Elements,
} from '@stripe/react-stripe-js';
import {
  loadStripe, Stripe, StripeElementsOptions,
} from '@stripe/stripe-js';
import Swal from 'sweetalert2';
import { getTotalPrice } from 'utils/price_utils';
import { useAppContext } from 'hooks/useAppContext';
import StripeCheckoutForm from 'components/StripeCheckout/StripeCheckoutForm';
import Loader from 'components/Loader/Loader';

/**
 * Checkout using Stripe payment system
 */
export default function StripeCheckout() {
  // Get stripe promise using public key. This promise is required to initialize Elements provider
  const [stripePromise] = useState<Promise<Stripe | null>>(() => {
    const stripePublicKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY;
    if (!stripePublicKey) throw new Error('No stripe public key provided');

    return loadStripe(stripePublicKey);
  });
  // Get client-secret from our server after initializing a payment intent
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isErrored, setisErrored] = useState<boolean>(false);

  const context = useAppContext();

  // Get Stripe payment intent from our server
  useEffect(() => {
    fetch('/checkout-stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items: context?.state.cart }),
    }).then((res) => {
      if (res.ok) return res.json();

      return res.json().then((json) => Promise.reject(json));
    })
      .then((res) => {
        setClientSecret(res.clientSecret);
      })
      .catch((error) => {
        console.error(error);
        setisErrored(true);

        Swal.fire({
          icon: 'error',
          text: error.message || error || 'Error while initializing payment',
        });
      });
  }, []);

  const getIsLoading = () => {
    if (isErrored) return false;

    if (!clientSecret || !context) return true;

    return false;
  };

  const renderPaymentForm = () => {
    if (isErrored) {
      return (
        <h2 className="w3-center color-text-danger">
          Error while initializing payment on the server.
        </h2>
      );
    }

    if (!context || !clientSecret) return null;

    const total = getTotalPrice(context.state.cart);
    const stripeOptions: StripeElementsOptions = {
      clientSecret,
      appearance: {
        theme: 'stripe',
      },
    };

    return (
      <Elements
        options={stripeOptions}
        stripe={stripePromise}
      >
        <StripeCheckoutForm paymentAmount={total} />
      </Elements>
    );
  };

  return getIsLoading() ? (
    <div
      className="w3-container"
      style={{
        width: 200,
        height: 200,
        margin: '0 auto',
        overflow: 'hidden',
      }}
    >
      <Loader />
    </div>
  )
    : renderPaymentForm();
}
