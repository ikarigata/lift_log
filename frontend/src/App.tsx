import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/layout/Layout";
import { useAuthStore } from "@/store/authStore";

// ページのインポート
import { Dashboard } from "@/pages/DashBoard";
import WorkoutDayPage from "@/pages/WorkoutDayPage";
import WorkoutHistoryPage from "@/pages/WorkoutHistoryPage";
import ExercisesPage from "@/pages/ExercisesPage";
import ProfilePage from "@/pages/ProfilePage";
import NotFoundPage from "@/pages/NotFoundPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";

// 認証が必要なルートを保護するコンポーネント
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

export const App = () => {
  return (
    <>
      <Routes>
        {/* 認証不要のルート */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* 認証が必要なルート */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="workout/:id?" element={<WorkoutDayPage />} />
          <Route path="history" element={<WorkoutHistoryPage />} />
          <Route path="exercises" element={<ExercisesPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}
