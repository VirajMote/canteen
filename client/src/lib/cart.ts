import type { CartItem, Dish } from "@shared/schema";

const CART_STORAGE_KEY = "canteen_cart";

export const getCart = (): CartItem[] => {
  try {
    const cart = localStorage.getItem(CART_STORAGE_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error("Error reading cart from localStorage:", error);
    return [];
  }
};

export const saveCart = (cart: CartItem[]): void => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

export const addToCart = (dish: Dish, quantity: number = 1): void => {
  const cart = getCart();
  const existingItem = cart.find(item => item.dishId === dish.id);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      dishId: dish.id,
      quantity,
      dish
    });
  }

  saveCart(cart);
};

export const updateQuantity = (dishId: number, quantity: number): void => {
  const cart = getCart();
  const itemIndex = cart.findIndex(item => item.dishId === dishId);

  if (itemIndex > -1) {
    if (quantity <= 0) {
      cart.splice(itemIndex, 1);
    } else {
      cart[itemIndex].quantity = quantity;
    }
    saveCart(cart);
  }
};

export const removeFromCart = (dishId: number): void => {
  const cart = getCart();
  const filteredCart = cart.filter(item => item.dishId !== dishId);
  saveCart(filteredCart);
};

export const clearCart = (): void => {
  saveCart([]);
};

export const getCartItemCount = (): number => {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
};

export const getCartTotal = (): number => {
  const cart = getCart();
  return cart.reduce((total, item) => total + (parseFloat(item.dish.price) * item.quantity), 0);
};
