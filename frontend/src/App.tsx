import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import MeetingHistory from "./pages/MeetingHistory";
import Analytics from "./pages/Analytics";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Landing page gets its own specific layout (Navbar + Footer handled inside or around it) */}
          {/* We'll use DashboardLayout to wrap all pages, including LandingPage to ensure consistent Navbar. */}
          <Route path="/" element={<DashboardLayout><LandingPage /></DashboardLayout>} />
          
          <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
          <Route path="/dashboard/:meetingId" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
          <Route path="/history" element={<DashboardLayout><MeetingHistory /></DashboardLayout>} />
          <Route path="/analytics" element={<DashboardLayout><Analytics /></DashboardLayout>} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
