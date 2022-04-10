import React, { ReactElement } from 'react';
import './Loader.css';

export type LoaderProps = {
  isVisible?: boolean;
  size?: number;
};

/**
 * Loader element
 */
export default function Loader({ isVisible, size }: LoaderProps): ReactElement | null {
  return isVisible
    ? (
      <div
        className="loader"
        style={{ fontSize: size }}
      >
        Loading...
      </div>
    )
    : null;
}

Loader.defaultProps = {
  isVisible: true,
  size: 10,
};
