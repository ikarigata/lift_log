import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { ja } from "date-fns/locale";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useWorkoutStore } from "@/store/workoutStore";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { 
  CompleteWorkoutDay, 
  WorkoutRecordRequest,
  WorkoutSetRequest
} from "@/types";
import { 
  AddWorkoutRecord, 
  WorkoutRecordCard 
} from "@/components/features/WorkoutRecordComponents";

const WorkoutDayPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuthStore();
  const { exercises, fetchExercises } = useWorkoutStore();
  
  const [workoutDay, setWorkoutDay] = useState<CompleteWorkoutDay | null>(null);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // ワークアウト詳細の取得
  useEffect(() => {
    if (!user) return;
    
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // トレーニング種目の取得
        await fetchExercises();
        
        // IDがある場合は既存のワークアウトを取得
        if (id) {
          try {
            const data = await api.workoutDays.getComplete(id);
            setWorkoutDay(data);
            setTitle(data.title || "");
            setNotes(data.notes || "");
          } catch (error) {
            console.error("ワークアウトの取得に失敗しました:", error);
            toast({
              title: "エラー",
              description: "ワークアウトの取得に失敗しました",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error("データの読み込みに失敗しました:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [id, user, fetchExercises, toast]);

  // ワークアウトの保存
  const saveWorkoutDay = async () => {
    if (!workoutDay) return;
    
    try {
      setIsSaving(true);
      await api.workoutDays.update(workoutDay.id, {
        userId: workoutDay.userId,
        date: workoutDay.date,
        title,
        notes,
      });
      
      toast({
        title: "保存しました",
        description: "ワークアウトが正常に保存されました",
      });
      
      // 最新の状態を反映
      const updatedWorkout = await api.workoutDays.getComplete(workoutDay.id);
      setWorkoutDay(updatedWorkout);
    } catch (error) {
      console.error("保存に失敗しました:", error);
      toast({
        title: "エラー",
        description: "ワークアウトの保存に失敗しました",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ワークアウトの削除
  const deleteWorkoutDay = async () => {
    if (!workoutDay || !confirm("このワークアウトを削除してもよろしいですか？")) return;
    
    try {
      await api.workoutDays.delete(workoutDay.id);
      toast({
        title: "削除しました",
        description: "ワークアウトが正常に削除されました",
      });
      navigate("/");
    } catch (error) {
      console.error("削除に失敗しました:", error);
      toast({
        title: "エラー",
        description: "ワークアウトの削除に失敗しました",
        variant: "destructive",
      });
    }
  };

  // トレーニング記録の追加
  const handleAddRecord = async (workoutDayId: string, record: WorkoutRecordRequest) => {
    try {
      const newRecord = await api.workoutRecords.create(workoutDayId, record);
      
      // 新しいレコードを含むワークアウトデータを取得して更新
      const updatedWorkout = await api.workoutDays.getComplete(workoutDayId);
      setWorkoutDay(updatedWorkout);
      
      toast({
        title: "追加しました",
        description: "トレーニングが正常に追加されました",
      });
      
      return newRecord;
    } catch (error) {
      console.error("トレーニングの追加に失敗しました:", error);
      toast({
        title: "エラー",
        description: "トレーニングの追加に失敗しました",
        variant: "destructive",
      });
      throw error;
    }
  };

  // トレーニング記録の削除
  const handleDeleteRecord = async (recordId: string) => {
    if (!confirm("このトレーニングを削除してもよろしいですか？")) return;
    
    try {
      await api.workoutRecords.delete(recordId);
      
      // ワークアウトデータを更新
      if (workoutDay) {
        const updatedWorkout = await api.workoutDays.getComplete(workoutDay.id);
        setWorkoutDay(updatedWorkout);
      }
      
      toast({
        title: "削除しました",
        description: "トレーニングが正常に削除されました",
      });
    } catch (error) {
      console.error("トレーニングの削除に失敗しました:", error);
      toast({
        title: "エラー",
        description: "トレーニングの削除に失敗しました",
        variant: "destructive",
      });
    }
  };

  // セットの追加
  const handleAddSet = async (workoutRecordId: string, set: WorkoutSetRequest) => {
    try {
      await api.workoutSets.create(workoutRecordId, set);
      
      // ワークアウトデータを更新
      if (workoutDay) {
        const updatedWorkout = await api.workoutDays.getComplete(workoutDay.id);
        setWorkoutDay(updatedWorkout);
      }
      
      toast({
        title: "追加しました",
        description: "セットが正常に追加されました",
      });
    } catch (error) {
      console.error("セットの追加に失敗しました:", error);
      toast({
        title: "エラー",
        description: "セットの追加に失敗しました",
        variant: "destructive",
      });
    }
  };

  // セットの削除
  const handleDeleteSet = async (setId: string) => {
    try {
      await api.workoutSets.delete(setId);
      
      // ワークアウトデータを更新
      if (workoutDay) {
        const updatedWorkout = await api.workoutDays.getComplete(workoutDay.id);
        setWorkoutDay(updatedWorkout);
      }
      
      toast({
        title: "削除しました",
        description: "セットが正常に削除されました",
      });
    } catch (error) {
      console.error("セットの削除に失敗しました:", error);
      toast({
        title: "エラー",
        description: "セットの削除に失敗しました",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-8">読み込み中...</div>;
  }

  if (!workoutDay && id) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <h1 className="text-2xl font-bold mb-4">ワークアウトが見つかりません</h1>
        <Button onClick={() => navigate("/")}>ホームに戻る</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          className="p-0" 
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          戻る
        </Button>
        <div className="flex space-x-2">
          {workoutDay && (
            <>
              <Button 
                variant="outline" 
                size="icon"
                onClick={deleteWorkoutDay}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button 
                onClick={saveWorkoutDay}
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-2" />
                保存
              </Button>
            </>
          )}
        </div>
      </div>

      {/* ワークアウト情報 */}
      {workoutDay && (
        <Card>
          <CardHeader>
            <CardTitle>ワークアウト詳細</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">日付</label>
                <div className="text-muted-foreground">
                  {format(parseISO(workoutDay.date), "yyyy年M月d日(E)", { locale: ja })}
                </div>
              </div>
              <div>
                <label htmlFor="title" className="text-sm font-medium block mb-1">
                  タイトル
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ワークアウトのタイトル"
                />
              </div>
              <div>
                <label htmlFor="notes" className="text-sm font-medium block mb-1">
                  メモ
                </label>
                <Input
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="メモ（オプション）"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* トレーニング記録一覧 */}
      {workoutDay && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">トレーニング記録</h2>
          
          {workoutDay.workoutRecords.length > 0 ? (
            <div className="space-y-4">
              {workoutDay.workoutRecords.map((record) => (
                <WorkoutRecordCard
                  key={record.id}
                  record={record}
                  exercises={exercises}
                  onAddSet={handleAddSet}
                  onDeleteSet={handleDeleteSet}
                  onDeleteRecord={handleDeleteRecord}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-6">
                <p className="text-center text-muted-foreground">
                  トレーニング記録がありません。新しいトレーニングを追加してください。
                </p>
              </CardContent>
            </Card>
          )}
          
          {/* トレーニング記録追加フォーム */}
          <AddWorkoutRecord
            workoutDayId={workoutDay.id}
            exercises={exercises}
            onAddRecord={handleAddRecord}
          />
        </div>
      )}
    </div>
  );
};

export default WorkoutDayPage;