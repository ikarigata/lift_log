import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { getExerciseProgress } from '../api/statistics';
import type { Exercise, ExerciseProgressResponse } from '../types';
import { isAuthenticated } from '../utils/auth'; // 実際にはAppからユーザー情報を渡すべき

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface StatisticsPageProps {
  exercises: Exercise[];
}

const StatisticsPage: React.FC<StatisticsPageProps> = ({ exercises }) => {
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [chartData, setChartData] = useState<any>({ labels: [], datasets: [] });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 初期表示の種目を選択
  useEffect(() => {
    if (exercises.length > 0) {
      setSelectedExercise(exercises[0].id);
    }
  }, [exercises]);

  // 選択された種目が変わったらデータを再取得
  useEffect(() => {
    if (!selectedExercise || !isAuthenticated()) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // TODO: ユーザーIDを適切に取得する
        const userId = 'user1'; // 仮
        const data: ExerciseProgressResponse = await getExerciseProgress(userId, selectedExercise);

        const labels = data.progress.map(p => new Date(p.date).toLocaleDateString());
        const volumeData = data.progress.map(p => p.totalVolume);
        const maxWeightData = data.progress.map(p => p.maxWeight);

        setChartData({
          labels,
          datasets: [
            {
              label: '総ボリューム (kg)',
              data: volumeData,
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              yAxisID: 'y_volume',
            },
            {
              label: '最大重量 (kg)',
              data: maxWeightData,
              borderColor: 'rgb(53, 162, 235)',
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
              yAxisID: 'y_max_weight',
            },
          ],
        });
      } catch (error) {
        console.error('Failed to fetch statistics data', error);
        // エラーハンドリング
        setChartData({ labels: [], datasets: [] });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedExercise]);

  const handleExerciseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedExercise(event.target.value);
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: exercises.find(ex => ex.id === selectedExercise)?.name || 'トレーニング推移',
      },
    },
    scales: {
        y_volume: {
          type: 'linear' as const,
          display: true,
          position: 'left' as const,
          title: {
            display: true,
            text: '総ボリューム (kg)',
          },
        },
        y_max_weight: {
          type: 'linear' as const,
          display: true,
          position: 'right' as const,
          title: {
            display: true,
            text: '最大重量 (kg)',
          },
          grid: {
            drawOnChartArea: false,
          },
        },
      },
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">統計</h1>

      <div className="mb-4">
        <label htmlFor="exercise-select" className="block text-sm font-medium text-gray-700 mb-1">
          トレーニング種目
        </label>
        <select
          id="exercise-select"
          value={selectedExercise}
          onChange={handleExerciseChange}
          disabled={isLoading || exercises.length === 0}
          className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          {exercises.map((exercise) => (
            <option key={exercise.id} value={exercise.id}>
              {exercise.name}
            </option>
          ))}
        </select>
      </div>

      <div className="relative h-96">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <p>読み込み中...</p>
          </div>
        ) : (
          <Line options={options} data={chartData} />
        )}
      </div>
    </div>
  );
};

export default StatisticsPage;
