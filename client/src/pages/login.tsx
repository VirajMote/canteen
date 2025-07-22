import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Utensils } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Login() {
  const [rollNumber, setRollNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rollNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter your roll number",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/auth/login", {
        rollNumber: rollNumber.trim()
      });
      
      const { student } = await response.json();
      localStorage.setItem("currentUser", JSON.stringify(student));
      
      toast({
        title: "Welcome!",
        description: `Hello, ${student.name}! Your account is ready.`
      });
      
      setLocation("/home");
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Please check your roll number and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-lighter to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="pt-8 p-8">
          <div className="text-center mb-8">
            <div className="bg-primary rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Utensils className="text-white text-2xl w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">College Canteen</h1>
            <p className="text-gray-600">Enter your roll number to continue</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Student Roll Number
              </Label>
              <Input
                id="rollNumber"
                type="text"
                placeholder="e.g., CSE2021001"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                required
              />
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-light text-white font-semibold py-3 rounded-lg"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            New student? Account will be created automatically
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
