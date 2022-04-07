import React, { useState } from 'react';
import './App.css';

export type Product = {
  id: number,
  name: string;
  author: string;
  price: number;
};

export type CartProduct = Product &{
  amount: number;
};

function App() {
  const [cart, setCart] = useState<CartProduct[]>([]);

  const products: Product[] = [
    {
      id: 1,
      name: 'JavaScript Understanding the Weird Parts',
      author: 'Anthony Alicea',
      price: 15.95,
    },
    {
      id: 2,
      name: 'CSS: The Missing Manual',
      author: 'David McFarland',
      price: 15.95,
    },
    {
      id: 3,
      name: 'Design Patterns: Elements of Reusable Object-Oriented Software',
      author: 'Erich Gamma, Richard Helm, John Vlissides, Ralph Johnson',
      price: 15.95,
    },
  ];

  const submit = (): any => {
    fetch('/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: 1,
        quantity: 5,
      }),
    }).then((res) => {
      if (res.ok) return res.json();
      return res.json().then((e) => console.error(e));
    })
      .then((response) => {
        console.log('🔰 response:', response);
      })
      .catch((e) => {
        console.log('🔰 error:', e);
      });
  };

  const updateCart = (item: Product, operation: 'add'|'remove') => {
    const updatingItem = cart.find((i) => i.id === item.id)
      || { ...item, amount: 0 };

    const restItems = cart.filter((i) => i.id !== item.id);

    updatingItem.amount = operation === 'add' ? updatingItem.amount + 1 : updatingItem.amount - 1;

    if (updatingItem.amount <= 0) {
      setCart([...restItems]);
      return;
    }

    setCart([
      ...restItems,
      updatingItem,
    ]);
  };

  const getProductAmount = (id: number) => cart.find((i) => i.id === id)?.amount || 0;

  return (
    <>
      <div className="w3-bar w3-xlarge w3-padding w3-purple w3-opacity-min">
        <a href="/" className="w3-bar-item w3-button">HOME</a>
        <a href="/cart" className="w3-bar-item w3-button">CART</a>
      </div>
      <div className="w3-content w3-padding">
        <h1 className="w3-center">Products</h1>
        <ul className="w3-ul w3-card-2">
          {products.map((product) => (
            <li className="w3-cell-row" key={product.id}>
              <div className="w3-cell">

                <h4>{product.name}</h4>
                {' '}
                <p>{product.author}</p>
              </div>
              <div className="w3-cell w3-cell-middle" style={{ width: 150 }}>
                <div style={{ display: 'flex' }}>
                  <button className="w3-button w3-purple" type="button" onClick={() => updateCart(product, 'remove')}>-</button>
                  <input readOnly className="w3-input w3-border w3-center" type="text" style={{ width: 42 }} pattern="[0-9]{1}" size={1} maxLength={1} value={getProductAmount(product.id)} />
                  <button className="w3-button w3-purple" type="button" onClick={() => updateCart(product, 'add')}>+</button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="w3-container">
          <h2 className="w3-center">Cart</h2>
          <table className="w3-table w3-border w3-bordered">
            <thead>
              <tr>
                <th>Product</th>
                <th className="w3-center">Price</th>
                <th className="w3-center">Amount</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((product) => (
                <tr key={product.id}>
                  <td>
                    <span className="w3-large">{product.name}</span>
                    <br />
                    <span className="w3-small">{product.author}</span>
                  </td>
                  <td className="w3-center">{product.price}</td>
                  <td className="w3-center">{product.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="w3-container w3-center w3-padding-24">
          <button className="w3-button w3-purple" onClick={submit} type="submit">Make Order</button>
        </div>

        <div className="w3-container">
          <h2 className="w3-center">Payment</h2>
        </div>
      </div>
    </>
  );
}

export default App;
