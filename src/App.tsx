import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/Header";
import { DashboardPage } from "@/pages/DashboardPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <BrowserRouter basename="/boss-tracking">
      <div className="min-h-screen bg-background text-foreground">
        {/* Subtle gradient background */}
        <div className="fixed inset-0 -z-10 bg-linear-to-br from-background via-background to-red-950/10" />

        <Header />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
        <Toaster richColors position="bottom-right" />
      </div>
    </BrowserRouter>
  );
}

export default App;
