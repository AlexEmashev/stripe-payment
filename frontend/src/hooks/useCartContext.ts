import { Stripe } from '@stripe/stripe-js';
import React, { Dispatch } from 'react';
import { CartAction, CartState } from 'reducers/cartReducer';

/**
 * App context
 * ToDo: rename app context
 */
const CartContext = React.createContext<{
  cartState: CartState,
  cartDispatch: Dispatch<CartAction>,
  stripePromise: Promise<Stripe|null>
} | null>(null);

/**
 * Provides access to current context value.
 * @returns current context value
 */
export function useCartContext() {
  return React.useContext(CartContext);
}

export default CartContext;
