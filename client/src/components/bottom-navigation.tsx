import { Home, ShoppingCart, Receipt } from "lucide-react";
import { useLocation } from "wouter";
import { getCart } from "@/lib/cart";
import { useState, useEffect } from "react";

export default function BottomNavigation() {
  const [location, setLocation] = useLocation();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = getCart();
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalItems);
    };

    updateCartCount();
    
    // Listen for storage changes to update cart count
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "canteen_cart") {
        updateCartCount();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Also listen for custom events for same-tab updates
    const handleCartUpdate = () => updateCartCount();
    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  const isActive = (path: string) => location === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center">
        <button
          onClick={() => setLocation("/home")}
          className={`flex flex-col items-center space-y-1 p-2 transition-colors ${
            isActive("/home") ? "text-primary" : "text-gray-600 hover:text-primary"
          }`}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs">Home</span>
        </button>

        <button
          onClick={() => setLocation("/cart")}
          className={`flex flex-col items-center space-y-1 p-2 transition-colors relative ${
            isActive("/cart") ? "text-primary" : "text-gray-600 hover:text-primary"
          }`}
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="text-xs">Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setLocation("/orders")}
          className={`flex flex-col items-center space-y-1 p-2 transition-colors ${
            isActive("/orders") ? "text-primary" : "text-gray-600 hover:text-primary"
          }`}
        >
          <Receipt className="w-6 h-6" />
          <span className="text-xs">Orders</span>
        </button>
      </div>
    </nav>
  );
}
