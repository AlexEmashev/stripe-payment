import { Stripe } from '@stripe/stripe-js';
import React, { Dispatch } from 'react';
import { Action, State } from 'reducers/appReducer';

/**
 * App context.
 * Sharing state, dispatch and other data among different parts of the app.
 */
const AppContext = React.createContext<{
  state: State,
  dispatch: Dispatch<Action>,
  stripePromise: Promise<Stripe|null>
} | null>(null);

/**
 * Provides access to current context value.
 * @returns current context value
 */
export function useAppContext() {
  return React.useContext(AppContext);
}

export default AppContext;
