export type UserProgressValue = 'idle' | 'cart' | 'checkout' | 'success';

export interface UserProgreeContextValue {
  state: UserProgressValue;
  showCart: () => void;
  showCheckout: () => void;
  showSuccess: () => void;
  clearProgress: () => void;
}
