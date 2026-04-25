 
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
            <Route 
              path="/dashboard" 
              element={ 
                <ProtectedRoute> 
                  <Dashboard /> 
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