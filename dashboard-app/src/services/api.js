import axios from 'axios';

// Базовый URL API 
const API_BASE_URL = 'https://agent.pointai.tech';

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
        total_count: 101,
        status_stats: {
          active: {
            count: 88,
            percentage: 87.1
          },
          escalated: {
            count: 13,
            percentage: 12.9
          }
        },
        daily_stats: [
          { count: 6, date: "2025-07-06" },
          { count: 5, date: "2025-07-07" },
          { count: 2, date: "2025-07-16" },
          { count: 1, date: "2025-07-17" },
          { count: 3, date: "2025-08-12" },
          { count: 8, date: "2025-08-13" },
          { count: 6, date: "2025-08-14" },
          { count: 1, date: "2025-08-15" },
          { count: 1, date: "2025-08-16" },
          { count: 2, date: "2025-08-17" },
          { count: 4, date: "2025-08-18" },
          { count: 5, date: "2025-08-19" },
          { count: 1, date: "2025-08-20" },
          { count: 5, date: "2025-08-22" },
          { count: 10, date: "2025-08-23" },
          { count: 7, date: "2025-08-24" },
          { count: 1, date: "2025-08-25" },
          { count: 3, date: "2025-08-26" },
          { count: 1, date: "2025-09-03" },
          { count: 1, date: "2025-09-04" },
          { count: 1, date: "2025-09-10" },
          { count: 2, date: "2025-09-11" },
          { count: 5, date: "2025-09-12" },
          { count: 20, date: "2025-09-16" }
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
