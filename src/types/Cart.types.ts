export interface CartItem {
  id: string;
  name: string;
  price: string;
  amount: number;
}

export interface CartContextValue {
  items: CartItem[];
  total: string;
  addToCart: (_item: CartItem) => void;
  increaseItemAmount: (_id: string) => void;
  decreaseItemAmount: (_id: string) => void;
  onCheckout: () => void;
}

export interface CartHandler {
  open: () => void;
  close: () => void;
}

export interface CheckoutHandler {
  open: () => void;
  close: () => void;
}
