import { useImperativeHandle, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { useCart } from '@order/state/cart.context';
import { CheckoutHandler } from '@order/types/Cart.types';

export function CheckoutPopup({ ref }: { ref?: React.Ref<CheckoutHandler> }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { items, total, onCheckout } = useCart();

  useImperativeHandle(ref, () => {
    return {
      open: () => dialog.current?.showModal(),
      close: () => dialog.current?.close(),
    };
  });

  const handleCheckout = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const fd = new FormData(form);
    const customer = Object.fromEntries(fd);
    const order = items.map(({ name, amount }) => ({ name, amount }));

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    try {
      setIsSubmitting(() => true);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
        method: 'POST',
        body: JSON.stringify({
          order: {
            id: crypto.randomUUID(),
            items: order,
            total,
            customer,
          },
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to place the order');
      }

      onCheckout();
      dialog.current?.close();
    } catch (error) {
      console.log('ERROR: ', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <dialog ref={dialog} className="modal">
      <form onSubmit={handleCheckout}>
        <h2>Checkout</h2>
        <p>Total Amount: ${total}</p>

        <div className="control">
          <label htmlFor="name">Full Name</label>
          <input type="text" id="name" name="name" required />
        </div>

        <div className="control">
          <label htmlFor="email">E-Mail Address</label>
          <input type="email" id="email" name="email" required />
        </div>

        <div className="control">
          <label htmlFor="street">Street</label>
          <input type="text" id="street" name="street" required />
        </div>

        <div className="control-row">
          <div className="control">
            <label htmlFor="postal-code">Postal Code</label>
            <input type="text" id="postal-code" name="postal-code" required />
          </div>
          <div className="control">
            <label htmlFor="city">City</label>
            <input type="text" id="city" name="city" required />
          </div>
        </div>

        <p className="modal-actions">
          <button type="button" className="text-button" onClick={() => dialog.current?.close()}>
            Close
          </button>
          <button type="submit" className="button" disabled={isSubmitting}>
            Submit Order
          </button>
        </p>
      </form>
    </dialog>,
    document.getElementById('modal') as Element,
  );
}
