import { useRef } from 'react';

import { useCart } from '@order/state/cart.context';
import { CartHandler } from '@order/types/Cart.types';

import logoImg from '../assets/logo.jpg';

import { CartPopup } from './CartPopup';

export function Header() {
  const { items } = useCart();
  const cartRef = useRef<CartHandler>(null);

  const itemsTotal = items.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <header id="main-header">
      <CartPopup ref={cartRef} />
      <div id="title">
        <img src={logoImg} alt="A restaurant" />
        <h1>ReactFood</h1>
      </div>
      <nav>
        <button type="button" className="text-button" onClick={() => cartRef.current?.open()}>
          Cart ({itemsTotal})
        </button>
      </nav>
    </header>
  );
}
