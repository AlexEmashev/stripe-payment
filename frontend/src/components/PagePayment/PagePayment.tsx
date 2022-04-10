import React, { ReactElement } from 'react';
import { useAppContext } from 'hooks/useAppContext';
import StripeCheckout from 'components/StripeCheckout/StripeCheckout';

export default function PagePayment(): ReactElement | null {
  const context = useAppContext();

  if (!context) return null;

  // ToDo: remove stripeApi
  const { state, dispatch } = context;

  const onSelectPaymentSystem = (id: string) => {
    dispatch({
      type: 'PAYMENT_SYSTEM_SELECT',
      payload: id,
    });
    // Select payment system.
  };

  const renderPaymentForm = () => {
    const selectedPaymentSystem = state.paymentSystems.find((s) => s.selected);

    switch (selectedPaymentSystem?.id) {
      case 'stripe':
        return <StripeCheckout />;
      default:
        return <h1>This payment system is not supported yet</h1>;
    }
  };

  const renderPaymentSystems = () => state.paymentSystems.map((system) => (
    <button
      key={system.id}
      type="button"
      onClick={() => onSelectPaymentSystem(system.id)}
      disabled={system.disabled}
      className={`w3-button ${system.selected ? 'color-primary' : 'color-card'}`}
    >
      {system.title}
    </button>
  ));

  return (
    <>
      <h2 className="w3-center">Payment</h2>
      <div className="w3-container">
        <h3 className="w3-center">Select payment system</h3>
        <div className="w3-bar w3-center">
          {renderPaymentSystems()}
        </div>

      </div>
      {renderPaymentForm()}
    </>
  );
}
