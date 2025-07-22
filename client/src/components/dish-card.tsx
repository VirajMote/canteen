import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { addToCart, updateQuantity, getCart } from "@/lib/cart";
import type { Dish } from "@shared/schema";

interface DishCardProps {
  dish: Dish;
}

export default function DishCard({ dish }: DishCardProps) {
  const [quantity, setQuantity] = useState(() => {
    const cart = getCart();
    const cartItem = cart.find(item => item.dishId === dish.id);
    return cartItem?.quantity || 1;
  });
  
  const { toast } = useToast();
  
  const isInCart = getCart().some(item => item.dishId === dish.id);

  const handleAddToCart = () => {
    addToCart(dish, quantity);
    toast({
      title: "Added to Cart",
      description: `${dish.name} has been added to your cart.`
    });
    
    // Dispatch custom event for cart updates
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    setQuantity(newQuantity);
    if (isInCart) {
      updateQuantity(dish.id, newQuantity);
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <img 
        src={dish.image} 
        alt={dish.name} 
        className="w-full h-32 object-cover"
      />
      <div className="p-3">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium text-gray-800">{dish.name}</h4>
          <span className={`text-xs ${dish.isVeg ? 'text-green-600' : 'text-red-600'}`}>
            {dish.isVeg ? '●' : '■'}
          </span>
        </div>
        <p className="text-primary font-semibold mb-3">₹{dish.price}</p>
        
        {isInCart ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="w-6 h-6 rounded-full border-primary text-primary hover:bg-primary hover:text-white"
                onClick={() => handleUpdateQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="text-sm font-medium min-w-[1rem] text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="w-6 h-6 rounded-full bg-primary text-white hover:bg-primary-light"
                onClick={() => handleUpdateQuantity(quantity + 1)}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
            <span className="text-xs text-green-600 font-medium">In Cart</span>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="w-6 h-6 rounded-full border-primary text-primary"
                onClick={() => handleUpdateQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="text-sm font-medium min-w-[1rem] text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="w-6 h-6 rounded-full bg-primary text-white"
                onClick={() => handleUpdateQuantity(quantity + 1)}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
            <Button
              onClick={handleAddToCart}
              className="bg-primary text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-primary-light"
            >
              Add
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
