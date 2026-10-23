import { useEffect, useState } from 'react';

import { CartProvider } from './components/Cart.provider';
import { CartPopup } from './components/CartPopup';
import { CheckoutPopup } from './components/CheckoutPopup';
import { Header } from './components/Header';
import { MealList } from './components/MealsList';
import { NoMeals } from './components/NoMeals';
import { SuccessPopup } from './components/SuccessPopup';
import { UserProgressProvider } from './components/UserProgress.provider';
import { Meal } from './types/Meal.types';

function App() {
  const [meals, setMeals] = useState<Meal[]>([]);

  async function getMeals() {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/meals`);

    if (!response.ok) {
      throw new Error('Failed fetch meals');
    }

    return (await response.json()) as Meal[];
  }

  useEffect(() => {
    getMeals().then(data => {
      setMeals(data);
    });
  }, []);

  return (
    <UserProgressProvider>
      <CartProvider>
        <Header />
        {meals && meals.length ? <MealList meals={meals} /> : <NoMeals />}
        <CartPopup />
        <CheckoutPopup />
        <SuccessPopup />
      </CartProvider>
    </UserProgressProvider>
  );
}

export default App;
