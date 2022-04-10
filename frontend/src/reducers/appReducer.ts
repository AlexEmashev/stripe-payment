/* eslint-disable no-redeclare */
/* eslint-disable no-case-declarations */
import { PAYMENT_SYSTEMS } from 'constants/constants';
import { CartProduct, PaymentSystem, Product } from 'models/models';

export type Action = {
  type:
   'PRODUCT_ADD'
   |'PRODUCT_REMOVE'
   |'PRODUCTS_SET'
   |'PRODUCTS_CLEAR'
   |'CART_ADD_PRODUCT'
   |'CART_REMOVE_PRODUCT'
   |'CART_CLEAR'
   |'SET_CLIENT_SECRET'
   |'PAYMENT_SYSTEM_SELECT'
   |'PAYMENT_SYSTEMS_SET';
  payload: any;
}

export type State = {
  clientSecret: string | null,
  products: Product[];
  cart: CartProduct[];
  paymentSystems: PaymentSystem[];
}

export const defaultState = {
  clientSecret: null,
  products: [],
  cart: [],
  paymentSystems: PAYMENT_SYSTEMS,
};

// eslint-disable-next-line default-param-last
const reducer = (state: State = defaultState, action: Action): State => {
  switch (action.type) {
    case 'CART_ADD_PRODUCT': {
      const product = action.payload as Product;

      let updatingItem = state.cart.find((i) => i.id === product.id)
      || { ...product, amount: 0 };

      const restItems = state.cart.filter((i) => i.id !== product.id);

      updatingItem = {
        ...updatingItem,
        amount: updatingItem.amount + 1,
      };

      return {
        ...state,
        cart: [updatingItem, ...restItems],
      };
    }
    case 'CART_REMOVE_PRODUCT': {
      const product = action.payload as Product;

      let updatingItem = state.cart.find((i) => i.id === product.id)
        || { ...product, amount: 0 };
      const restItems = state.cart.filter((i) => i.id !== product.id);

      updatingItem = {
        ...updatingItem,
        amount: updatingItem.amount - 1,
      };

      if (updatingItem.amount <= 0) {
        return {
          ...state,
          cart: [...restItems],
        };
      }

      return {
        ...state,
        cart: [updatingItem, ...restItems],
      };
    }
    case 'CART_CLEAR': {
      return {
        ...state,
        cart: [],
      };
    }
    case 'PRODUCTS_SET': {
      const products = action.payload as Product[];

      return {
        ...state,
        products,
      };
    }
    case 'PRODUCTS_CLEAR': {
      return {
        ...state,
        products: [],
      };
    }
    case 'PAYMENT_SYSTEM_SELECT': {
      const systemId = action.payload as string;
      const updatedPaymentSystems = state.paymentSystems
        .map((system) => (
          system.id === systemId
            ? { ...system, selected: true }
            : { ...system, selected: false }));

      return {
        ...state,
        paymentSystems: updatedPaymentSystems,
      };
    }
    case 'PAYMENT_SYSTEMS_SET': {
      const paymentSystems = action.payload as PaymentSystem[];

      return {
        ...state,
        paymentSystems: [...paymentSystems],
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

export default reducer;
