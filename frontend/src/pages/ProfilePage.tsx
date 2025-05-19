import React, { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { useAuthStore } from "@/store/authStore";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Moon, Sun, LogOut, Save } from "lucide-react";

const ProfilePage = () => {
  const { user, login, logout } = useAuthStore();
  const { toast } = useToast();
  
  const [name, setName] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 初期データの設定
  useEffect(() => {
    if (user) {
      setName(user.name);
    }
    
    // ダークモードの設定を読み込み
    const isDarkMode = localStorage.getItem("darkMode") !== "false";
    setDarkMode(isDarkMode);
    
    // ダークモードの適用
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [user]);

  // ユーザー情報の保存
  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      
      // APIを使用してユーザー情報を更新
      await api.users.update(user.id, { name });
      
      setIsEditing(false);
      
      // ストアのユーザー情報を更新するためにログインし直す
      await login(user.id);
      
      toast({
        title: "プロフィールを保存しました",
        description: "ユーザー情報が更新されました",
      });
    } catch (error) {
      console.error("プロフィールの保存に失敗しました:", error);
      toast({
        title: "エラー",
        description: "プロフィールの保存に失敗しました",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ダークモードの切り替え
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    // ローカルストレージに保存
    localStorage.setItem("darkMode", String(newDarkMode));
    
    // ダークモードの適用
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    toast({
      title: newDarkMode ? "ダークモードに切り替えました" : "ライトモードに切り替えました",
    });
  };

  if (!user) {
    return <div className="flex justify-center py-8">読み込み中...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">プロフィール</h1>
      </div>

      {/* ユーザー情報 */}
      <Card>
        <CardHeader>
          <CardTitle>ユーザー情報</CardTitle>
          <CardDescription>
            あなたのプロフィール情報を管理します
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              {isEditing ? (
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="max-w-xs"
                />
              ) : (
                <h3 className="text-lg font-medium">{user.name}</h3>
              )}
              <p className="text-sm text-muted-foreground">
                登録日: {format(parseISO(user.createdAt), "yyyy年M月d日")}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {isEditing ? (
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditing(false);
                  setName(user.name);
                }}
              >
                キャンセル
              </Button>
              <Button onClick={handleSaveProfile} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                保存
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              編集
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* アプリ設定 */}
      <Card>
        <CardHeader>
          <CardTitle>アプリ設定</CardTitle>
          <CardDescription>
            アプリの表示設定を変更します
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {darkMode ? (
                <Moon className="h-5 w-5 text-primary" />
              ) : (
                <Sun className="h-5 w-5 text-primary" />
              )}
              <span className="font-medium">
                {darkMode ? "ダークモード" : "ライトモード"}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={toggleDarkMode}>
              切り替え
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* アカウント管理 */}
      <Card>
        <CardHeader>
          <CardTitle>アカウント管理</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            className="w-full text-destructive border-destructive/50 hover:bg-destructive/10"
            onClick={logout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            ログアウト
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;