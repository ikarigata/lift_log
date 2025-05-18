import { Outlet } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Dumbbell,
  Calendar,
  BarChart3,
  ListChecks,
  User,
} from "lucide-react";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 現在のパスから選択中のタブを決定
  const getCurrentTab = () => {
    const path = location.pathname;
    if (path.startsWith("/workout")) return "workout";
    if (path.startsWith("/history")) return "history"; 
    if (path.startsWith("/exercises")) return "exercises";
    if (path.startsWith("/profile")) return "profile";
    return "dashboard";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* メインコンテンツ */}
      <main className="flex-1 container max-w-5xl mx-auto p-4 pb-20">
        <Outlet />
      </main>
      
      {/* フッターのタブナビゲーション */}
      <footer className="fixed bottom-0 left-0 right-0 border-t bg-background z-10">
        <div className="container max-w-5xl mx-auto px-4">
          <Tabs 
            value={getCurrentTab()} 
            className="w-full"
            onValueChange={(value) => {
              const routes: Record<string, string> = {
                dashboard: "/",
                workout: "/workout",
                history: "/history",
                exercises: "/exercises",
                profile: "/profile",
              };
              navigate(routes[value]);
            }}
          >
            <TabsList className="w-full h-16 grid grid-cols-5 bg-transparent">
              <TabsTrigger value="dashboard" className="flex flex-col gap-1 data-[state=active]:text-primary">
                <Dumbbell size={20} />
                <span className="text-xs">ホーム</span>
              </TabsTrigger>
              <TabsTrigger value="workout" className="flex flex-col gap-1 data-[state=active]:text-primary">
                <Calendar size={20} />
                <span className="text-xs">記録</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex flex-col gap-1 data-[state=active]:text-primary">
                <BarChart3 size={20} />
                <span className="text-xs">履歴</span>
              </TabsTrigger>
              <TabsTrigger value="exercises" className="flex flex-col gap-1 data-[state=active]:text-primary">
                <ListChecks size={20} />
                <span className="text-xs">種目</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex flex-col gap-1 data-[state=active]:text-primary">
                <User size={20} />
                <span className="text-xs">設定</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </footer>
    </div>
  );
};

export default Layout;