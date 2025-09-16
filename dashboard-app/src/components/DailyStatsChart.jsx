import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Calendar } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DailyStatsChart = ({ data }) => {
  const chartRef = useRef();

  // Подготовка данных для графика
  const chartData = {
    labels: data?.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('ru-RU', { 
        month: 'short', 
        day: 'numeric' 
      });
    }) || [],
    datasets: [
      {
        label: 'Количество тикетов',
        data: data?.map(item => item.count) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
        maxBarThickness: 40,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(31, 41, 55, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (tooltipItems) => {
            const index = tooltipItems[0].dataIndex;
            const date = new Date(data[index].date);
            return date.toLocaleDateString('ru-RU', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
          },
          label: (context) => {
            return `Тикетов: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
            weight: '500',
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(229, 231, 235, 0.8)',
          drawBorder: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
            weight: '500',
          },
          stepSize: 1,
        }
      },
    },
    onHover: (event, activeElements) => {
      event.native.target.style.cursor = activeElements.length > 0 ? 'pointer' : 'default';
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  // Анимация появления графика
  useEffect(() => {
    const chart = chartRef.current;
    if (chart) {
      chart.update('active');
    }
  }, [data]);

  // Статистика для заголовка
  const totalDays = data?.length || 0;
  const avgPerDay = data?.length ? 
    (data.reduce((sum, item) => sum + item.count, 0) / data.length).toFixed(1) : 0;
  const maxDay = data?.reduce((max, item) => item.count > max.count ? item : max, data[0]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 card-shadow card-hover"
    >
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Статистика по дням
            </h3>
            <p className="text-gray-600 text-sm">
              Динамика создания тикетов за последние {totalDays} дней
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-gray-500">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">Последние 7 дней</span>
        </div>
      </div>

      {/* Мини-статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-blue-50 rounded-lg p-4"
        >
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {avgPerDay}
          </div>
          <div className="text-sm text-gray-600">
            Среднее в день
          </div>
        </motion.div>
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-green-50 rounded-lg p-4"
        >
          <div className="text-2xl font-bold text-green-600 mb-1">
            {maxDay?.count || 0}
          </div>
          <div className="text-sm text-gray-600">
            Максимум за день
          </div>
        </motion.div>
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-purple-50 rounded-lg p-4"
        >
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {data?.reduce((sum, item) => sum + item.count, 0) || 0}
          </div>
          <div className="text-sm text-gray-600">
            Всего за период
          </div>
        </motion.div>
      </div>

      {/* График */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative h-80"
      >
        {data && data.length > 0 ? (
          <Bar 
            ref={chartRef}
            data={chartData} 
            options={options} 
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Нет данных для отображения</p>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default DailyStatsChart;
