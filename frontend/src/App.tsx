import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/layout/Layout";

// ページのインポート
import { Dashboard } from "@/pages/DashBoard";
import WorkoutDayPage from "@/pages/WorkoutDayPage";
import WorkoutHistoryPage from "@/pages/WorkoutHistoryPage";
import ExercisesPage from "@/pages/ExercisesPage";
import ProfilePage from "@/pages/ProfilePage";
import NotFoundPage from "@/pages/NotFoundPage";

export const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
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
