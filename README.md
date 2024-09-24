# Аутентификация - Vue 3, JWT, Firebase, Pinia

## Описание

Это приложение на **Vue 3** с использованием **Pinia** для управления состоянием и **Firebase Authentication** для аутентификации пользователей. Приложение реализует регистрацию, вход и защищённый доступ к контенту (например, к списку автомобилей). Для хранения токенов используется `localStorage`, а для API-запросов — библиотека **Axios** с перехватчиками запросов и ответов.

Приложение позволяет пользователям регистрироваться, входить в систему и просматривать список автомобилей, если они аутентифицированы. Система токенов реализована через Firebase, и пользователи могут оставаться аутентифицированными между сессиями благодаря сохранению токенов в `localStorage`.

## Функционал

### 1. **Аутентификация пользователей**
   - **Регистрация и вход** через Firebase Authentication.
   - После успешной регистрации/входа токены пользователя (JWT) сохраняются в `localStorage`.
   - Для неаутентифицированных пользователей доступны только страницы регистрации и входа.
   - Если пользователь не аутентифицирован, при попытке зайти на защищённые страницы его перенаправляют на страницу входа.

### 2. **Маршрутизация**
   - Используется **vue-router** для организации маршрутов в приложении.
   - **Защищённые маршруты**: некоторые страницы доступны только для аутентифицированных пользователей (например, страница с автомобилями).
   - **Переадресация**:
     - Аутентифицированные пользователи перенаправляются на страницу автомобилей при попытке попасть на страницы регистрации или входа.
     - Неаутентифицированные пользователи перенаправляются на страницу входа, если пытаются перейти на защищённый маршрут.

### 3. **API-запросы**
   - **Axios** используется для отправки запросов к Firebase Realtime Database.
   - Реализованы **перехватчики запросов и ответов**:
     - Перехватчик запросов автоматически добавляет JWT в заголовок для всех запросов, кроме регистрации и входа.
     - Перехватчик ответов обновляет токен, если он истёк, и повторно отправляет запрос.
     - Если обновление токена не удалось, пользователь перенаправляется на страницу входа.

### 4. **Управление состоянием**
   - **Pinia** используется для управления состоянием аутентификации.
   - Состояние хранит данные пользователя (токен, email, ID и refreshToken).
   - Данные пользователя сбрасываются при выходе из системы, и токены удаляются из `localStorage`.

### 5. **Компоненты**
   - **App.vue**: Главный компонент приложения, содержащий навигационное меню и управляющий общими маршрутами.
   - **SignUp.vue**: Компонент регистрации с формой для ввода email и пароля.
   - **SignIn.vue**: Компонент входа с формой для ввода email и пароля.
   - **Cars.vue**: Компонент отображения списка автомобилей для аутентифицированных пользователей.
   - **Loader.vue**: Компонент для отображения загрузки.

## Основные технологии

- **Vue 3**: основа фронтенд-приложения.
- **Pinia**: управление состоянием приложения.
- **Firebase**: аутентификация пользователей и база данных.
- **Axios**: для выполнения HTTP-запросов.
- **Vue Router**: для маршрутизации.
- **PrimeVue**: UI-компоненты для создания интерфейсов.

## Установка и запуск

### 1. Клонирование репозитория

```bash
git clone https://github.com/your-repo/vue3-jwt-pinia.git
cd vue3-jwt-pinia
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Конфигурация Firebase

Создайте файл `.env` в корневой директории проекта и добавьте свои Firebase ключи:

```bash
VITE_API_KEY_FIREBASE=your_firebase_api_key
```

### 4. Запуск приложения

```bash
npm run dev
```

## Структура проекта

```bash
├── src
│   ├── api.js             # Конфигурация Axios с перехватчиками
│   ├── main.js            # Главный файл приложения
│   ├── router
│   │   └── index.js       # Настройка маршрутизации
│   ├── stores
│   │   └── auth.js        # Pinia store для аутентификации
│   ├── views
│   │   ├── HomeView.vue   # Главная страница
│   │   ├── SignUp.vue     # Страница регистрации
│   │   ├── SignIn.vue     # Страница входа
│   │   ├── Cars.vue       # Страница списка автомобилей (только для аутентифицированных пользователей)
│   ├── components
│   │   └── Loader.vue     # Компонент загрузки
│   └── App.vue            # Главный компонент приложения
```

