import { ReactNode, useState } from 'react';

import { UserProgressContext } from '@order/state/userProgress.context';
import { UserProgressValue } from '@order/types/UserProgress.types';

export function UserProgressProvider({ children }: { children: ReactNode }) {
  const [userProgress, setUserProgress] = useState<UserProgressValue>('idle');

  const showCart = () => {
    setUserProgress('cart');
  };

  const showCheckout = () => {
    setUserProgress('checkout');
  };
  const showSuccess = () => {
    setUserProgress('success');
  };

  const clearProgress = () => {
    setUserProgress('idle');
  };

  const value = {
    state: userProgress,
    showCart,
    showCheckout,
    showSuccess,
    clearProgress,
  };

  return <UserProgressContext.Provider value={value}>{children}</UserProgressContext.Provider>;
}
