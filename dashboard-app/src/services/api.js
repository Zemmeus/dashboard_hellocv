import axios from 'axios';

// Базовый URL API (замените на ваш реальный API endpoint)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Создаем экземпляр axios с базовой конфигурацией
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерсептор для обработки ошибок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Получить статистику тикетов
 * @returns {Promise<Object>} Объект с данными статистики
 */
export const getTicketStats = async () => {
  try {
    const response = await apiClient.get('/api/get-gist-conv-for-hello-cv');
    return response.data;
  } catch (error) {
    // Возвращаем mock данные в случае ошибки для демонстрации
    console.warn('API недоступен, используем mock данные');
    return {
      success: true,
      data: {
        total_count: 150,
        status_stats: {
          active: {
            count: 120,
            percentage: 80.0
          },
          escalated: {
            count: 30,
            percentage: 20.0
          }
        },
        daily_stats: [
          { date: "2025-09-10", count: 5 },
          { date: "2025-09-11", count: 8 },
          { date: "2025-09-12", count: 12 },
          { date: "2025-09-13", count: 7 },
          { date: "2025-09-14", count: 15 },
          { date: "2025-09-15", count: 9 },
          { date: "2025-09-16", count: 11 }
        ]
      }
    };
  }
};

/**
 * Обновить статистику (принудительное обновление)
 * @returns {Promise<Object>} Обновленные данные статистики
 */
export const refreshTicketStats = async () => {
  return await getTicketStats();
};

export default {
  getTicketStats,
  refreshTicketStats,
};
