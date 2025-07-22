import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import DishCard from "@/components/dish-card";
import type { Student, Dish } from "@shared/schema";

export default function Home() {
  const [currentUser, setCurrentUser] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const { data: popularDishes, isLoading } = useQuery<Dish[]>({
    queryKey: ["/api/dishes"],
    queryFn: async () => {
      const response = await fetch("/api/dishes?popular=true");
      if (!response.ok) throw new Error("Failed to fetch dishes");
      return response.json();
    },
  });

  const { data: searchResults } = useQuery<Dish[]>({
    queryKey: ["/api/dishes", "search", searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      const response = await fetch(`/api/dishes?search=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error("Failed to search dishes");
      return response.json();
    },
    enabled: searchQuery.trim().length > 0,
  });

  const displayDishes = searchQuery.trim() ? searchResults : popularDishes;

  return (
    <div className="min-h-screen bg-gray-light pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Hello, {currentUser?.name || "Student"}
            </h2>
            <p className="text-sm text-gray-600">What would you like to eat today?</p>
          </div>
          <div className="relative">
            <Input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-48 focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>
      </header>

      {/* Popular Dishes Section */}
      <section className="px-4 py-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {searchQuery.trim() ? `Search results for "${searchQuery}"` : "Popular dishes of all time"}
        </h3>
        
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                <div className="w-full h-32 bg-gray-200"></div>
                <div className="p-3">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-3 w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : displayDishes?.length ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {displayDishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {searchQuery.trim() ? "No dishes found matching your search." : "No popular dishes available."}
          </div>
        )}
      </section>
    </div>
  );
}
