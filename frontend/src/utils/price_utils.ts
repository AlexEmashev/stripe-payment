/* eslint-disable import/prefer-default-export */
/**
 * Utilities for working with price
 */

import { CartProduct, Product } from 'models/models';

/**
 * Returns string representation of passed price
 * @param price price as number
 * @param locale locale currency abbriviation translation
 * @param currency currency to display price in
 */
export function priceString(price = 0, locale = 'en-US', currency = 'USD'): string {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  });

  return formatter.format(price);
}

/**
 * Returns string representation of total price of passed products
 * @param products array of either cart products or products
 * @param locale locale currency abbriviation translation
 * @param currency currency to display price in
 */
export function getTotalPrice(products: CartProduct[] & Product[], locale = 'en-US', currency = 'USD'): string {
  const totalPrice = products
    .reduce((total, product) => total + product.amount * product.price, 0);

  return priceString(totalPrice, locale, currency);
}
