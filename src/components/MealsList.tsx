import { Meal } from '@order/types/Meal.types';

import { MealItem } from './MealItem';

type MealListProps = {
  meals: Meal[];
};

export function MealList({ meals }: MealListProps) {
  return (
    <ul id="meals">
      {meals.map(({ id, name, price, description, image }) => (
        <MealItem
          key={id}
          id={id}
          name={name}
          price={price}
          description={description}
          img={image}
        />
      ))}
    </ul>
  );
}
