import { useEffect, useState } from 'react';

import { CartProvider } from './components/Cart.provider';
import { Header } from './components/Header';
import { MealList } from './components/MealsList';
import { NoMeals } from './components/NoMeals';
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
    <CartProvider>
      <Header />
      {meals && meals.length ? <MealList meals={meals} /> : <NoMeals />}
    </CartProvider>
  );
}

export default App;
