import { useAppContext } from 'hooks/useAppContext';
import React, { ReactElement } from 'react';
import { Link, Outlet } from 'react-router-dom';
import './Layout.css';

export default function Layout(): ReactElement | null {
  const rootElement = document.getElementById('root');
  const context = useAppContext();
  // ToDo: Save theme to local storage
  // Get theme from media-query
  // Add media query watcher
  if (!context) return null;

  const { state: { theme }, dispatch } = context;

  const onThemeChange = () => {
    // Set next theme.
    switch (theme) {
      case 'dark':
        dispatch({
          type: 'SET_THEME',
          payload: 'default',
        });
        rootElement?.classList.replace('theme-dark', 'theme-default');
        break;
      default:
        dispatch({
          type: 'SET_THEME',
          payload: 'dark',
        });
        rootElement?.classList.replace('theme-default', 'theme-dark');
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'dark':
        return '🌚';
      default:
        return '🌞';
    }
  };

  return (
    <>
      <div className="w3-bar w3-xlarge w3-padding color-secondary layout__title-bar">
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
        <div className="layout__title-bar-spacer">&nbsp;</div>
        <button
          type="button"
          onClick={onThemeChange}
          className="layout__theme-button"
        >
          {getThemeIcon()}
        </button>
      </div>
      <div className="w3-content w3-padding">
        <Outlet />
      </div>
    </>
  );
}
