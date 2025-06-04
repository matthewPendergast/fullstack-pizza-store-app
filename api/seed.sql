-- DEVELOPMENT ONLY: Clear existing data
TRUNCATE TABLE order_items, orders, cart_items, menu_items, users RESTART IDENTITY CASCADE;

-- Test User
INSERT INTO users (name, email, hashed_password)
VALUES ('Test User', 'test@example.com', 'hashed-password-placeholder');

-- Menu Items – Pizzas
INSERT INTO menu_items (name, description, price, category)
VALUES
  ('Margherita', 'Classic pizza with tomato sauce, mozzarella, and basil.', 9.99, 'pizza'),
  ('Pepperoni', 'Spicy pepperoni with mozzarella on tomato base.', 11.49, 'pizza'),
  ('Veggie Deluxe', 'Bell peppers, onions, mushrooms, and olives.', 10.99, 'pizza'),
  ('BBQ Chicken', 'Grilled chicken, BBQ sauce, red onion, mozzarella.', 12.49, 'pizza');
