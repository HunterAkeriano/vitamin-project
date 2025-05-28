import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'https://www.mku-journal.online';
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const REFRESH_URL = '/auth/refresh-token';

// Создаём экземпляр axios с базовым URL и настройкой передачи куков
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Позволяет передавать куки при запросах
});

// Функция получения accessToken из куков
const getAccessToken = (): string | null => {
  return Cookies.get(ACCESS_TOKEN_KEY) || null;
};

// Функция получения refreshToken из куков
const getRefreshToken = (): string | null => {
  return Cookies.get(REFRESH_TOKEN_KEY) || null;
};

// Функция сохранения accessToken и refreshToken в куки
const setTokens = (accessToken: string, refreshToken: string): void => {
  Cookies.set(ACCESS_TOKEN_KEY, accessToken, { path: '/' });
  Cookies.set(REFRESH_TOKEN_KEY, refreshToken, { path: '/', expires: 1 });
};

// Очистка токенов при выходе из системы или истечении refreshToken
const clearAuthData = (): void => {
  Cookies.remove(ACCESS_TOKEN_KEY, { path: '/' });
  Cookies.remove(REFRESH_TOKEN_KEY, { path: '/' });
  localStorage.removeItem('userInfo');
  // window.location.href = '/Vitamin/login.html';
};

// Перехватчик запросов: добавляет заголовок Authorization с токеном, если он есть
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.authorization = `${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Флаг для предотвращения множественных запросов на refresh
let isRefreshing = false;
const refreshSubscribers: ((token: string) => void)[] = [];

// Функция подписки на обновление токена (используется при ожидании обновления токена)
const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

// Функция, вызываемая после успешного обновления токена (уведомляет всех подписчиков)
const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token)); // Вызываем все подписанные коллбеки с новым токеном
  refreshSubscribers.splice(0, refreshSubscribers.length); // Очищаем массив подписчиков
};

// Перехватчик ответов: обрабатывает 401 ошибки и обновляет токен
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.authorization = `${token}`;
            }
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const { data } = await apiClient.post<{ accessToken: string; refreshToken: string }>(REFRESH_URL, {
          [REFRESH_TOKEN_KEY]: refreshToken,
        });
        setTokens(data.accessToken, data.refreshToken); // Сохраняем новые токены в куки
        onRefreshed(data.accessToken); // Уведомляем подписчиков о новом токене

        if (originalRequest.headers) {
          originalRequest.headers.authorization = `${data.accessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        clearAuthData(); // Очистка данных, если refreshToken невалиден
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
