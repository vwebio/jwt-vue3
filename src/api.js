import axios from "axios";
import { useAuthStore } from "./stores/auth";
import router from "./router";

// Создание экземпляра axios для API-запросов
const axiosApiInstance = axios.create();

// Получение API-ключа из переменных окружения
const apiKey = import.meta.env.VITE_API_KEY_FIREBASE;

// Перехватчик запросов для добавления токена аутентификации
axiosApiInstance.interceptors.request.use((config) => {
  const url = config.url;
  // Если URL не содержит 'signInWithPassword' и 'signUp', добавляем токен аутентификации
  if (!url.includes("signInWithPassword") && !url.includes("signUp")) {
    const authStore = useAuthStore();
    let params = new URLSearchParams();
    params.append("auth", authStore.userInfo.token);
    config.params = params;
  }
  return config;
});

// Перехватчик ответов для обработки ошибок и обновления токенов
axiosApiInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const authStore = useAuthStore();
    const originalRequest = error.config;
    // Если статус ошибки 401 и запрос не был повторён, пытаемся обновить токены
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Запрос на обновление токенов
        const newTokens = await axios.post(
          `https://securetoken.googleapis.com/v1/token?key=${apiKey}`,
          {
            grant_type: "refresh_token",
            refresh_token: JSON.parse(localStorage.getItem("userTokens"))
              .refreshToken,
          }
        );
        console.log("newToken", newTokens.data);
        // Обновление токенов в хранилище и localStorage
        authStore.userInfo.token = newTokens.data.access_token;
        authStore.userInfo.refreshToken = newTokens.data.refresh_token;
        localStorage.setItem(
          "userTokens",
          JSON.stringify({
            token: newTokens.data.access_token,
            refreshToken: newTokens.data.refresh_token,
          })
        );
      } catch (err) {
        // Если обновление токенов не удалось, удаляем токены и перенаправляем на страницу входа
        localStorage.removeItem("userTokens");
        router.push("/signin");
        authStore.userInfo.token = "";
        authStore.userInfo.refreshToken = "";
      }

      return axiosApiInstance(originalRequest);
    }
  }
);

// Экспорт экземпляра axios
export default axiosApiInstance;
