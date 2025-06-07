import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useAuth } from "./AuthContext";

export interface CartItem {
	menu_item_id: number;
	quantity: number;
	item_name: string;
	item_price: number;
	item_category: string;
}

interface CartContextType {
	cartItems: CartItem[];
	cartId: string;
	addItem: (menuItemId: number, quantity: number) => Promise<void>;
	updateItem: (menuItemId: number, quantity: number) => Promise<void>;
	removeItem: (menuItemId: number) => Promise<void>;
	refreshCart: () => Promise<void>;
	checkout: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
	const { token } = useAuth();
	const [cartItems, setCartItems] = useState<CartItem[]>([]);
	const [cartId, setCartId] = useState<string>("");

	useEffect(() => {
		let id = localStorage.getItem("cartId");
		if (!id) {
			id = crypto.randomUUID();
			localStorage.setItem("cartId", id);
		}
		setCartId(id);
	}, []);

	const refreshCart = async () => {
		const endpoint = token ? "/cart/user" : `/cart/${cartId}`;
		const res = await fetch(endpoint, {
			headers: token ? { Authorization: `Bearer ${token}` } : {},
		});
		const data = await res.json();
		setCartItems(data);
	};

	useEffect(() => {
		if (cartId || token) {
			refreshCart();
		}
	}, [cartId, token]);

	const addItem = async (menuItemId: number, quantity: number) => {
		await fetch("/cart", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...(token ? { Authorization: `Bearer ${token}` } : {}),
			},
			body: JSON.stringify({ cartId, menuItemId, quantity }),
		});
		await refreshCart();
	};

	const updateItem = async (menuItemId: number, quantity: number) => {
		await fetch(`/cart/${cartId}/item/${menuItemId}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ quantity }),
		});
		await refreshCart();
	};

	const removeItem = async (menuItemId: number) => {
		await fetch(`/cart/${cartId}/item/${menuItemId}`, {
			method: "DELETE",
		});
		await refreshCart();
	};

	const checkout = async () => {
		await fetch("/checkout", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ cartId }),
		});
		setCartItems([]);
		localStorage.removeItem("cartId");
		const newId = crypto.randomUUID();
		localStorage.setItem("cartId", newId);
		setCartId(newId);
	};

	return (
		<CartContext.Provider
			value={{ cartItems, cartId, addItem, updateItem, removeItem, refreshCart, checkout }}
		>
			{children}
		</CartContext.Provider>
	);
};

export const useCart = () => {
	const context = useContext(CartContext);
	if (!context) {
		throw new Error("useCart must be used within a CartProvider");
	}
	return context;
};
