import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CompanyFolder from "./pages/CompanyFolder";
import NotFound from "./pages/NotFound";
import PricingPage from "./pages/PricingPage";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import SubscriptionGuard from "./components/SubscriptionGuard";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import SplashScreen from "./components/ui/SplashScreen";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 5500); // 5.5 segundos para apreciar a animação
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AnimatePresence>
          {showSplash && <SplashScreen key="splash" />}
        </AnimatePresence>

        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Rota pública: questionário (sem necessidade de assinatura) */}
            <Route path="/" element={<Index />} />

            {/* Dashboard protegido */}
            <Route path="/dashboard" element={
              <SubscriptionGuard>
                <Dashboard />
              </SubscriptionGuard>
            } />

            {/* Pasta de empresa protegida */}
            <Route path="/empresa/:id" element={
              <SubscriptionGuard>
                <CompanyFolder />
              </SubscriptionGuard>
            } />

            {/* Rotas de autenticação */}
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Rotas públicas de assinatura */}
            <Route path="/planos" element={<PricingPage />} />
            <Route path="/assinatura/sucesso" element={<SubscriptionSuccess />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
