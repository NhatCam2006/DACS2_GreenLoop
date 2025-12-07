import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { ChatBot } from "./components/ui/ChatBot";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { HowItWorksPage } from "./pages/HowItWorksPage";
import { useAuthStore } from "./stores/auth.store";
import { useThemeStore } from "./stores/theme.store";

// Donor Pages
import { DonorDashboard } from "./pages/donor/DonorDashboard";
import { NewDonationPage } from "./pages/donor/NewDonationPage";
import { DonationHistoryPage } from "./pages/donor/DonationHistoryPage";
import { RewardsPage } from "./pages/donor/RewardsPage";
import { WalletPage } from "./pages/donor/WalletPage";

// Shared Pages
import { ProfilePage } from "./pages/shared/ProfilePage";

// Collector Pages
import { CollectorDashboard } from "./pages/collector/CollectorDashboard";
import { AvailableRequestsPage } from "./pages/collector/AvailableRequestsPage";
import { CompleteCollectionPage } from "./pages/collector/CompleteCollectionPage";
import { MyCollectionsPage } from "./pages/collector/MyCollectionsPage";

// Admin Pages
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { UserManagementPage } from "./pages/admin/UserManagementPage";
import { CategoryManagementPage } from "./pages/admin/CategoryManagementPage";
import { RewardManagementPage } from "./pages/admin/RewardManagementPage";
import { DonationsOverviewPage } from "./pages/admin/DonationsOverviewPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  const { resolvedTheme } = useThemeStore();

  // Apply theme on mount and when theme changes
  useEffect(() => {
    const root = document.documentElement;
    if (resolvedTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [resolvedTheme]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
          <Header />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Donor Routes */}
              <Route
                path="/donor/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["DONOR"]}>
                    <DonorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/donor/new-donation"
                element={
                  <ProtectedRoute allowedRoles={["DONOR"]}>
                    <NewDonationPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/donor/history"
                element={
                  <ProtectedRoute allowedRoles={["DONOR"]}>
                    <DonationHistoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/donor/rewards"
                element={
                  <ProtectedRoute allowedRoles={["DONOR"]}>
                    <RewardsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/donor/wallet"
                element={
                  <ProtectedRoute allowedRoles={["DONOR"]}>
                    <WalletPage />
                  </ProtectedRoute>
                }
              />

              {/* Profile Route (all authenticated users) */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Collector Routes */}
              <Route
                path="/collector/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["COLLECTOR"]}>
                    <CollectorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/collector/available"
                element={
                  <ProtectedRoute allowedRoles={["COLLECTOR"]}>
                    <AvailableRequestsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/collector/my-collections"
                element={
                  <ProtectedRoute allowedRoles={["COLLECTOR"]}>
                    <MyCollectionsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/collector/collection/:id"
                element={
                  <ProtectedRoute allowedRoles={["COLLECTOR"]}>
                    <CompleteCollectionPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/collector/request/:id"
                element={
                  <ProtectedRoute allowedRoles={["COLLECTOR"]}>
                    <AvailableRequestsPage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN"]}>
                    <UserManagementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/categories"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN"]}>
                    <CategoryManagementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/rewards"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN"]}>
                    <RewardManagementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/donations"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN"]}>
                    <DonationsOverviewPage />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <ChatBot />
        </div>
      </BrowserRouter>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
