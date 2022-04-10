import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import Loader from 'components/Loader/Loader';
import React, { ReactElement, useState } from 'react';
import Swal from 'sweetalert2';

export type StripeCheckoutFormProps = {
  paymentAmount: string | null;
};

export default function StripeCheckoutForm(
  { paymentAmount } : StripeCheckoutFormProps,
): ReactElement | null {
  const stripe = useStripe();
  const elements = useElements();
  const [isPaymentInProcess, setIsPaymentInProcess] = useState(false);
  const [isStripeElementLoaded, setIsStripeElementLoaded] = useState(false);

  const isLoading = !stripe || !elements || !isStripeElementLoaded;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isLoading) return;

    setIsPaymentInProcess(true);

    // Confirm payment intend from the front-end side
    // After confirmation user will be redirected to return_url
    // Where we can define an outcome
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Has to be a full URL
        // Additional payment params will be available as url params
        return_url: `${window.location.origin}/stripe-result`,
      },
    });

    // This point is reached if there is an immediate error while confirming the payment.
    // In other case customer is redirected to 'return_url'.
    // For some payment methods customer will be redirected to an intermediate resource first
    // to authorize the payment (e.g. 3D Secure), then they will be redirected to the 'return_url'

    if (error.type === 'card_error' || error.type === 'validation_error') {
      Swal.fire({
        icon: 'error',
        text: error.message,
      });
    } else {
      Swal.fire({
        icon: 'error',
        text: 'An unexpected error occured during payment.',
      });
    }

    setIsPaymentInProcess(false);
  };

  return (
    <form
      id="payment-form"
      onSubmit={handleSubmit}
    >

      <PaymentElement
        id="payment-element"
        onReady={() => setIsStripeElementLoaded(true)}
      />

      {isLoading
        ? (
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
        : (
          <div className="w3-container w3-padding-24 w3-center">
            <button
              disabled={isPaymentInProcess}
              id="submit"
              type="submit"
              className="w3-button color-primary"
            >
              <span id="button-text">
                {isPaymentInProcess ? (
                  <div
                    className="spinner"
                    id="spinner"
                  >
                    ⏳
                  </div>
                ) : (
                  <b>
                    Pay&nbsp;
                    {paymentAmount}
                  </b>
                )}
              </span>
            </button>
          </div>
        )}

    </form>
  );
}
