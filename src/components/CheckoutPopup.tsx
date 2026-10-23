import { useState } from 'react';

import { useCart } from '@order/state/cart.context';
import { useUserProgress } from '@order/state/userProgress.context';
import { Modal } from '@order/ui/Modal';

export function CheckoutPopup() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { items, total, onCheckout } = useCart();
  const { state, clearProgress, showSuccess } = useUserProgress();

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
      showSuccess();
    } catch (error) {
      console.log('ERROR: ', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={state === 'checkout'} onClose={clearProgress}>
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
          <button type="button" className="text-button" onClick={clearProgress}>
            Close
          </button>
          <button type="submit" className="button" disabled={isSubmitting}>
            Submit Order
          </button>
        </p>
      </form>
    </Modal>
  );
}
