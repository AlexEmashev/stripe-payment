import React, { ReactElement } from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function Layout(): ReactElement {
  return (
    <div
      className="theme-default color-base"
      style={{ height: '100%' }}
    >
      <div className="w3-bar w3-xlarge w3-padding w3-opacity-min color-secondary">
        <Link
          to="/"
          className="w3-bar-item w3-button"
        >
          HOME
        </Link>
        <Link
          to="/cart"
          className="w3-bar-item w3-button"
        >
          CART
        </Link>
      </div>
      <div className="w3-content w3-padding">
        <Outlet />
      </div>
    </div>
  );
}
