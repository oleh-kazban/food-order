export interface CheckoutItem {
  name: string;
  amount: number;
}

export interface Checkout {
  id: string;
  items: CheckoutItem[];
  total: string;
}
