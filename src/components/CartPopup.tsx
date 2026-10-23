import { useCart } from '@order/state/cart.context';
import { useUserProgress } from '@order/state/userProgress.context';
import { Modal } from '@order/ui/Modal';

import { CartPopupItem } from './CartIPopuptem';

export function CartPopup() {
  const { items, total, increaseItemAmount, decreaseItemAmount } = useCart();
  const { state, clearProgress, showCheckout } = useUserProgress();

  return (
    <Modal className="cart" open={state === 'cart'} onClose={clearProgress}>
      <h2>Your Cart</h2>
      <ul>
        {items.map(({ id, name, amount, price }) => (
          <CartPopupItem
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
        <button type="button" className="text-button" onClick={clearProgress}>
          Close
        </button>
        <button type="button" className="button" onClick={showCheckout}>
          Go to Checkout
        </button>
      </p>
    </Modal>
  );
}
