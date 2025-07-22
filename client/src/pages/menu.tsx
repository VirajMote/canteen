import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import DishCard from "@/components/dish-card";
import type { Category, Dish } from "@shared/schema";

export default function Menu() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: dishes } = useQuery<Dish[]>({
    queryKey: ["/api/dishes", selectedCategory, searchQuery],
    queryFn: async () => {
      let url = "/api/dishes";
      const params = new URLSearchParams();
      
      if (searchQuery.trim()) {
        params.append("search", searchQuery);
      } else if (selectedCategory) {
        params.append("categoryId", selectedCategory.toString());
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch dishes");
      return response.json();
    },
  });

  const { data: vegPopular } = useQuery<Dish[]>({
    queryKey: ["/api/dishes", "popular", "veg"],
    queryFn: async () => {
      const response = await fetch("/api/dishes?popularCategory=veg");
      if (!response.ok) throw new Error("Failed to fetch dishes");
      return response.json();
    },
  });

  const { data: nonVegPopular } = useQuery<Dish[]>({
    queryKey: ["/api/dishes", "popular", "non-veg"],
    queryFn: async () => {
      const response = await fetch("/api/dishes?popularCategory=non-veg");
      if (!response.ok) throw new Error("Failed to fetch dishes");
      return response.json();
    },
  });

  const { data: breakfastPopular } = useQuery<Dish[]>({
    queryKey: ["/api/dishes", "popular", "breakfast"],
    queryFn: async () => {
      const response = await fetch("/api/dishes?popularCategory=breakfast");
      if (!response.ok) throw new Error("Failed to fetch dishes");
      return response.json();
    },
  });

  const { data: southIndianPopular } = useQuery<Dish[]>({
    queryKey: ["/api/dishes", "popular", "south-indian"],
    queryFn: async () => {
      const response = await fetch("/api/dishes?popularCategory=south-indian");
      if (!response.ok) throw new Error("Failed to fetch dishes");
      return response.json();
    },
  });

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategory(categoryId);
    setSearchQuery("");
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-gray-light pb-20">
      {/* Header with Search */}
      <header className="bg-white shadow-sm px-4 py-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search for dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
      </header>

      <div className="px-4 py-6">
        {/* Show filtered results if category selected or search active */}
        {(selectedCategory || searchQuery.trim()) && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {searchQuery.trim() 
                  ? `Search results for "${searchQuery}"`
                  : `${categories?.find(c => c.id === selectedCategory)?.name || "Category"} Dishes`
                }
              </h3>
              <button 
                onClick={clearFilters}
                className="text-primary text-sm font-medium"
              >
                Show All Categories
              </button>
            </div>
            
            {dishes?.length ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {dishes.map((dish) => (
                  <DishCard key={dish.id} dish={dish} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No dishes found.
              </div>
            )}
          </section>
        )}

        {/* Categories Section - only show when no filters are active */}
        {!selectedCategory && !searchQuery.trim() && (
          <>
            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Categories</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {categories?.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-800 text-center">{category.name}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Popular Sections */}
            <div className="space-y-8">
              {/* Popular in Veg */}
              {vegPopular && vegPopular.length > 0 && (
                <section>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Popular in Veg</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {vegPopular.map((dish) => (
                      <DishCard key={dish.id} dish={dish} />
                    ))}
                  </div>
                </section>
              )}

              {/* Popular in Non-Veg */}
              {nonVegPopular && nonVegPopular.length > 0 && (
                <section>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Popular in Non-Veg</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {nonVegPopular.map((dish) => (
                      <DishCard key={dish.id} dish={dish} />
                    ))}
                  </div>
                </section>
              )}

              {/* Popular in Breakfast */}
              {breakfastPopular && breakfastPopular.length > 0 && (
                <section>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Popular in Breakfast</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {breakfastPopular.map((dish) => (
                      <DishCard key={dish.id} dish={dish} />
                    ))}
                  </div>
                </section>
              )}

              {/* Popular in South Indian */}
              {southIndianPopular && southIndianPopular.length > 0 && (
                <section>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Popular in South Indian</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {southIndianPopular.map((dish) => (
                      <DishCard key={dish.id} dish={dish} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
