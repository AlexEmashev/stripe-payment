import React, { ReactElement } from 'react';
import { useAppContext } from 'hooks/useAppContext';
import { CartProduct } from 'models/models';
import { useNavigate } from 'react-router-dom';
import { getTotalPrice } from 'utils/price_utils';

export default function PageCart(): ReactElement | null {
  const navigate = useNavigate();
  const context = useAppContext();

  if (!context) return null;

  const { state: { cart } } = context;

  const onGoToPayment = (): any => {
    navigate('/payment');
  };

  const cartItems = cart.length === 0
    ? (
      <tr>
        <td
          colSpan={3}
          className="w3-center"
        >
          No items yet
        </td>
      </tr>
    )
    : cart.map((product: CartProduct) => (
      <tr key={product.id}>
        <td>
          <span className="w3-large">{product.name}</span>
          <br />
          <span className="w3-small">{product.author}</span>
        </td>
        <td className="w3-center">
          $
          {product.price}
        </td>
        <td className="w3-center">{product.amount}</td>
      </tr>
    ));

  const total = getTotalPrice(cart);

  return (
    <>
      <h1 className="w3-center color-text-base">Cart</h1>
      <table className="w3-table w3-border w3-bordered">
        <thead className="color-info">
          <tr>
            <th>Product</th>
            <th className="w3-center">Price</th>
            <th className="w3-center">Amount</th>
          </tr>
        </thead>
        <tbody className="color-base">
          { cartItems }
        </tbody>
        <tfoot className="color-base">
          <tr>
            <th className="w3-right">Total</th>
            <th className="w3-center">
              {total}
            </th>
            <th>&nbsp;</th>
          </tr>
        </tfoot>
      </table>

      <div className="w3-container w3-center w3-padding-24">
        <button
          disabled={!cart.length}
          className="w3-button color-primary"
          onClick={onGoToPayment}
          type="button"
        >
          <b>To payment</b>
        </button>
      </div>
    </>
  );
}
