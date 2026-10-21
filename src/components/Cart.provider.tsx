import { ReactNode, useState } from 'react';

import { CartContext } from '@order/state/cart.context';
import { CartItem } from '@order/types/Cart.types';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const increaseItemAmount = (id: string) => {
    const _items = items.reduce((acc, curr) => {
      if (curr.id === id) {
        acc.push({ ...curr, amount: curr.amount + 1 });
      } else {
        acc.push(curr);
      }

      return acc;
    }, [] as CartItem[]);

    setItems([..._items]);
  };

  const decreaseItemAmount = (id: string) => {
    const _items = items.reduce((acc, curr) => {
      if (curr.id === id) {
        if (curr.amount > 1) {
          acc.push({ ...curr, amount: curr.amount - 1 });
        }
      } else {
        acc.push(curr);
      }

      return acc;
    }, [] as CartItem[]);

    setItems([..._items]);
  };

  const addToCart = (item: CartItem) => {
    if (!items.find(i => i.id === item.id)) {
      setItems(prev => [item, ...prev]);
    } else {
      increaseItemAmount(item.id);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        increaseItemAmount,
        decreaseItemAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
