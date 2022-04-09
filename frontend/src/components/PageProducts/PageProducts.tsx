import { useCartContext } from 'hooks/useCartContext';
import { Product } from 'models/models';
import React, { ReactElement, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PageProducts(): ReactElement | null {
  const navigate = useNavigate();
  const context = useCartContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<'progress'|'finished'|'errored'>('progress');

  if (!context) return null;

  const {
    cartState, cartDispatch,
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
      cartDispatch({
        type: 'ADD_PRODUCT',
        payload: product,
      });

      return;
    }

    cartDispatch({
      type: 'REMOVE_PRODUCT',
      payload: product,
    });
  };

  const proceedToCart = () => {
    navigate('/cart');
  };

  const getProductAmount = (id: number) => cartState.products.find((i) => i.id === id)?.amount || 0;

  const renderProducts = () => (
    <ul className="w3-ul w3-card-2">
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
            $
            {product.price}
          </div>
          <div
            className="w3-cell w3-cell-middle"
            style={{ width: 150 }}
          >
            <div style={{ display: 'flex' }}>
              <button
                className="w3-button w3-purple"
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
                className="w3-button w3-purple"
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
          <div className="w3-container w3-padding-24">
            <h1 className="w3-center">⏳</h1>
          </div>
        );
      case 'finished':
        return renderProducts();
      case 'errored':
        return (
          <div className="w3-container w3-center w3-padding-24">
            <h1 className="w3-center w3-text-red">Sorry, products list currently unavailable.</h1>
          </div>
        );
      default:
        return <>Something went wrong state not implemented</>;
    }
  };

  return (
    <>
      <h1 className="w3-center">Products</h1>
      {renderProductsContent()}

      <div className="w3-container w3-center w3-padding-24">
        <button
          disabled={!(cartState.products.length)}
          className="w3-button w3-purple"
          onClick={proceedToCart}
          type="button"
        >
          <b>Make Order</b>
        </button>
      </div>
    </>
  );
}
