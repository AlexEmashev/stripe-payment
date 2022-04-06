import React from 'react';
import './App.css';

function App() {

  const submit = () => {
    fetch('/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: 1,
        quantity: 5,
      })
    }).then(res => {
      if (res.ok) return res.json();
      return res.json().then(e => console.error(e));
    })
    .then((response) => {
      console.log(`🔰 response:`, response);
    })
    .catch(e => {
      console.log(`🔰 error:`, e);
    });
  }

  return (
    <>
      <div className="w3-bar w3-xlarge w3-padding w3-purple w3-opacity-min">
        <a href="/" className="w3-bar-item w3-button">HOME</a>
        <a href="/cart" className="w3-bar-item w3-button">CART</a>
      </div>
      <div className='w3-content w3-padding'>
        <h1>Test page</h1>
        <button className="w3-button w3-purple" onClick={submit}>Make Order</button>
      </div>
    </>
  );
}

export default App;
