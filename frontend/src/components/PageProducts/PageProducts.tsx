import Loader from 'components/Loader/Loader';
import { useAppContext } from 'hooks/useAppContext';
import { Product } from 'models/models';
import React, { ReactElement, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { priceString } from 'utils/price_utils';

export default function PageProducts(): ReactElement | null {
  const navigate = useNavigate();
  const context = useAppContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<'progress'|'finished'|'errored'>('progress');

  if (!context) return null;

  const {
    state, dispatch,
  } = context;

  const getProducts = async (): Promise<Product[]> => fetch('/products', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => {
    if (res.ok) return res.json();

    return res.json().then((e) => console.error(e));
  })
    .catch((e) => {
      throw new Error('Error during products fetch', { cause: e });
    });

  useEffect(() => {
    getProducts()
      .then((productsRes) => {
        setProducts(productsRes);
        setLoading('finished');
      })
      .catch(() => {
        setLoading('errored');
      });
  }, []);

  const updateCart = (product: Product, operation: 'add'|'remove') => {
    if (operation === 'add') {
      // ToDo: fix double rendering
      dispatch({
        type: 'CART_ADD_PRODUCT',
        payload: product,
      });

      return;
    }

    dispatch({
      type: 'CART_REMOVE_PRODUCT',
      payload: product,
    });
  };

  const proceedToCart = () => {
    if (!state.cart.length) {
      Swal.fire({
        icon: 'warning',
        text: 'Please select at least one product',
      });

      return;
    }

    navigate('/cart');
  };

  const getProductAmount = (id: number) => state.cart.find((i) => i.id === id)?.amount || 0;

  const renderProducts = () => (
    <ul className="w3-ul w3-card-2 color-card">
      {products.map((product) => (
        <li
          className="w3-cell-row"
          key={product.id}
        >
          <div className="w3-cell">

            <h4>{product.name}</h4>
            {' '}
            <p>{product.author}</p>
          </div>
          <div
            className="w3-cell w3-cell-middle"
            style={{ width: 100 }}
          >
            {priceString(product.price)}
          </div>
          <div
            className="w3-cell w3-cell-middle"
            style={{ width: 150 }}
          >
            <div style={{ display: 'flex' }}>
              <button
                className="w3-button color-primary"
                type="button"
                onClick={() => updateCart(product, 'remove')}
              >
                <b>-</b>
              </button>
              <input
                readOnly
                className="w3-input w3-border w3-center"
                type="text"
                style={{ width: 42 }}
                pattern="[0-9]{1}"
                size={1}
                maxLength={1}
                value={getProductAmount(product.id)}
              />
              <button
                className="w3-button color-primary"
                type="button"
                onClick={() => updateCart(product, 'add')}
              >
                <b>+</b>
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );

  const renderProductsContent = () => {
    switch (loading) {
      case 'progress':
        return (
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
        );
      case 'finished':
        return renderProducts();
      case 'errored':
        return (
          <div className="w3-container w3-center w3-padding-24">
            <h1 className="w3-center color-text-danger">Sorry, products list currently unavailable.</h1>
          </div>
        );
      default:
        return (
          <div className="w3-container w3-center w3-padding-24">
            <h1 className="w3-center color-text-danger">Something wrong happened during products loading.</h1>
          </div>
        );
    }
  };

  return (
    <>
      <h1 className="w3-center">Products</h1>
      {renderProductsContent()}

      <div className="w3-container w3-center w3-padding-24">
        <button
          className="w3-button color-primary"
          onClick={proceedToCart}
          type="button"
        >
          <b>Make Order</b>
        </button>
      </div>
    </>
  );
}
