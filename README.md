# Full Stack Pizza Store App

A full-stack pizza ordering web app being built with React, Node, Express, and PostgreSQL. This project will emulate a real pizza ordering website, and it is currently in active MVP development.

## Tech Stack

-   **Frontend:** React, Tailwind CSS
-   **Backend:** Node.js, Express
-   **Database:** PostgreSQL
-   **DevOps:** Docker
-   **Testing:** Jest

## MVP Features

-   View pizza menu
-   Add/remove items from cart (with anonymous user support)
-   Mock checkout with fake order confirmation page
-   User signup/login functionality
-   Backend stores order info for guests or logged-in users
-   Responsive UI inspired by real-world applications

## Roadmap

### MVP

-   Backend
    -   ✅ Design database schema and populate with initial seed data
    -   ✅ Menu route (GET)
    -   ✅ Cart routes (GET, POST, PUT, DELETE)
    -   ✅ User auth routes (signup, login with JWT)
    -   ✅ Checkout/order routes (POST, GET)
	-	⬜ Health check route
    -   ⬜ Dockerized local development setup
    -   ⬜ Basic Jest tests (menu, cart, auth)
- Security & Middleware
	-   ⬜ Helmet for secure headers
	-   ⬜ Rate limiting on sensitive routes
	-   ⬜ Input validation/sanitization middleware
	-   ⬜ CORS configuration
-   Frontend
    -   ⬜ Menu page
    -   ⬜ Signup page
    -   ⬜ Login page
    -   ⬜ Cart page
-   Deployment
    -   ⬜ Deploy backend
    -   ⬜ Deploy frontend
	-   ⬜ Connect with hosted database

## API Documentation

### Routes

**Menu** `/menu`

- **GET** `/`

	Returns a list of all available menu items.

	Response:

	```json
	[
		{
			"id": 1,
			"name": "Margherita",
			"description": "Classic cheese and tomato pizza.",
			"price": "10.99",
			"category": "Pizza",
			"created_at": "2025-06-04T18:55:00.000Z"
		}
	]
	```

**Cart** `/cart`

- **POST** `/`

	Adds an item to the cart. If the item already exists, it increases the quantity.

	Request:

	```json
	{
		"cartId": "123e4567-e89b-12d3-a456-426614174000",
		"menuItemId": 1,
		"quantity": 2
	}
	```

	Response:
	```json
	{
  		"message": "Item added to cart"
	}
	```

- **GET** `/:cartId`

	Retrieves all items in the specified cart.

	Path Parameter:

	- cartId (UUID)

	Response:

	```json
	[
		{
			"id": 1,
			"cart_id": "123e4567-e89b-12d3-a456-426614174000",
			"user_id": 1,
			"menu_item_id": 1,
			"quantity": 2,
			"created_at": "2025-06-04T19:00:00.000Z",
			"item_name": "Margherita",
			"item_price": "10.99",
			"item_category": "Pizza"
		}
	]
	```

- **PUT** `/:cartId/item/:menuItemId`

	Updates the quantity of the specified item in the cart.

	Path Parameters:

	- cartId (UUID)
	- menuItemId (integer)

	Request:

	```json
	{
		"quantity": 5
	}
	```

	Response:

	```json
	{
  		"message": "Cart item updated."
	}
	```

- **DELETE** `/:cartId/item/:menuItemId`

	Removes the specified item from the cart.

	Path Parameters:

	- cartId (UUID)
	- menuItemId (integer)

	Response:

	```json
	{
		"message": "Cart item removed."
	}
	```

**Auth** `/auth`

- **POST** `/signup`

	Creates a new user account.

	Request:

	```json
	{
		"name": "Jane Doe",
		"email": "jane@example.com",
		"password": "securePassword123"
	}
	```

	Response:

	```json
	{
		"message": "User created successfully.",
		"user": {
			"id": 1,
			"name": "Jane Doe",
			"email": "jane@example.com",
			"created_at": "2025-06-04T20:00:00.000Z"
		}
	}
	```

- **POST** `/login`

	Logs in an existing user and returns a JWT token.

	Request:

	```json
		{
			"email": "jane@example.com",
			"password": "securePassword123"
		}
	```

	Response:

	```json
	{
		"message": "Login successful.",
		"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
		"user": {
			"id": 1,
			"name": "Jane Doe",
			"email": "jane@example.com"
		}
	}
	```

**Checkout** `/checkout`

- **POST** `/`

	Creates a new order for an authenticated user using the specified cart.

	Headers:

	- Authorization: Bearer <JWT\>

	Request:

	```json
		{
			"cartId": "123e4567-e89b-12d3-a456-426614174000"
		}
	```

	Response:

	```json
		{
			"message": "Order 123 placed successfully."
		}
	```

**Orders** `/orders`

- **GET** `/`

	Retrieves order history for authenticated user.

	Headers:

	- Authorization: Bearer <JWT\>

	Response:

	```json
		[
			{
				"id": 1,
				"total_price": "29.97",
				"created_at": "2025-06-05T15:30:00.000Z",
				"items": [
					{
						"menu_item_id": 1,
						"quantity": 2,
						"price": "10.99"
					},
					{
						"menu_item_id": 3,
						"quantity": 1,
						"price": "7.99"
					}
				]
			}
		]

	```