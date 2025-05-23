import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useWorkoutStore } from "@/store/workoutStore";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, Plus, Edit, Trash2, Save, Check, X } from "lucide-react";
import { Exercise, MuscleGroup, ExerciseRequest } from "@/types";

const ExercisesPage = () => {
  const { exercises, muscleGroups, fetchExercises, fetchMuscleGroups } = useWorkoutStore();
  const { toast } = useToast();
  
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("");
  
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState("");
  const [newExerciseDescription, setNewExerciseDescription] = useState("");
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([]);
  const [primaryMuscleGroup, setPrimaryMuscleGroup] = useState<string>("");
  
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  // データ取得
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchExercises();
        await fetchMuscleGroups();
      } catch (error) {
        console.error("データの取得に失敗しました:", error);
        toast({
          title: "エラー",
          description: "データの取得に失敗しました",
          variant: "destructive",
        });
      }
    };

    loadData();
  }, [fetchExercises, fetchMuscleGroups, toast]);

  // フィルタリング
  useEffect(() => {
    let filtered = [...exercises];
    
    // 検索クエリでフィルタリング
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (exercise) => 
          exercise.name.toLowerCase().includes(query) ||
          exercise.description?.toLowerCase()?.includes(query)
      );
    }
    
    // 筋肉グループでフィルタリング
    if (selectedMuscleGroup) {
      filtered = filtered.filter((exercise) => 
        exercise.muscleGroups?.some(
          (mg) => mg.muscleGroupId === selectedMuscleGroup
        )
      );
    }
    
    // 名前で並べ替え
    filtered.sort((a, b) => a.name.localeCompare(b.name));
    
    setFilteredExercises(filtered);
  }, [exercises, searchQuery, selectedMuscleGroup]);

  // 新しいトレーニング種目の追加
  const handleAddExercise = async () => {
    if (!newExerciseName.trim()) return;
    
    try {
      // 種目の作成リクエストデータ
      const exerciseData: ExerciseRequest = {
        name: newExerciseName.trim(),
        description: newExerciseDescription.trim() || undefined,
      };
      
      // トレーニング種目の作成
      const newExercise = await api.exercises.create(exerciseData);
      
      // 選択された筋肉グループを関連付け
      for (const muscleGroupId of selectedMuscleGroups) {
        await api.exercises.addMuscleGroup(newExercise.id, {
          muscleGroupId,
          isPrimary: muscleGroupId === primaryMuscleGroup,
        });
      }
      
      // 種目一覧を更新
      await fetchExercises();
      
      // フォームをリセット
      setIsAddingExercise(false);
      setNewExerciseName("");
      setNewExerciseDescription("");
      setSelectedMuscleGroups([]);
      setPrimaryMuscleGroup("");
      
      toast({
        title: "追加しました",
        description: "トレーニング種目が正常に追加されました",
      });
    } catch (error) {
      console.error("トレーニング種目の追加に失敗しました:", error);
      toast({
        title: "エラー",
        description: "トレーニング種目の追加に失敗しました",
        variant: "destructive",
      });
    }
  };

  // トレーニング種目の削除
  const handleDeleteExercise = async (exerciseId: string) => {
    if (!confirm("このトレーニング種目を削除してもよろしいですか？")) return;
    
    try {
      await api.exercises.delete(exerciseId);
      await fetchExercises();
      
      toast({
        title: "削除しました",
        description: "トレーニング種目が正常に削除されました",
      });
    } catch (error) {
      console.error("トレーニング種目の削除に失敗しました:", error);
      toast({
        title: "エラー",
        description: "トレーニング種目の削除に失敗しました",
        variant: "destructive",
      });
    }
  };

  // トレーニング種目の編集開始
  const startEditingExercise = (exercise: Exercise) => {
    setEditingExercise(exercise);
    // 関連付けられた筋肉グループのIDリストを作成
    const muscleGroupIds = exercise.muscleGroups?.map(mg => mg.muscleGroupId) || [];
    setSelectedMuscleGroups(muscleGroupIds);
    
    // プライマリの筋肉グループを設定
    const primary = exercise.muscleGroups?.find(mg => mg.isPrimary);
    setPrimaryMuscleGroup(primary?.muscleGroupId || "");
  };

  // トレーニング種目の編集保存
  const saveEditingExercise = async () => {
    if (!editingExercise) return;
    
    try {
      // 更新する種目のデータを作成
      const exerciseUpdateData: ExerciseRequest = {
        name: editingExercise.name,
        description: editingExercise.description || undefined,
        muscleGroups: selectedMuscleGroups.map(mgId => ({
          muscleGroupId: mgId,
          isPrimary: mgId === primaryMuscleGroup,
        })),
      };
      
      // 種目の更新
      await api.exercises.update(editingExercise.id, exerciseUpdateData);
      
      // 種目一覧を更新
      await fetchExercises();
      
      // 編集モードを終了
      setEditingExercise(null);
      setSelectedMuscleGroups([]);
      setPrimaryMuscleGroup("");
      
      toast({
        title: "更新しました",
        description: "トレーニング種目が正常に更新されました",
      });
    } catch (error) {
      console.error("トレーニング種目の更新に失敗しました:", error);
      toast({
        title: "エラー",
        description: "トレーニング種目の更新に失敗しました",
        variant: "destructive",
      });
    }
  };

  // 新規追加フォームのリセット
  const resetAddForm = () => {
    setIsAddingExercise(false);
    setNewExerciseName("");
    setNewExerciseDescription("");
    setSelectedMuscleGroups([]);
    setPrimaryMuscleGroup("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          トレーニング種目
        </h1>
        <Button onClick={() => setIsAddingExercise(true)} disabled={isAddingExercise}>
          <Plus className="h-4 w-4 mr-2" />
          新規追加
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="all">すべての種目</TabsTrigger>
          <TabsTrigger value="muscle-groups">部位別</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4 space-y-4">
          {/* 検索フィルター */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="トレーニング種目を検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* 新規追加フォーム */}
          {isAddingExercise && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">新しいトレーニング種目を追加</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">名前</label>
                    <Input
                      value={newExerciseName}
                      onChange={(e) => setNewExerciseName(e.target.value)}
                      placeholder="トレーニング種目名"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">説明</label>
                    <Input
                      value={newExerciseDescription}
                      onChange={(e) => setNewExerciseDescription(e.target.value)}
                      placeholder="説明（オプション）"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">対象部位</label>
                    <Select
                      onValueChange={(value) => {
                        setSelectedMuscleGroups([...selectedMuscleGroups, value]);
                        // 初回選択時はプライマリにする
                        if (selectedMuscleGroups.length === 0) {
                          setPrimaryMuscleGroup(value);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="部位を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {muscleGroups
                          .filter(mg => !selectedMuscleGroups.includes(mg.id))
                          .map((muscleGroup) => (
                            <SelectItem key={muscleGroup.id} value={muscleGroup.id}>
                              {muscleGroup.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    
                    {/* 選択された部位一覧 */}
                    {selectedMuscleGroups.length > 0 && (
                      <div className="mt-2 space-y-2">
                        <label className="text-sm font-medium">選択された部位</label>
                        <div className="space-y-2">
                          {selectedMuscleGroups.map((mgId) => {
                            const mg = muscleGroups.find(m => m.id === mgId);
                            if (!mg) return null;
                            
                            return (
                              <div key={mgId} className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <input
                                    type="radio"
                                    name="primaryMuscle"
                                    checked={primaryMuscleGroup === mgId}
                                    onChange={() => setPrimaryMuscleGroup(mgId)}
                                    className="mr-2"
                                  />
                                  <span>{mg.name}</span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => {
                                    setSelectedMuscleGroups(
                                      selectedMuscleGroups.filter(id => id !== mgId)
                                    );
                                    if (primaryMuscleGroup === mgId) {
                                      setPrimaryMuscleGroup(selectedMuscleGroups[0] || "");
                                    }
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2 justify-end">
                    <Button variant="outline" onClick={resetAddForm}>
                      キャンセル
                    </Button>
                    <Button 
                      onClick={handleAddExercise}
                      disabled={!newExerciseName.trim() || selectedMuscleGroups.length === 0}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      保存
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* トレーニング種目一覧 */}
          <div className="space-y-3">
            {filteredExercises.length > 0 ? (
              filteredExercises.map((exercise) => (
                <Card key={exercise.id}>
                  <CardContent className="p-4">
                    {editingExercise?.id === exercise.id ? (
                      // 編集モード
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium">名前</label>
                          <Input
                            value={editingExercise.name}
                            onChange={(e) => 
                              setEditingExercise({
                                ...editingExercise,
                                name: e.target.value
                              })
                            }
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">説明</label>
                          <Input
                            value={editingExercise.description || ""}
                            onChange={(e) => 
                              setEditingExercise({
                                ...editingExercise,
                                description: e.target.value
                              })
                            }
                            className="mt-1"
                          />
                        </div>
                        <div className="flex space-x-2 justify-end">
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingExercise(null)}
                          >
                            <X className="h-4 w-4 mr-2" />
                            キャンセル
                          </Button>
                          <Button 
                            size="sm"
                            onClick={saveEditingExercise}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            保存
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // 表示モード
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg">{exercise.name}</h3>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => startEditingExercise(exercise)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => handleDeleteExercise(exercise.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {exercise.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {exercise.description}
                          </p>
                        )}
                        
                        {exercise.muscleGroups && exercise.muscleGroups.length > 0 && (
                          <div className="mt-2">
                            <div className="flex flex-wrap gap-2 mt-2">
                              {exercise.muscleGroups.map((mg) => {
                                const muscleGroup = muscleGroups.find(
                                  (m) => m.id === mg.muscleGroupId
                                );
                                if (!muscleGroup) return null;
                                
                                return (
                                  <span
                                    key={mg.id}
                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                                      mg.isPrimary
                                        ? "bg-primary/10 text-primary-foreground font-medium"
                                        : "bg-muted text-muted-foreground"
                                    }`}
                                  >
                                    {muscleGroup.name}
                                    {mg.isPrimary && " (主)"}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-6 text-center">
                  <p className="text-muted-foreground">
                    {searchQuery
                      ? "検索条件に一致するトレーニング種目が見つかりません"
                      : "トレーニング種目がありません"}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="muscle-groups" className="mt-4 space-y-4">
          {/* 部位フィルター */}
          <Select
            value={selectedMuscleGroup}
            onValueChange={setSelectedMuscleGroup}
          >
            <SelectTrigger>
              <SelectValue placeholder="部位を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">すべての部位</SelectItem>
              {muscleGroups.map((muscleGroup) => (
                <SelectItem key={muscleGroup.id} value={muscleGroup.id}>
                  {muscleGroup.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* 部位別トレーニング種目一覧 */}
          <div className="space-y-6">
            {selectedMuscleGroup ? (
              // 特定の部位が選択されている場合
              <div className="space-y-3">
                <h2 className="text-lg font-semibold">
                  {muscleGroups.find(mg => mg.id === selectedMuscleGroup)?.name || ""}
                </h2>
                
                {filteredExercises.length > 0 ? (
                  <div className="space-y-3">
                    {filteredExercises.map((exercise) => (
                      <Card key={exercise.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{exercise.name}</h3>
                            <div>
                              {exercise.muscleGroups?.find(
                                mg => mg.muscleGroupId === selectedMuscleGroup
                              )?.isPrimary && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary-foreground font-medium">
                                  主要
                                </span>
                              )}
                            </div>
                          </div>
                          {exercise.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {exercise.description}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-6 text-center">
                      <p className="text-muted-foreground">
                        この部位に関連するトレーニング種目がありません
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              // 部位が選択されていない場合、全部位のリストを表示
              muscleGroups.map((muscleGroup) => {
                const relatedExercises = exercises.filter(
                  exercise => 
                    exercise.muscleGroups?.some(
                      mg => mg.muscleGroupId === muscleGroup.id
                    )
                );
                
                if (relatedExercises.length === 0) return null;
                
                return (
                  <div key={muscleGroup.id} className="space-y-3">
                    <h2 className="text-lg font-semibold">{muscleGroup.name}</h2>
                    <div className="space-y-3">
                      {relatedExercises.map((exercise) => (
                        <Card key={exercise.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold">{exercise.name}</h3>
                              <div>
                                {exercise.muscleGroups?.find(
                                  mg => mg.muscleGroupId === muscleGroup.id
                                )?.isPrimary && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary-foreground font-medium">
                                    主要
                                  </span>
                                )}
                              </div>
                            </div>
                            {exercise.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {exercise.description}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExercisesPage;