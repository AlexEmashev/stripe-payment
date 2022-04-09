/* eslint-disable no-redeclare */
/* eslint-disable no-case-declarations */
import { CartProduct, Product } from 'models/models';

export type CartAction = {
  type:
   'REMOVE_PRODUCT'
   |'ADD_PRODUCT'
   |'CLEAR_PRODUCTS'
   |'SET_CART_PRODUCTS'
   |'SET_CLIENT_SECRET',
  payload: Product | CartProduct[] | string | null | undefined
}

export type CartState = {
  clientSecret: string | null,
  products: CartProduct[];
}

export const cartDefaultState = {
  clientSecret: null,
  products: [],
};

// eslint-disable-next-line default-param-last
const cartReducer = (state: CartState = cartDefaultState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_PRODUCT': {
      const product = action.payload as Product;
      const updatingItem = state.products.find((i) => i.id === product.id)
      || { ...product, amount: 0 };

      const restItems = state.products.filter((i) => i.id !== product.id);

      console.log('🔰 Add product', updatingItem);
      updatingItem.amount += 1;

      return {
        ...state,
        products: [updatingItem, ...restItems],
      };
    }
    case 'REMOVE_PRODUCT': {
      const product = action.payload as Product;
      const updatingItem = state.products.find((i) => i.id === product.id)
        || { ...product, amount: 0 };
      const restItems = state.products.filter((i) => i.id !== product.id);

      updatingItem.amount -= 1;

      if (updatingItem.amount <= 0) {
        return {
          ...state,
          products: [...restItems],
        };
      }

      return {
        ...state,
        products: [updatingItem, ...restItems],
      };
    }
    case 'SET_CLIENT_SECRET': {
      const clientSecret = action.payload as string;

      return {
        ...state,
        clientSecret,
      };
    }
    default:
      return state;
  }
};

export default cartReducer;
