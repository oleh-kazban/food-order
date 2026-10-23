import { createContext, useContext } from 'react';

import { UserProgreeContextValue } from '@order/types/UserProgress.types';

export const UserProgressContext = createContext<UserProgreeContextValue | null>(null);

export function useUserProgress() {
  const context = useContext(UserProgressContext);

  if (!context) {
    throw new Error('useUserContext must be used within UserProgress');
  }

  return context;
}
