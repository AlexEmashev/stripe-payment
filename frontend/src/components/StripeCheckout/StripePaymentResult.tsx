import React, { ReactElement, useEffect, useState } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import Swal from 'sweetalert2';

/**
 * Pages that renders stripe payment result
 */
export default function StripePaymentResult(): ReactElement | null {
  const [stripe, setStripe] = useState<Stripe|null>(null);
  const [clientSecret, setClientSecret] = useState<string|null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string|null>(null);

  useEffect(() => {
    loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || '')
      .then((stripeObj) => setStripe(stripeObj));
  }, []);

  useEffect(() => {
    // Define current payment status
    const urlSearchParams = new URLSearchParams(window.location.search);

    const clientSecretParam = urlSearchParams
      .get('payment_intent_client_secret');
    if (!clientSecretParam) {
      Swal.fire({
        icon: 'error',
        text: 'No payment information (no client key)',
      });

      throw new Error('No client secret informtion');
    }

    setClientSecret(clientSecretParam);

    const paymentStatusParam = urlSearchParams.get('redirect_status');
    if (!paymentStatusParam) {
      Swal.fire({
        icon: 'error',
        text: 'No payment information',
      });

      throw new Error('No payment information in URL');
    }

    setPaymentStatus(paymentStatusParam);
  }, []);

  useEffect(() => {
    if (paymentStatus !== 'processing' || !stripe || !clientSecret) return;

    // ToDo: retry
    stripe.retrievePaymentIntent(clientSecret)
      .then((intent) => {
        console.log('🔰 Intent:', intent);
        if (intent.paymentIntent?.status !== 'processing') {
          setPaymentStatus(intent.paymentIntent?.status || null);
        }
      })
      .catch((reason) => {
        console.error(reason);

        Swal.fire({
          icon: 'error',
          text: 'Can\'t get update on payment process.',
        });
      });
  }, [paymentStatus]);

  const renderPaymentResult = () => {
    console.log('🔰 status', paymentStatus);
    switch (paymentStatus) {
      case 'succeeded':
        Swal.fire({
          icon: 'success',
          text: 'Payment succeeded!',
        });
        break;
      case 'processing': // ToDo
        Swal.fire({
          icon: 'info',
          text: 'Your payment is processing...',
        });
        break;
      case 'requires_payment_method':
        Swal.fire({
          icon: 'warning',
          text: 'Your payment was not successful, please try again.',
        });
        break;
      default:
        Swal.fire({
          icon: 'error',
          text: 'Something went wrong.',
        });
        break;
    }

    return null;
  };

  // ToDo: do something on payment succeeded

  return (
    <>
      Payment result
      {' '}
      {renderPaymentResult()}
    </>
  );
}
