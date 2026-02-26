import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import History from "./pages/History";
import Insights from "./pages/Insights";
import NotFound from "./pages/NotFound";
import BottomNav from "./components/BottomNav";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/history" element={<History />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
        <BottomNav />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
