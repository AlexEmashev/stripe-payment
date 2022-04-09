import React, { ReactElement } from 'react';
import { useCartContext } from 'hooks/useCartContext';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from 'components/CheckoutForm/CheckoutForm';
import { StripeElementsOptions } from '@stripe/stripe-js';

export default function PagePayment(): ReactElement | null {
  const context = useCartContext();

  if (!context) return null;

  const { cartState: { clientSecret }, stripePromise } = context;

  // ToDo:
  if (!clientSecret) return null;

  const renderPaymentForm = () => {
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
        <CheckoutForm />
      </Elements>
    );
  };

  return (
    <>
      <h2 className="w3-center">Payment</h2>
      {clientSecret && renderPaymentForm()}
    </>
  );
}
