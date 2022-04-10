export type Product = {
  id: number,
  name: string;
  author: string;
  price: number;
};

export type CartProduct = Product & {
  amount: number;
};

export type PAYMENT_IDS =
  'stripe'
  |'tinkoff';

export type PaymentSystem = {
  id: PAYMENT_IDS;
  title: string;
  selected: boolean;
  disabled: boolean;
};

export type APP_THEMES = 'default'|'dark';
