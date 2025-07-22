import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { getCart, updateQuantity, removeFromCart, clearCart } from "@/lib/cart";
import { apiRequest } from "@/lib/queryClient";
import type { CartItem, Student } from "@shared/schema";

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<Student | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    setCartItems(getCart());
    const user = localStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const handleUpdateQuantity = (dishId: number, newQuantity: number) => {
    updateQuantity(dishId, newQuantity);
    setCartItems(getCart());
  };

  const handleRemoveItem = (dishId: number) => {
    removeFromCart(dishId);
    setCartItems(getCart());
    toast({
      title: "Item Removed",
      description: "Item has been removed from your cart."
    });
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (parseFloat(item.dish.price) * item.quantity), 0);
  };

  const calculateTax = (subtotal: number) => {
    return subtotal * 0.05; // 5% tax
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    return subtotal + tax;
  };

  const handlePlaceOrder = async () => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "Please login first.",
        variant: "destructive"
      });
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart first.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const orderItems = cartItems.map(item => ({
        dishId: item.dishId,
        quantity: item.quantity,
        price: item.dish.price
      }));

      await apiRequest("POST", "/api/orders", {
        studentId: currentUser.id,
        items: orderItems,
        total: calculateTotal().toFixed(2),
        paymentMethod
      });

      clearCart();
      setCartItems([]);

      toast({
        title: "Order Placed!",
        description: "Your order has been placed successfully."
      });

      setLocation("/orders");
    } catch (error) {
      toast({
        title: "Order Failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-light pb-20">
        <header className="bg-white shadow-sm px-4 py-4">
          <h2 className="text-xl font-semibold text-gray-800">Your Cart</h2>
        </header>
        
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="text-6xl mb-4">🛒</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Your cart is empty</h3>
          <p className="text-gray-600 mb-6 text-center">Add some delicious items to your cart to get started!</p>
          <Button 
            onClick={() => setLocation("/menu")}
            className="bg-primary hover:bg-primary-light text-white px-6 py-3"
          >
            Browse Menu
          </Button>
        </div>
      </div>
    );
  }

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-light pb-20">
      <header className="bg-white shadow-sm px-4 py-4">
        <h2 className="text-xl font-semibold text-gray-800">Your Cart</h2>
      </header>

      <div className="px-4 py-6">
        {/* Cart Items */}
        <div className="space-y-4 mb-6">
          {cartItems.map((item) => (
            <Card key={item.dishId}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.dish.image}
                    alt={item.dish.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{item.dish.name}</h4>
                    <p className="text-primary font-semibold">₹{item.dish.price}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-8 h-8 rounded-full border-primary text-primary hover:bg-primary hover:text-white"
                      onClick={() => handleUpdateQuantity(item.dishId, Math.max(0, item.quantity - 1))}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="font-medium min-w-[2rem] text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-8 h-8 rounded-full bg-primary text-white hover:bg-primary-light"
                      onClick={() => handleUpdateQuantity(item.dishId, item.quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleRemoveItem(item.dishId)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (5%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Payment Method</h3>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash">Cash on Pickup</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="upi" id="upi" />
                <Label htmlFor="upi">UPI Payment</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card">Card Payment</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Place Order Button */}
        <Button
          onClick={handlePlaceOrder}
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary-light text-white font-semibold py-4 rounded-xl"
        >
          {isLoading ? "Placing Order..." : `Place Order - ₹${total.toFixed(2)}`}
        </Button>
      </div>
    </div>
  );
}
