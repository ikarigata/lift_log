import React, { useState } from "react";
import { WorkoutSet, WorkoutSetRequest } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus } from "lucide-react";
import { formatWeight, formatReps, calculateVolume } from "@/lib/utils";

interface WorkoutSetInputProps {
  workoutRecordId: string;
  onAddSet: (workoutRecordId: string, set: WorkoutSetRequest) => void;
}

export const WorkoutSetInput: React.FC<WorkoutSetInputProps> = ({
  workoutRecordId,
  onAddSet,
}) => {
  const [reps, setReps] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reps > 0 && weight >= 0) {
      onAddSet(workoutRecordId, { reps, weight });
      // 入力をリセット
      setReps(0);
      setWeight(0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end space-x-2 my-2">
      <div className="flex-1">
        <label htmlFor="weight" className="text-sm">
          重量 (kg)
        </label>
        <Input
          id="weight"
          type="number"
          step="0.5"
          min="0"
          value={weight || ""}
          onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
          className="mt-1"
        />
      </div>

      <div className="flex-1">
        <label htmlFor="reps" className="text-sm">
          回数
        </label>
        <Input
          id="reps"
          type="number"
          min="1"
          value={reps || ""}
          onChange={(e) => setReps(parseInt(e.target.value) || 0)}
          className="mt-1"
        />
      </div>

      <Button
        type="submit"
        className="flex-none"
        disabled={!(reps > 0 && weight >= 0)}
      >
        <Plus className="h-4 w-4 mr-1" />
        追加
      </Button>
    </form>
  );
};

interface WorkoutSetListProps {
  sets: WorkoutSet[];
  onDeleteSet?: (setId: string) => void;
}

export const WorkoutSetList: React.FC<WorkoutSetListProps> = ({
  sets,
  onDeleteSet,
}) => {
  if (sets.length === 0) {
    return <p className="text-sm text-muted-foreground py-2">記録がありません</p>;
  }

  return (
    <div className="space-y-1">
      <div className="grid grid-cols-12 text-sm font-medium text-muted-foreground mb-1">
        <div className="col-span-1">#</div>
        <div className="col-span-4">重量</div>
        <div className="col-span-3">回数</div>
        <div className="col-span-3">ボリューム</div>
        {onDeleteSet && <div className="col-span-1"></div>}
      </div>
      {sets.map((set, index) => (
        <div
          key={set.id}
          className="grid grid-cols-12 py-2 border-b text-sm items-center"
        >
          <div className="col-span-1 font-medium">{index + 1}</div>
          <div className="col-span-4">{formatWeight(set.weight)}</div>
          <div className="col-span-3">{formatReps(set.reps)}</div>
          <div className="col-span-3 font-medium">
            {set.volume ?? calculateVolume(set.weight, set.reps)}
          </div>
          {onDeleteSet && (
            <div className="col-span-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => onDeleteSet(set.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};