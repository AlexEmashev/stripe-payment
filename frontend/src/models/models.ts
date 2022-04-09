export type Product = {
  id: number,
  name: string;
  author: string;
  price: number;
};

export type CartProduct = Product & {
  amount: number;
};
