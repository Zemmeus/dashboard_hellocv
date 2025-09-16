import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-xl p-8 card-shadow text-center"
      >
        {/* Иконка ошибки */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center"
        >
          <AlertCircle className="w-8 h-8 text-red-600" />
        </motion.div>

        {/* Заголовок */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-semibold text-gray-900 mb-3"
        >
          Упс! Что-то пошло не так
        </motion.h2>

        {/* Сообщение об ошибке */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 mb-6 leading-relaxed"
        >
          {message || 'Произошла неожиданная ошибка при загрузке данных. Пожалуйста, попробуйте еще раз.'}
        </motion.p>

        {/* Кнопки действий */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          {/* Кнопка повтора */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRetry}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <RefreshCw className="w-4 h-4" />
            Попробовать еще раз
          </motion.button>

          {/* Кнопка на главную */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.reload()}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            <Home className="w-4 h-4" />
            Перезагрузить страницу
          </motion.button>
        </motion.div>

        {/* Дополнительная информация */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 p-4 bg-gray-50 rounded-lg"
        >
          <p className="text-xs text-gray-500 leading-relaxed">
            Если проблема повторяется, убедитесь что:
            <br />• API сервер доступен
            <br />• Интернет соединение стабильно
            <br />• Браузер поддерживает все функции
          </p>
        </motion.div>

        {/* Статус индикатор */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400"
        >
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
          <span>Система временно недоступна</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ErrorMessage;
