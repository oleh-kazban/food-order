import { useCart } from '@order/state/cart.context';
import { useUserProgress } from '@order/state/userProgress.context';

import logoImg from '../assets/logo.jpg';

export function Header() {
  const { items } = useCart();
  const { showCart } = useUserProgress();

  const itemsTotal = items.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <header id="main-header">
      <div id="title">
        <img src={logoImg} alt="A restaurant" />
        <h1>ReactFood</h1>
      </div>
      <nav>
        <button type="button" className="text-button" onClick={showCart}>
          Cart ({itemsTotal})
        </button>
      </nav>
    </header>
  );
}
