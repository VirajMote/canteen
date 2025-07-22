import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Login from "@/pages/login";
import Home from "@/pages/home";
import Menu from "@/pages/menu";
import Cart from "@/pages/cart";
import Orders from "@/pages/orders";
import BottomNavigation from "@/components/bottom-navigation";
import FloatingMenuButton from "@/components/floating-menu-button";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import type { Student } from "@shared/schema";

function Router() {
  const [location] = useLocation();
  const [currentUser, setCurrentUser] = useState<Student | null>(null);
  
  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const isLoginPage = location === "/" || location === "/login";
  
  return (
    <div className="relative">
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/" component={Login} />
        <Route path="/home" component={Home} />
        <Route path="/menu" component={Menu} />
        <Route path="/cart" component={Cart} />
        <Route path="/orders" component={Orders} />
      </Switch>
      
      {!isLoginPage && currentUser && (
        <>
          <BottomNavigation />
          <FloatingMenuButton />
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
