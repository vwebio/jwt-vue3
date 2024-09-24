import { ref } from "vue";
import { defineStore } from "pinia"; // Pinia для создания store
import axiosApiInstance from "../api"; // Axios для выполнения HTTP-запросов

// Получаем API ключ из переменной окружения
const apiKey = import.meta.env.VITE_API_KEY_FIREBASE;

// Store
export const useAuthStore = defineStore("auth", () => {
  const userInfo = ref({
    token: "",
    email: "",
    userId: "",
    refreshToken: "",
  });

  const error = ref("");
  const loader = ref(false);

  // Функция для аутентификации пользователя (вход или регистрация)
  const auth = async (payload, type) => {
    error.value = "";
    loader.value = true;
  
    // Проверка на пустые поля
    if (!payload.email) {
      error.value = "Пожалуйста, введите email";
      loader.value = false;
      throw error.value;
    }
  
    if (!payload.password) {
      error.value = "Пожалуйста, введите пароль";
      loader.value = false;
      throw error.value;
    }
  
    // Определяем URL для регистрации или входа
    const stringUrl = type === "signup" ? "signUp" : "signInWithPassword";
  
    // Выполняем POST-запрос для регистрации или входа
    try {
      let response = await axiosApiInstance.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:${stringUrl}?key=${apiKey}`,
        {
          ...payload,
          returnSecureToken: true,
        }
      );
      
    // Обновляем информацию о пользователе
      userInfo.value = {
        token: response.data.idToken,
        email: response.data.email,
        userId: response.data.localId,
        refreshToken: response.data.refreshToken,
      };
  
    // Сохраняем токены в localStorage
      localStorage.setItem(
        "userTokens",
        JSON.stringify({
          token: userInfo.value.token,
          refreshToken: userInfo.value.refreshToken,
        })
      );
    
    // Обрабатываем возможные ошибки
    } catch (err) {
      if (err.response && err.response.data) {
        switch (err.response.data.error.message) {
          case "EMAIL_EXISTS":
            error.value = "Email уже зарегистрирован";
            break;          
          case "OPERATION_NOT_ALLOWED":
            error.value = "Операция не разрешена";
            break;
          case "EMAIL_NOT_FOUND":
            error.value = "Email не найден";
            break;
          case "INVALID_PASSWORD":
            error.value = "Неверный пароль";
            break;           
          default:
            error.value = `Ошибка`;
            break;
        }
      } else {
        error.value = "Неизвестные данные";
      }
      throw error.value;
    } finally {
      loader.value = false;
    }
  };
  
  // Сбрасываем информацию о пользователе при выходе
  const logout = () => {
    userInfo.value = {
      token: "",
      email: "",
      userId: "",
      refreshToken: "",
    }; 
  };

  // Возвращаем методы и состояния из хранилища
  return { auth, userInfo, error, loader, logout }; 
});
