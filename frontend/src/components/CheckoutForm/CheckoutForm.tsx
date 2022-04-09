import React, { useEffect, useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { PaymentIntentResult } from '@stripe/stripe-js';
import Swal from 'sweetalert2';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string|null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Define current payment status
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search)
      .get('payment_intent_client_secret');

    // Absence of the param means payment process has not yet started
    if (!clientSecret) return;

    stripe.retrievePaymentIntent(clientSecret)
      .then((paymentInfo: PaymentIntentResult) => {
        console.log('🔰 Payment info:', paymentInfo);

        const { paymentIntent } = paymentInfo;

        switch (paymentIntent?.status) {
          case 'succeeded':
            setMessage('Payment succeeded!');
            Swal.fire({
              icon: 'success',
              text: 'Payment succeeded!',
            });
            break;
          case 'processing':
            setMessage('Your payment is processing...');
            Swal.fire({
              icon: 'info',
              text: 'Your payment is processing...',
            });
            break;
          case 'requires_payment_method':
            setMessage('Your payment was not successful, please try again.');
            Swal.fire({
              icon: 'warning',
              text: 'Your payment was not successful, please try again.',
            });
            break;
          default:
            setMessage('Something went wrong');
            Swal.fire({
              icon: 'error',
              text: 'Something went wrong.',
            });
            break;
        }
      });
  }, [stripe]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error, ...otherProps } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // After payment redirect back to the app
        // Additional params will be available
        // Like payment_intent_client_secret
        // Using that param we can get current payment status
        // ToDo: move to payment-result
        return_url: 'http://localhost:3000/payment',
      },
    });

    console.log('🔰 Props of payment confirmation:', otherProps);

    // This point will be reached if there is an immediate error
    // while confirming the payment. Or customer will be redirected to
    // 'return_url'. For some methods customer will be redirected to an intermediate site first
    // to authorize the payment, then redirected to the 'return_url'

    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(error.message || null);
    } else {
      setMessage('An unexpected error occurred');
      Swal.fire({
        icon: 'error',
        text: 'An unexpected error occurred.',
      });
    }

    setIsLoading(false);
  };

  return (
    <form
      id="payment-form"
      onSubmit={handleSubmit}
    >
      <PaymentElement id="payment-element" />
      <div className="w3-container w3-padding-24 w3-center">
        <button
          disabled={isLoading || !stripe || !elements}
          id="submit"
          type="submit"
          className="w3-button w3-purple"
        >
          <span id="button-text">
            {isLoading ? (
              <div
                className="spinner"
                id="spinner"
              >
                ⏳
              </div>
            ) : <b>Pay now</b>}
          </span>
        </button>
      </div>

      {/* Show any error on success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
