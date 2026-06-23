import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import AppLayout from "@/components/AppLayout";
import Landing from "@/pages/Landing";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Funnel from "@/pages/Funnel";
import Retention from "@/pages/Retention";
import Features from "@/pages/Features";
import Experiments from "@/pages/Experiments";
import Upload from "@/pages/Upload";
import Insights from "@/pages/Insights";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/funnel" element={<Funnel />} />
          <Route path="/retention" element={<Retention />} />
          <Route path="/features" element={<Features />} />
          <Route path="/experiments" element={<Experiments />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/insights" element={<Insights />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}
