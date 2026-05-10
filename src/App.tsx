 
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Dashboard from "./pages/Dashboard.tsx";
import Index from "./pages/Index.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import NutritionistSearch from "./pages/NutritionistSearch.tsx";
import PatientProfile from "./pages/PatientProfile.tsx";
import PatientSearch from "./pages/PatientSearch.tsx";
import PatientDashboard from "./pages/PatientDashboard.tsx";
import PlanCreator from "./pages/PlanCreator.tsx";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}> 
    <TooltipProvider> 
      <Toaster /> 
      <Sonner /> 
      <AuthProvider> 
        <BrowserRouter> 
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/nutritionists" element={<NutritionistSearch />} />
            <Route
              path="/patients"
              element={
                <ProtectedRoute>
                  <PatientSearch />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patients/:patientId"
              element={
                <ProtectedRoute>
                  <PatientProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/dashboard"
              element={
                <ProtectedRoute>
                  <PatientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/nutritionist/plan/create"
              element={
                <ProtectedRoute>
                  <PlanCreator />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter> 
      </AuthProvider> 
    </TooltipProvider> 
  </QueryClientProvider> 
); 
  
export default App;