import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { getExerciseProgress } from '../api/statistics';
import TitleBar from '../components/TitleBar';
import type { Exercise, ExerciseProgressResponse } from '../types';
import { isAuthenticated } from '../utils/auth'; // 実際にはAppからユーザー情報を渡すべき

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface StatisticsPageProps {
  exercises: Exercise[];
  onLogout: () => void;
}

const StatisticsPage: React.FC<StatisticsPageProps> = ({ exercises, onLogout }) => {
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
        const max1RMData = data.progress.map(p => p.max1RM);

        setChartData({
          labels,
          datasets: [
            {
              label: '総ボリューム (kg)',
              data: volumeData,
              borderColor: 'rgb(239, 68, 68)', // 赤
              backgroundColor: 'rgba(239, 68, 68, 0.3)',
              yAxisID: 'y_volume',
            },
            {
              label: '最大重量 (kg)',
              data: maxWeightData,
              borderColor: 'rgb(251, 191, 36)', // より明るい黄色
              backgroundColor: 'rgba(251, 191, 36, 0.3)',
              yAxisID: 'y_weight',
            },
            {
              label: '推定1RM (kg)',
              data: max1RMData,
              borderColor: 'rgb(37, 99, 235)', // より暗い青
              backgroundColor: 'rgba(37, 99, 235, 0.3)',
              yAxisID: 'y_weight',
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
    layout: {
      padding: {
        bottom: 10, // 凡例との間に余白を追加
      },
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#FEF3C7', // amber-100 (ベージュ色)
          font: {
            family: 'DotGothic16',
            size: 10, // 小さくしてスペースを節約
          },
          padding: 8, // パディングを少し増やして間隔を調整
          usePointStyle: true, // 点スタイルを使用してコンパクトに
          boxWidth: 10, // ボックス幅を小さく
        },
      },
      title: {
        display: false, // タイトルを非表示（プルダウンと内容が重複するため）
      },
    },
    scales: {
        x: {
          ticks: {
            color: '#FEF3C7', // amber-100 (ベージュ色)
            font: {
              family: 'DotGothic16',
              size: 10, // 小さくしてスペースを節約
            },
          },
          grid: {
            color: '#3B3C3F', // surface-secondary背景に合うグリッド色
          },
        },
        y_volume: {
          type: 'linear' as const,
          display: true,
          position: 'left' as const,
          title: {
            display: true,
            text: '総ボリューム (kg)',
            color: '#FEF3C7', // amber-100 (ベージュ色)
            font: {
              family: 'DotGothic16',
              size: 11, // 小さくしてスペースを節約
            },
          },
          ticks: {
            color: '#FEF3C7', // amber-100 (ベージュ色)
            font: {
              family: 'DotGothic16',
              size: 10, // 小さくしてスペースを節約
            },
          },
          grid: {
            color: '#3B3C3F', // surface-secondary背景に合うグリッド色
          },
        },
        y_weight: {
          type: 'linear' as const,
          display: true,
          position: 'right' as const,
          title: {
            display: true,
            text: '重量・1RM (kg)',
            color: '#FEF3C7', // amber-100 (ベージュ色)
            font: {
              family: 'DotGothic16',
              size: 11, // 小さくしてスペースを節約
            },
          },
          ticks: {
            color: '#FEF3C7', // amber-100 (ベージュ色)
            font: {
              family: 'DotGothic16',
              size: 10, // 小さくしてスペースを節約
            },
          },
          grid: {
            drawOnChartArea: false,
            color: '#3B3C3F', // surface-secondary背景に合うグリッド色
          },
        },
      },
  };

  return (
    <div className="w-full px-2 py-4 space-y-[10px] bg-surface-primary min-h-screen">
      <TitleBar title="Statistics" onLogout={onLogout} />

      <div className="bg-surface-secondary rounded-[10px] p-2 space-y-2">
        <div>
          <label htmlFor="exercise-select" className="block text-sm font-medium text-content-secondary mb-1 font-dotgothic">
            トレーニング種目
          </label>
          <select
            id="exercise-select"
            value={selectedExercise}
            onChange={handleExerciseChange}
            disabled={isLoading || exercises.length === 0}
            className="block w-full p-2 bg-orange-500 border border-orange-600 rounded-[10px] text-amber-100 font-dotgothic focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
          >
            {exercises.map((exercise) => (
              <option key={exercise.id} value={exercise.id} className="bg-orange-500 text-amber-100">
                {exercise.name}
              </option>
            ))}
          </select>
        </div>

        <div className="relative h-[550px] bg-surface-secondary rounded-[10px] overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-amber-100 font-dotgothic">読み込み中...</p>
            </div>
          ) : (
            <div className="w-full h-full">
              <Line options={options} data={chartData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
