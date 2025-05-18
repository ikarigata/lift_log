import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format, parseISO, subMonths } from "date-fns";
import { ja } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkoutDay } from "@/types";
import { formatDateToYYYYMMDD } from "@/lib/utils";

const WorkoutHistoryPage = () => {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [workouts, setWorkouts] = useState<WorkoutDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("recent");

  useEffect(() => {
    if (!user) return;

    const fetchWorkouts = async () => {
      try {
        setIsLoading(true);
        
        let params = {};
        
        // タブに応じてフィルター条件を設定
        if (activeTab === "recent") {
          // 最近1ヶ月のワークアウト
          const oneMonthAgo = formatDateToYYYYMMDD(subMonths(new Date(), 1));
          const today = formatDateToYYYYMMDD(new Date());
          params = {
            userId: user.id,
            fromDate: oneMonthAgo,
            toDate: today,
          };
        } else if (activeTab === "all") {
          // すべてのワークアウト
          params = { userId: user.id };
        }
        
        const data = await api.workoutDays.getAll(params);
        setWorkouts(data);
      } catch (error) {
        console.error("ワークアウト履歴の取得に失敗しました:", error);
        toast({
          title: "エラー",
          description: "ワークアウト履歴の取得に失敗しました",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkouts();
  }, [user, activeTab, toast]);

  // 日付ごとにワークアウトをグループ化
  const groupedWorkouts = workouts.reduce<Record<string, WorkoutDay[]>>(
    (groups, workout) => {
      const date = workout.date.split("T")[0]; // ISO日付から日付部分のみ取得
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(workout);
      return groups;
    },
    {}
  );

  // 日付で降順ソートしたキーの配列
  const sortedDates = Object.keys(groupedWorkouts).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">トレーニング履歴</h1>
      </div>

      <Tabs
        defaultValue="recent"
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recent">最近のトレーニング</TabsTrigger>
          <TabsTrigger value="all">すべて</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="mt-4">
          {renderWorkoutList()}
        </TabsContent>

        <TabsContent value="all" className="mt-4">
          {renderWorkoutList()}
        </TabsContent>
      </Tabs>
    </div>
  );

  function renderWorkoutList() {
    if (isLoading) {
      return <div className="py-8 text-center">読み込み中...</div>;
    }

    if (workouts.length === 0) {
      return (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-4">
              トレーニング記録がありません
            </p>
            <Button asChild>
              <Link to="/workout">新しいトレーニングを開始</Link>
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        {sortedDates.map((date) => (
          <div key={date} className="space-y-3">
            <h3 className="font-medium flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2 text-primary" />
              {format(parseISO(date), "yyyy年M月d日(E)", { locale: ja })}
            </h3>
            <div className="space-y-3">
              {groupedWorkouts[date].map((workout) => (
                <Card key={workout.id}>
                  <CardContent className="py-4">
                    <h4 className="font-semibold text-lg mb-1">
                      {workout.title || "無題のトレーニング"}
                    </h4>
                    {workout.notes && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {workout.notes}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/workout/${workout.id}`}>詳細を見る</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
};

export default WorkoutHistoryPage;