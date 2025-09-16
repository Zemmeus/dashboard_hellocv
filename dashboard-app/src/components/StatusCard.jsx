import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';

const StatusCard = ({ title, count, percentage, type, delay = 0 }) => {
  const isSuccess = type === 'success';
  const isDanger = type === 'danger';
  
  const colors = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'text-green-600',
      iconBg: 'bg-green-100',
      text: 'text-green-800',
      gradient: 'from-green-400 to-green-600'
    },
    danger: {
      bg: 'bg-red-50',
      border: 'border-red-200', 
      icon: 'text-red-600',
      iconBg: 'bg-red-100',
      text: 'text-red-800',
      gradient: 'from-red-400 to-red-600'
    }
  };
  
  const theme = isSuccess ? colors.success : colors.danger;
  const Icon = isSuccess ? CheckCircle : AlertTriangle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
      className={`
        ${theme.bg} ${theme.border} border rounded-xl p-6 
        card-shadow card-hover relative overflow-hidden
      `}
    >
      {/* Фоновый градиент */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${theme.gradient} opacity-10 rounded-full -mr-16 -mt-16`} />
      
      <div className="relative">
        {/* Заголовок и иконка */}
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${theme.text}`}>
            {title}
          </h3>
          <div className={`p-2 ${theme.iconBg} rounded-lg`}>
            <Icon className={`w-6 h-6 ${theme.icon}`} />
          </div>
        </div>

        {/* Основная статистика */}
        <div className="mb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: delay + 0.2
            }}
            className={`text-3xl font-bold ${theme.text} mb-1`}
          >
            {count?.toLocaleString() || '0'}
          </motion.div>
          <div className="text-gray-600 text-sm">
            Количество тикетов
          </div>
        </div>

        {/* Прогресс-бар */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Процент от общего количества
            </span>
            <span className={`text-sm font-bold ${theme.text}`}>
              {percentage?.toFixed(1) || '0'}%
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage || 0}%` }}
              transition={{ 
                duration: 1,
                delay: delay + 0.4,
                ease: "easeOut"
              }}
              className={`h-2 rounded-full bg-gradient-to-r ${theme.gradient}`}
            />
          </div>
        </div>

        {/* Дополнительная информация */}
        <div className="flex items-center gap-2 text-gray-600">
          <TrendingUp className="w-4 h-4" />
          <span className="text-xs">
            {isSuccess ? 'Обрабатываются в штатном режиме' : 'Требуют повышенного внимания'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default StatusCard;
