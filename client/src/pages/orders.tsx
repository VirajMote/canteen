import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import type { Student, Order } from "@shared/schema";

export default function Orders() {
  const [currentUser, setCurrentUser] = useState<Student | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["/api/students", currentUser?.id, "orders"],
    queryFn: async () => {
      if (!currentUser) return [];
      const response = await fetch(`/api/students/${currentUser.id}/orders`);
      if (!response.ok) throw new Error("Failed to fetch orders");
      return response.json();
    },
    enabled: !!currentUser,
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      placed: { label: "Order Placed", variant: "secondary" as const, color: "bg-blue-100 text-blue-800" },
      confirmed: { label: "Confirmed", variant: "secondary" as const, color: "bg-green-100 text-green-800" },
      preparing: { label: "Preparing", variant: "default" as const, color: "bg-yellow-100 text-yellow-800" },
      ready: { label: "Ready for Pickup", variant: "destructive" as const, color: "bg-orange-100 text-orange-800" },
      completed: { label: "Completed", variant: "secondary" as const, color: "bg-green-100 text-green-800" }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.placed;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getStatusSteps = (status: string) => {
    const steps = [
      { key: "placed", label: "Order Placed", time: "12:30 PM" },
      { key: "confirmed", label: "Payment Confirmed", time: "12:31 PM" },
      { key: "preparing", label: "Preparing Your Order", time: "Est. 5-10 minutes" },
      { key: "ready", label: "Ready for Pickup", time: "Pending" },
    ];

    const statusOrder = ["placed", "confirmed", "preparing", "ready", "completed"];
    const currentIndex = statusOrder.indexOf(status);

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex,
    }));
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-light pb-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please login to view your orders</p>
          <Button onClick={() => setLocation("/login")}>Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-light pb-20">
      <header className="bg-white shadow-sm px-4 py-4">
        <h2 className="text-xl font-semibold text-gray-800">Order Status</h2>
      </header>

      <div className="px-4 py-6">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, index) => (
              <Card key={index}>
                <CardContent className="p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : orders?.length ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800">Order #{order.id}</h3>
                    {getStatusBadge(order.status)}
                  </div>

                  {/* Order Status Steps */}
                  <div className="space-y-4 mb-6">
                    {getStatusSteps(order.status).map((step, index) => (
                      <div key={step.key} className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${
                          step.active ? 'bg-primary animate-pulse' : 
                          step.completed ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                        <div className="flex-1">
                          <p className={`font-medium ${
                            step.completed ? 'text-gray-800' : 'text-gray-400'
                          }`}>
                            {step.label}
                          </p>
                          <p className={`text-sm ${
                            step.completed ? 'text-gray-600' : 'text-gray-400'
                          }`}>
                            {step.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Items */}
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Items Ordered</h4>
                    <div className="space-y-2">
                      {Array.isArray(order.items) ? order.items.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span>Dish ID {item.dishId} × {item.quantity}</span>
                          <span>₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                        </div>
                      )) : (
                        <div className="text-sm text-gray-600">Order details unavailable</div>
                      )}
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between font-semibold">
                          <span>Total</span>
                          <span>₹{parseFloat(order.total).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Date */}
                  {order.createdAt && (
                    <div className="mt-4 pt-4 border-t text-sm text-gray-600">
                      Ordered on: {new Date(order.createdAt).toLocaleString()}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6 text-center">You haven't placed any orders yet. Start browsing our delicious menu!</p>
            <Button 
              onClick={() => setLocation("/menu")}
              className="bg-primary hover:bg-primary-light text-white px-6 py-3"
            >
              Browse Menu
            </Button>
          </div>
        )}

        {/* Pickup Instructions */}
        {orders?.some(order => order.status === "ready") && (
          <Card className="mt-6 bg-primary-lighter border-primary">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-800 mb-2">Pickup Instructions</h3>
              <p className="text-gray-700 text-sm">
                Please show this screen at the counter when your order is ready. You will receive a notification.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
