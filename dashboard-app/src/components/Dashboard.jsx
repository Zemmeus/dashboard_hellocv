import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { getTicketStats, refreshTicketStats } from '../services/api';
import TotalCountCard from './TotalCountCard';
import StatusCard from './StatusCard';
import DailyStatsChart from './DailyStatsChart';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Функция загрузки данных
  const loadData = async () => {
    try {
      setError(null);
      const response = await getTicketStats();
      
      if (response.success) {
        setData(response.data);
      } else {
        throw new Error('Не удалось получить данные');
      }
    } catch (err) {
      setError(err.message || 'Произошла ошибка при загрузке данных');
    } finally {
      setLoading(false);
    }
  };

  // Функция обновления данных
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await refreshTicketStats();
      if (response.success) {
        setData(response.data);
        setError(null);
      }
    } catch (err) {
      setError(err.message || 'Произошла ошибка при обновлении данных');
    } finally {
      setRefreshing(false);
    }
  };

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    loadData();
  }, []);

  // Автообновление каждые 5 минут
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 5 * 60 * 1000); // 5 минут

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error && !data) {
    return (
      <ErrorMessage 
        message={error} 
        onRetry={loadData}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Dashboard Gist Тикетов
              </h1>
              <p className="text-gray-600">
                Статистика и аналитика системы поддержки
              </p>
            </div>
            
            {/* Кнопка обновления */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={refreshing}
              className={`
                flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg
                hover:bg-blue-700 transition-colors duration-200
                ${refreshing ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <RefreshCw 
                className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} 
              />
              {refreshing ? 'Обновление...' : 'Обновить'}
            </motion.button>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg">
              ⚠️ {error}
            </div>
          )}
        </motion.div>

        {/* Основной контент */}
        {data && (
          <div className="space-y-8">
            {/* Большая карточка с общим количеством */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <TotalCountCard totalCount={data.total_count} />
            </motion.div>

            {/* Карточки статистики статусов */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <StatusCard
                title="Активные тикеты"
                count={data.status_stats.active.count}
                percentage={data.status_stats.active.percentage}
                type="success"
                delay={0.3}
              />
              <StatusCard
                title="Эскалированные тикеты"
                count={data.status_stats.escalated.count}
                percentage={data.status_stats.escalated.percentage}
                type="danger"
                delay={0.4}
              />
            </motion.div>

            {/* График по датам */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <DailyStatsChart data={data.daily_stats} />
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
