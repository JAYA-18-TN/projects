import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import LandingPage from "@/pages/landing";
import LoginPage from "@/pages/login";
import StudentDashboard from "@/pages/dashboard/student";
import StaffDashboard from "@/pages/dashboard/staff";
import ManagementDashboard from "@/pages/dashboard/management";
import AdminDashboard from "@/pages/dashboard/admin";
import NotFound from "@/pages/not-found";

function Router() {
  const { user } = useAuth();

  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/login/:userType" component={LoginPage} />
      
      {user && (
        <>
          {user.role === "student" && <Route path="/dashboard" component={StudentDashboard} />}
          {user.role === "staff" && <Route path="/dashboard" component={StaffDashboard} />}
          {user.role === "management" && <Route path="/dashboard" component={ManagementDashboard} />}
          {user.role === "admin" && <Route path="/dashboard" component={AdminDashboard} />}
        </>
      )}
      
      <Route component={NotFound} />
    </Switch>
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
