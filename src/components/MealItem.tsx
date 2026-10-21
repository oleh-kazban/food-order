import { useCart } from '@order/state/cart.context';

type MealItemProps = {
  id: string;
  img: string;
  name: string;
  price: string;
  description: string;
};

export function MealItem({ id, img, name, price, description }: MealItemProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({ id, name, price, amount: 1 });
  };

  return (
    <li className="meal-item">
      <article>
        <img src={img} alt={name} />
        <div>
          <h3>{name}</h3>
          <p className="meal-item-price">${price}</p>
          <p className="meal-item-description">{description}</p>
        </div>
        <p className="meal-item-actions">
          <button type="button" className="button" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </p>
      </article>
    </li>
  );
}
