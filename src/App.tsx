function App() {
  return (
    <ul id="meals">
      <li className="meal-item">
        <article>
          <img src="/images/mac-and-cheese.jpg" alt="Mac & Cheese" />
          <div>
            <h3>Mac & Cheese</h3>
            <p className="meal-item-price">$8.99</p>
            <p className="meal-item-description">
              Creamy cheddar cheese mixed with perfectly cooked macaroni, topped with crispy
              breadcrumbs. A classic comfort food.
            </p>
          </div>
          <p className="meal-item-actions">
            <button type="button" className="button">
              Add to Cart
            </button>
          </p>
        </article>
      </li>

      <li className="meal-item">
        <article>
          <img src="/images/margherita-pizza.jpg" alt="Margherita Pizza" />
          <div>
            <h3>Margherita Pizza</h3>
            <p className="meal-item-price">$12.99</p>
            <p className="meal-item-description">
              A classic pizza with fresh mozzarella, tomatoes, and basil on a thin and crispy crust.
            </p>
          </div>
          <p className="meal-item-actions">
            <button type="button" className="button">
              Add to Cart
            </button>
          </p>
        </article>
      </li>

      <li className="meal-item">
        <article>
          <img src="/images/caesar-salad.jpg" alt="Caesar Salad" />
          <div>
            <h3>Caesar Salad</h3>
            <p className="meal-item-price">$7.99</p>
            <p className="meal-item-description">
              Romaine lettuce tossed in Caesar dressing, topped with croutons and parmesan shavings.
            </p>
          </div>
          <p className="meal-item-actions">
            <button type="button" className="button">
              Add to Cart
            </button>
          </p>
        </article>
      </li>

      <li className="meal-item">
        <article>
          <img src="/images/spaghetti-carbonara.jpg" alt="Spaghetti Carbonara" />
          <div>
            <h3>Spaghetti Carbonara</h3>
            <p className="meal-item-price">$10.99</p>
            <p className="meal-item-description">
              Al dente spaghetti with a creamy sauce made from egg yolk, pecorino cheese, pancetta,
              and pepper.
            </p>
          </div>
          <p className="meal-item-actions">
            <button type="button" className="button">
              Add to Cart
            </button>
          </p>
        </article>
      </li>

      <li className="meal-item">
        <article>
          <img src="/images/veggie-burger.jpg" alt="Veggie Burger" />
          <div>
            <h3>Veggie Burger</h3>
            <p className="meal-item-price">$9.99</p>
            <p className="meal-item-description">
              A juicy veggie patty served on a whole grain bun with lettuce, tomato, and a tangy
              sauce.
            </p>
          </div>
          <p className="meal-item-actions">
            <button type="button" className="button">
              Add to Cart
            </button>
          </p>
        </article>
      </li>

      <li className="meal-item">
        <article>
          <img src="/images/grilled-chicken-sandwich.jpg" alt="Grilled Chicken Sandwich" />
          <div>
            <h3>Grilled Chicken Sandwich</h3>
            <p className="meal-item-price">$10.99</p>
            <p className="meal-item-description">
              Tender grilled chicken breast with avocado, bacon, lettuce, and honey mustard on a
              toasted bun.
            </p>
          </div>
          <p className="meal-item-actions">
            <button type="button" className="button">
              Add to Cart
            </button>
          </p>
        </article>
      </li>
    </ul>
  );
}

export default App;
