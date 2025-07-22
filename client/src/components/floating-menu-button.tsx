import { Utensils } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function FloatingMenuButton() {
  const [location, setLocation] = useLocation();

  // Don't show the floating button on the menu page itself
  if (location === "/menu") {
    return null;
  }

  return (
    <Button
      onClick={() => setLocation("/menu")}
      className="fixed bottom-20 right-4 bg-primary hover:bg-primary-light text-white w-14 h-14 rounded-full shadow-lg z-50 p-0"
      size="icon"
    >
      <Utensils className="w-6 h-6" />
    </Button>
  );
}
