import { useImperativeHandle, useRef } from 'react';
import { createPortal } from 'react-dom';

import { useCart } from '@order/state/cart.context';
import { CartHandler } from '@order/types/Cart.types';

import { CartItem } from './CartItem';

export function Cart({ ref }: { ref?: React.Ref<CartHandler> }) {
  const { items, increaseItemAmount, decreaseItemAmount } = useCart();
  const dialog = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => {
    return {
      open: () => dialog.current?.showModal(),
      close: () => dialog.current?.close(),
    };
  });

  const total = items.reduce((acc, current) => {
    acc += Number(current.price) * current.amount;

    return acc;
  }, 0);

  return createPortal(
    <dialog ref={dialog} className="modal cart">
      <h2>Your Cart</h2>
      <ul>
        {items.map(({ id, name, amount, price }) => (
          <CartItem
            key={id}
            id={id}
            name={name}
            price={price}
            amount={amount}
            onDecreaseAmount={decreaseItemAmount}
            onIncreaseAmount={increaseItemAmount}
          />
        ))}
      </ul>
      <p className="cart-total">${total.toFixed(2)}</p>
      <p className="modal-actions">
        <button type="button" className="text-button" onClick={() => dialog.current?.close()}>
          Close
        </button>
        <button type="button" className="button">
          Go to Checkout
        </button>
      </p>
    </dialog>,
    document.getElementById('modal') as Element,
  );
}
