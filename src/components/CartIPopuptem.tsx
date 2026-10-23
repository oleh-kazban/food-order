type CartPopupItemProps = {
  id: string;
  name: string;
  price: string;
  amount: number;
  onIncreaseAmount: (_id: string) => void;
  onDecreaseAmount: (_id: string) => void;
};

export function CartPopupItem({
  id,
  name,
  price,
  amount,
  onIncreaseAmount,
  onDecreaseAmount,
}: CartPopupItemProps) {
  return (
    <li className="cart-item">
      <p>
        {name} - {amount} x ${price}
      </p>
      <p className="cart-item-actions">
        <button type="button" onClick={() => onDecreaseAmount(id)}>
          -
        </button>
        <span>{amount}</span>
        <button type="button" onClick={() => onIncreaseAmount(id)}>
          +
        </button>
      </p>
    </li>
  );
}
