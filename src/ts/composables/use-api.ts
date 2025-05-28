import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

import { CardInfoData, LogInData, OrderData, OrdersData, PasswordData, ProdResponse, Product, ProfileUpdateData, RefreshTokenData, RegisterData, ResetPasswordData, SetNewPasswordData, UserInfo, UserNotFoundInfo } from '../../typings/interfaces.ts';

const API_BASE_URL = 'https://www.mku-journal.online';
const ACCESS_TOKEN_KEY = 'accessToken'; // Ключ для хранения accessToken в куках
const REFRESH_TOKEN_KEY = 'refreshToken'; // Ключ для хранения refreshToken в куках
const REFRESH_URL = '/auth/refresh-token'; // URL для обновления токенов

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Создаём экземпляр axios с базовым URL и настройкой передачи куков
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Позволяет передавать куки при запросах
});

// Helper function for error handling
const handleRequest = async <T>(request: Promise<{ data: T }>): Promise<T> => {
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || error.message;
      console.error('API error:', message);
      throw new Error(message);
    }

    if (error instanceof Error) {
      console.error('General error:', error.message);
      throw error;
    }

    console.error('Unknown error:', error);
    throw new Error('An unexpected error occurred.');
  }
};

const handleResponse = async <T>(request: Promise<{ data: T }>): Promise<T | { errors: { message: string; field?: string }[] }> => {
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('API error:', error.response?.data || error.message);
      return { errors: [{ message: error.response?.data?.message || error.message, field: error.response?.data?.field }] };
    }
    if (error instanceof Error) {
      console.error('General error:', error.message);
      return { errors: [{ message: error.message }] };
    }

    console.error('Unknown error:', error);
    return { errors: [{ message: 'An unexpected error occurred.' }] };
  }
};

// Auth
export const logIn = (data: LogInData) => handleResponse<LogInData>(apiClient.post('/auth/login', data));
export const register = (data: RegisterData) => handleResponse<RegisterData>(apiClient.post('/auth/register', data));
export const resetPassword = (data: ResetPasswordData) => handleResponse<ResetPasswordData>(apiClient.post('/auth/reset-password', data));
export const checkResetToken = (token: string) => handleResponse<AxiosResponse>(apiClient.get(`/auth/check-reset-token?token=${token}`));
export const setNewPassword = (data: SetNewPasswordData) => handleResponse<SetNewPasswordData>(apiClient.post(`/auth/set-new-password`, data));
export const refreshToken = (data: RefreshTokenData) => handleResponse(api.post('/auth/refresh-token', data));

//Catalog
export const getCatalogList = (page: number, limit: number, type?: string) => handleRequest<ProdResponse>(api.get('/catalog/all-list', { params: { type, page, limit } }));
export const getCatalogItem = (id: string) => handleRequest<Product>(api.get(`/catalog/${id}/info`));
export const createOrder = (data: OrderData) => handleRequest(api.post('/catalog/create-order', data));
export const getRecommendations = (isMain: boolean) => handleRequest<ProdResponse>(api.get(`${isMain ? '/catalog/recommendations?is_main=true' : '/catalog/recommendations'}`));

//Profile
export const getProfileInfo = () => handleResponse<UserInfo | UserNotFoundInfo>(apiClient.get('/profile/info'));
export const getOrderHistory = () => handleResponse<OrdersData>(apiClient.get('/profile/order-history'));
export const updateProfile = (data: ProfileUpdateData) => handleResponse<ProfileUpdateData>(apiClient.put('/profile/update-profile', data));
export const updateCardInfo = (data: CardInfoData) => handleResponse<CardInfoData>(apiClient.put('/profile/update-card-info', data));
export const changePassword = (data: PasswordData) => handleResponse<PasswordData>(apiClient.put('/profile/change-password', data));

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
  window.location.href = '/Vitamin/login.html';
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
