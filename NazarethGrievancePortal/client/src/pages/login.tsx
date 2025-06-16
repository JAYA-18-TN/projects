import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { getRoleColor } from "@/lib/utils";
import { TermsModal } from "@/components/terms-modal";

export default function LoginPage() {
  const { userType } = useParams();
  const [, setLocation] = useLocation();
  const { login, isLoading, error, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showTerms, setShowTerms] = useState(false);

  useEffect(() => {
    if (user) {
      setShowTerms(true);
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  const handleTermsAccept = () => {
    setShowTerms(false);
    setLocation("/dashboard");
  };

  const handleBackToMain = () => {
    setLocation("/");
  };

  if (!userType || !["student", "staff", "management", "admin"].includes(userType)) {
    setLocation("/");
    return null;
  }

  const config = {
    student: {
      color: getRoleColor("student"),
      badge: "Student Login",
      placeholder: "student@ncas.in",
      icon: "fas fa-user-graduate"
    },
    staff: {
      color: getRoleColor("staff"),
      badge: "Staff Login", 
      placeholder: "staff@ncas.in",
      icon: "fas fa-user-tie"
    },
    management: {
      color: getRoleColor("management"),
      badge: "Management Login",
      placeholder: "management@ncas.in", 
      icon: "fas fa-cogs"
    },
    admin: {
      color: getRoleColor("admin"),
      badge: "Admin Login",
      placeholder: "admin@ncas.in",
      icon: "fas fa-user-shield"
    }
  };

  const currentConfig = config[userType as keyof typeof config];

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white"
              style={{ backgroundColor: currentConfig.color }}
            >
              <span className="font-bold">NCAS</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">Grievance Portal</h2>
            <div 
              className="inline-block px-3 py-1 rounded-full text-white text-sm font-medium mt-2"
              style={{ backgroundColor: currentConfig.color }}
            >
              {currentConfig.badge}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                Email
              </Label>
              <div className="relative">
                <i className="fas fa-envelope absolute left-3 top-3 text-gray-400"></i>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  placeholder={currentConfig.placeholder}
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <Label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
                Password
              </Label>
              <div className="relative">
                <i className="fas fa-lock absolute left-3 top-3 text-gray-400"></i>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="mb-4 text-red-600 text-sm">
                {error.message}
              </div>
            )}

            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              style={{ backgroundColor: currentConfig.color }}
            >
              <i className="fas fa-sign-in-alt"></i>
              <span>{isLoading ? "Logging in..." : "Login"}</span>
            </Button>
          </form>

          <div className="text-center mt-6">
            <Button 
              variant="ghost"
              onClick={handleBackToMain}
              className="text-gray-500 hover:text-gray-700 text-sm flex items-center justify-center mx-auto space-x-1"
            >
              <i className="fas fa-arrow-left"></i>
              <span>Back to Main Page</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {showTerms && user && (
        <TermsModal
          userType={user.role}
          isOpen={showTerms}
          onClose={() => setShowTerms(false)}
          onAccept={handleTermsAccept}
        />
      )}
    </div>
  );
}
