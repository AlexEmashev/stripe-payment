import { useCartContext } from 'hooks/useCartContext';
import { CartProduct } from 'models/models';
import Swal from 'sweetalert2';
import React, { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PageCart(): ReactElement | null {
  const navigate = useNavigate();
  const context = useCartContext();

  if (!context) return null;

  const { cartState, cartDispatch } = context;

  const onSubmit = (): any => {
    // if (cart.length === 0) return;

    fetch('/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items: cartState.products }),
    }).then((res) => {
      if (res.ok) return res.json();

      return res.json().then((json) => Promise.reject(json));
    })
      .then((response) => {
        console.log('🔰 response:', response);
        cartDispatch({
          type: 'SET_CLIENT_SECRET',
          payload: response.clientSecret,
        });

        navigate('/payment');
      })
      .catch((e) => {
        console.error(e);

        Swal.fire({
          icon: 'error',
          text: e.message || e || '',
        });
      });
  };

  const cartItems = cartState.products.length === 0
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
    : cartState.products.map((product: CartProduct) => (
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

  return (
    <>
      <h1>Cart</h1>
      <table className="w3-table w3-border w3-bordered">
        <thead>
          <tr>
            <th>Product</th>
            <th className="w3-center">Price</th>
            <th className="w3-center">Amount</th>
          </tr>
        </thead>
        <tbody>
          { cartItems }
        </tbody>
      </table>

      <div className="w3-container w3-center w3-padding-24">
        <button
          className="w3-button w3-purple"
          onClick={onSubmit}
          type="button"
        >
          <b>Checkout</b>
        </button>
      </div>
    </>
  );
}
