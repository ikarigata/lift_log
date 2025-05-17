import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format, parseISO, subDays } from "date-fns";
import { ja } from "date-fns/locale";
import { useAuthStore } from "@/store/authStore";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Calendar, TrendingUp, Activity } from "lucide-react";
import { WorkoutDay, VolumeByMuscleGroupItem } from "@/types";
import { formatDateToYYYYMMDD } from "@/lib/utils";

export const Dashboard = () => {
  const { user } = useAuthStore();
  const [recentWorkouts, setRecentWorkouts] = useState<WorkoutDay[]>([]);
  const [volumeStats, setVolumeStats] = useState<VolumeByMuscleGroupItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // ユーザーが認証されている場合、データを取得
    if (user) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          // 過去30日間のワークアウトを取得
          const thirtyDaysAgo = formatDateToYYYYMMDD(subDays(new Date(), 30));
          const today = formatDateToYYYYMMDD(new Date());
          
          const params = {
            userId: user.id,
            fromDate: thirtyDaysAgo,
            toDate: today,
          };
          
          const workouts = await api.workoutDays.getAll(params);
          setRecentWorkouts(workouts);
          
          // ボリューム統計を取得（APIが利用可能な場合）
          try {
            const volumeData = await api.statistics.getVolumeByMuscleGroup(user.id);
            setVolumeStats(volumeData.volumeByMuscleGroup || []);
          } catch (error) {
            console.error("統計データの取得に失敗しました:", error);
            // エラー時は空の配列をセット
            setVolumeStats([]);
          }
        } catch (error) {
          console.error("ダッシュボードデータの取得に失敗しました:", error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchData();
    }
  }, [user]);

  // 今日の日付を作成するヘルパー関数
  const createTodayWorkout = async () => {
    if (!user) return;
    
    try {
      const today = formatDateToYYYYMMDD(new Date());
      const newWorkout = await api.workoutDays.create({
        userId: user.id,
        date: today,
        title: `${format(new Date(), "M月d日", { locale: ja })}のトレーニング`,
      });
      
      // 作成したワークアウトの詳細ページに移動
      window.location.href = `/workout/${newWorkout.id}`;
    } catch (error) {
      console.error("今日のワークアウト作成に失敗しました:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          ダッシュボード
        </h1>
      </div>

      {/* クイックアクション */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">今日のトレーニング</CardTitle>
            <Dumbbell className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={createTodayWorkout}
              disabled={isLoading}
            >
              <Calendar className="mr-2 h-4 w-4" />
              今日のトレーニングを開始
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">統計</CardTitle>
            <TrendingUp className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              variant="outline" 
              asChild
            >
              <Link to="/history">
                <Activity className="mr-2 h-4 w-4" />
                トレーニング記録を見る
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 最近のワークアウト */}
      <div>
        <h2 className="text-xl font-semibold mb-4">最近のトレーニング</h2>
        {isLoading ? (
          <p>読み込み中...</p>
        ) : recentWorkouts.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {recentWorkouts.slice(0, 4).map((workout) => (
              <Card key={workout.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">
                    {workout.title || format(parseISO(workout.date), "M月d日(E)", { locale: ja })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {format(parseISO(workout.date), "yyyy年M月d日(E)", { locale: ja })}
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to={`/workout/${workout.id}`}>
                      詳細を見る
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-6">
              <p className="text-center text-muted-foreground">
                最近のトレーニング記録がありません。
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 部位別ボリューム統計 */}
      {volumeStats.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">部位別ボリューム</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                {volumeStats
                  .sort((a, b) => b.totalVolume - a.totalVolume)
                  .slice(0, 5)
                  .map((stat) => (
                    <div key={stat.muscleGroupId} className="flex items-center justify-between">
                      <span className="font-medium">{stat.muscleGroupName}</span>
                      <span className="text-muted-foreground">
                        {stat.totalVolume.toLocaleString()} kg
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
