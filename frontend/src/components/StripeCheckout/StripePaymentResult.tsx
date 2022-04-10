import React, { ReactElement, useEffect, useState } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import Swal from 'sweetalert2';
import Loader from 'components/Loader/Loader';
import Confetti from 'react-confetti';
import { useAppContext } from 'hooks/useAppContext';
import { useNavigate } from 'react-router-dom';

/**
 * Pages that renders stripe payment result
 */
export default function StripePaymentResult(): ReactElement | null {
  const [stripe, setStripe] = useState<Stripe|null>(null);
  const [clientSecret, setClientSecret] = useState<string|null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string|null>(null);
  const [isRefreshChecksRunning, setIsRefreshChecksRunning] = useState<boolean>(false);
  const context = useAppContext();
  const navigate = useNavigate();

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

  const runStatusRefresh = () => {
    if (!stripe || !clientSecret || isRefreshChecksRunning) return;

    // If payment in processing status periodically checks status update
    // Can be done using server-sent events from our server.
    const intervalId = window.setInterval(() => {
      stripe.retrievePaymentIntent(clientSecret)
        .then((intent) => {
          if (intent.paymentIntent?.status !== 'processing') {
            setPaymentStatus(intent.paymentIntent?.status || null);
            // Here we don't use statusRefreshInterval because it would be the same
            // Due to closure on function that existed on call setInterval
            window.clearInterval(intervalId);
            setIsRefreshChecksRunning(false);
          }
        })
        .catch((reason) => {
          window.clearInterval(intervalId);
          setIsRefreshChecksRunning(false);

          Swal.fire({
            icon: 'error',
            text: 'Can\'t get update on payment process.',
          });

          throw new Error(reason);
        });
    }, 5000);

    setIsRefreshChecksRunning(true);
  };

  useEffect(() => {
    // Actions to perform regarding payment status
    switch (paymentStatus) {
      case 'succeeded':
        context?.dispatch({
          type: 'CART_CLEAR',
          payload: null,
        });
        break;
      case 'processing':
      case null:
        runStatusRefresh();
        break;
      case 'requires_payment_method':
      default:
        break;
    }
  }, [paymentStatus, stripe, clientSecret]);

  const renderPaymentResult = () => {
    console.log('🔰 status', paymentStatus);
    switch (paymentStatus) {
      case 'succeeded':
        return (
          <>
            <h1 className="w3-center color-text-info">Payment succeeded!</h1>
            <div
              className="w3-container w3-center"
              style={{ fontSize: 64 }}
            >
              🎉
            </div>
            <div
              className="w3-container w3-center w3-padding-24"
            >
              <button
                className="w3-button color-primary"
                type="button"
                onClick={() => {
                  navigate('/');
                }}
              >
                Return to products

              </button>
            </div>
            <Confetti />
          </>
        );
      case 'processing': // ToDo
      case null:
        return (
          <>
            <h1 className="w3-center color-text-info">Your payment is being processed...</h1>
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
          </>
        );
      case 'requires_payment_method':
        return (
          <>
            <h1 className="w3-center color-text-warning">Your payment was not successful, please try again.</h1>
            <div
              className="w3-container w3-center"
              style={{ fontSize: 64 }}
            >
              ⚠️
            </div>
          </>
        );
      default:
        return (
          <>
            <h1 className="w3-center color-text-error">Something went wrong.</h1>
            <div
              className="w3-container w3-center"
              style={{ fontSize: 64 }}
            >
              ⚠️
            </div>
          </>
        );
    }
  };

  return renderPaymentResult();
}
