import { createContext, useContext } from 'react';

import { CartContextValue } from '@order/types/Cart.types';

export const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
}
