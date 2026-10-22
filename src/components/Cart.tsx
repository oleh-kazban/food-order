import { useImperativeHandle, useRef } from 'react';
import { createPortal } from 'react-dom';

import { useCart } from '@order/state/cart.context';
import { CartHandler, CheckoutHandler } from '@order/types/Cart.types';

import { CartItem } from './CartItem';
import { Checkout } from './Checkout';

export function Cart({ ref }: { ref?: React.Ref<CartHandler> }) {
  const { items, total, increaseItemAmount, decreaseItemAmount } = useCart();
  const dialog = useRef<HTMLDialogElement>(null);
  const checkoutRef = useRef<CheckoutHandler>(null);

  useImperativeHandle(ref, () => {
    return {
      open: () => dialog.current?.showModal(),
      close: () => dialog.current?.close(),
    };
  });

  return createPortal(
    <dialog ref={dialog} className="modal cart">
      <Checkout ref={checkoutRef} />
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
      <p className="cart-total">${total}</p>
      <p className="modal-actions">
        <button type="button" className="text-button" onClick={() => dialog.current?.close()}>
          Close
        </button>
        <button
          type="button"
          className="button"
          onClick={() => {
            dialog.current?.close();
            checkoutRef.current?.open();
          }}
        >
          Go to Checkout
        </button>
      </p>
    </dialog>,
    document.getElementById('modal') as Element,
  );
}
