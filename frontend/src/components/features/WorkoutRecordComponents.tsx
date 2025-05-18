import React, { useState } from "react";
import { Exercise, WorkoutRecord, WorkoutRecordRequest } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { PlusCircle, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { WorkoutSetInput, WorkoutSetList } from "./WorkoutSetComponents";

interface ExerciseSelectorProps {
  exercises: Exercise[];
  onSelectExercise: (exerciseId: string) => void;
}

export const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({
  exercises,
  onSelectExercise,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">トレーニング種目を追加</h3>
      <Select onValueChange={onSelectExercise}>
        <SelectTrigger>
          <SelectValue placeholder="トレーニング種目を選択" />
        </SelectTrigger>
        <SelectContent>
          {exercises.map((exercise) => (
            <SelectItem key={exercise.id} value={exercise.id}>
              {exercise.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

interface AddWorkoutRecordProps {
  workoutDayId: string;
  exercises: Exercise[];
  onAddRecord: (workoutDayId: string, record: WorkoutRecordRequest) => Promise<void>;
}

export const AddWorkoutRecord: React.FC<AddWorkoutRecordProps> = ({
  workoutDayId,
  exercises,
  onAddRecord,
}) => {
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedExerciseId) {
      await onAddRecord(workoutDayId, {
        exerciseId: selectedExerciseId,
        notes,
      });
      // フォームをリセット
      setSelectedExerciseId("");
      setNotes("");
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>トレーニングを追加</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">トレーニング種目</label>
            <Select 
              value={selectedExerciseId} 
              onValueChange={setSelectedExerciseId}
            >
              <SelectTrigger>
                <SelectValue placeholder="トレーニング種目を選択" />
              </SelectTrigger>
              <SelectContent>
                {exercises.map((exercise) => (
                  <SelectItem key={exercise.id} value={exercise.id}>
                    {exercise.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">メモ</label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="メモを入力（オプション）"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={!selectedExerciseId}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            トレーニングを追加
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

interface WorkoutRecordCardProps {
  record: WorkoutRecord;
  exercises: Exercise[];
  onAddSet: (workoutRecordId: string, set: any) => Promise<void>;
  onDeleteSet: (setId: string) => Promise<void>;
  onDeleteRecord: (recordId: string) => Promise<void>;
}

export const WorkoutRecordCard: React.FC<WorkoutRecordCardProps> = ({
  record,
  exercises,
  onAddSet,
  onDeleteSet,
  onDeleteRecord,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const exerciseName = record.exerciseName || 
    exercises.find(e => e.id === record.exerciseId)?.name || 
    "不明な種目";

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <CardTitle className="text-xl">{exerciseName}</CardTitle>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => onDeleteRecord(record.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent>
          {record.notes && (
            <p className="text-sm text-muted-foreground mb-4">{record.notes}</p>
          )}
          
          <h3 className="font-medium mb-2">セット</h3>
          <WorkoutSetList 
            sets={record.sets || []} 
            onDeleteSet={onDeleteSet}
          />
          
          <div className="mt-4">
            <h3 className="font-medium mb-2">新しいセットを追加</h3>
            <WorkoutSetInput 
              workoutRecordId={record.id}
              onAddSet={onAddSet}
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
};