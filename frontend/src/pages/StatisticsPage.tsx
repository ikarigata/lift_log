import React, { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Line } from 'react-chartjs-2';
import { getExerciseProgress } from '../api/statistics';
import TitleBar from '../components/TitleBar';
import type { Exercise, ExerciseProgressResponse } from '../types';
import { isAuthenticated } from '../utils/auth';
import { calculateMax1RM } from '../utils/rmCalculator';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, zoomPlugin);

interface StatisticsPageProps {
  exercises: Exercise[];
  onLogout: () => void;
}

const StatisticsPage: React.FC<StatisticsPageProps> = ({ exercises, onLogout }) => {
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [chartData, setChartData] = useState<any>({ labels: [], datasets: [] });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 初期表示の種目を選択
  useEffect(() => {
    if (exercises.length > 0) {
      setSelectedExercise(exercises[0].id);
    }
  }, [exercises]);

  // 外部クリックでドロップダウンを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 選択された種目が変わったらデータを再取得
  useEffect(() => {
    if (!selectedExercise || !isAuthenticated()) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data: ExerciseProgressResponse = await getExerciseProgress(selectedExercise);

        const labels = data.progressData.map(p => new Date(p.date).toLocaleDateString());
        const totalVolumeData = data.progressData.map(p => p.totalVolume);
        const maxWeightData = data.progressData.map(p => p.maxWeight);
        const oneRMData = data.progressData.map(p => calculateMax1RM(p.sets));

        // 初期表示範囲を直近10ポイントに設定
        const dataLength = labels.length;
        const initialStartIndex = Math.max(0, dataLength - 10);
        const initialEndIndex = dataLength - 1;

        setChartData({
          labels,
          datasets: [
            {
              label: '総ボリューム (kg)',
              data: totalVolumeData,
              borderColor: 'rgb(239, 68, 68)', // 赤
              backgroundColor: 'rgba(239, 68, 68, 0.3)',
              yAxisID: 'y_volume',
            },
            {
              label: 'Max重量 (kg)',
              data: maxWeightData,
              borderColor: 'rgb(251, 191, 36)', // より明るい黄色
              backgroundColor: 'rgba(251, 191, 36, 0.3)',
              yAxisID: 'y_weight',
            },
            {
              label: '推定1RM (kg)',
              data: oneRMData,
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

  const handleExerciseSelect = (exerciseId: string) => {
    setSelectedExercise(exerciseId);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // チャートオプションを動的に生成
  const getChartOptions = (dataLength: number) => ({
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
      zoom: {
        limits: {
          y: {min: 0, max: 'original'},
          x: {min: 'original', max: 'original'}
        },
        pan: {
          enabled: true,
          mode: 'x' as const, // 横方向のパンのみ有効
          modifierKey: null, // キー押下なしでパン可能
        },
        zoom: {
          wheel: {
            enabled: true,
            modifierKey: 'ctrl' as const, // Ctrl+ホイールでズーム
          },
          pinch: {
            enabled: true // ピンチでズーム（タッチデバイス）
          },
          mode: 'x' as const, // 横方向のズームのみ
        }
      }
    },
    scales: {
        x: {
          min: Math.max(0, dataLength - 10), // 初期表示は直近10ポイント
          max: dataLength - 1,
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
  });

  return (
    <div className="w-full px-2 py-4 space-y-[10px] bg-surface-primary min-h-screen">
      <TitleBar title="Statistics" onLogout={onLogout} />

      <div className="bg-surface-secondary rounded-[10px] p-2 space-y-2">
        <div className="relative" ref={dropdownRef}>
          {/* アコーディオンボタン */}
          <button
            onClick={toggleDropdown}
            disabled={isLoading || exercises.length === 0}
            className="block w-full p-2 bg-orange-500 border border-orange-600 rounded-[10px] text-amber-100 font-dotgothic focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-left flex justify-between items-center"
          >
            <span>
              {selectedExercise ? exercises.find(ex => ex.id === selectedExercise)?.name : 'トレーニング種目を選択'}
            </span>
            <span className={`transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          {/* アコーディオンメニュー */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-orange-500 border border-orange-600 rounded-[10px] overflow-hidden shadow-lg">
              <div className="max-h-48 overflow-y-auto">
                {exercises.map((exercise) => (
                  <button
                    key={exercise.id}
                    onClick={() => handleExerciseSelect(exercise.id)}
                    className="block w-full p-2 text-left text-amber-100 font-dotgothic hover:bg-orange-600 transition-colors"
                  >
                    {exercise.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 操作ヘルプ */}
        <div className="bg-surface-secondary rounded-[10px] p-2">
          <p className="text-amber-100 font-dotgothic text-xs text-center">
            📱 ドラッグで横スクロール | 🖱️ Ctrl+ホイールでズーム | 📌 ピンチでズーム
          </p>
        </div>

        <div className="relative h-[550px] bg-surface-secondary rounded-[10px] overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-amber-100 font-dotgothic">読み込み中...</p>
            </div>
          ) : (
            <div className="w-full h-full">
              <Line options={getChartOptions(chartData.labels?.length || 0)} data={chartData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
