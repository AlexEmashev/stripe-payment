/* eslint-disable import/prefer-default-export */
import { PaymentSystem } from 'models/models';

/**
 * Available payment methods
 */
export const PAYMENT_SYSTEMS: PaymentSystem[] = [{
  id: 'stripe',
  title: 'Stripe',
  selected: true,
  disabled: false,
}, {
  id: 'tinkoff',
  title: 'Tinkoff',
  selected: false,
  disabled: false,
}];
