<template>
  <div class="menu">
    <router-link class="menu__link" to="/">Главная</router-link>
    <router-link class="menu__link" to="/signup" v-if="!token">Регистрация</router-link>
    <router-link class="menu__link" to="/signin" v-if="!token">Вход</router-link>
    <router-link class="menu__link" to="/cars" v-if="token">Авто</router-link>
    <router-link class="menu__link" to="/signin" v-if="token" @click.prevent="logout">Выйти</router-link>
  </div>
  <div class="container">
    <RouterView />
  </div>
</template>

<script setup>
import {computed} from 'vue'
import {useAuthStore} from './stores/auth'
import { useRouter } from 'vue-router';

// Store для аутентификации
const authStore = useAuthStore()

// Роутер для навигации
const router = useRouter()

// Вычисляемое свойство для получения токена из store
const token = computed(() => authStore.userInfo.token);

// Проверка пользователя и обновления токенов из localStorage
const checkUser = () => {
  const tokens = JSON.parse(localStorage.getItem('userTokens'));
  if (tokens) {
    authStore.userInfo.token = tokens.token
    authStore.userInfo.refreshToken = tokens.refreshToken
  }
}

// Выход пользователя из системы
const logout = () => {
  authStore.logout() // вызываем метод logout из store
  localStorage.removeItem('userTokens') // удаляем токены из localStorage
  router.push('/signin') // перенаправляем пользователя на страницу входа
}

checkUser()
</script>

<style scoped>
.container {
  margin: auto;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  max-width: 700px;
}

.menu {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 20px;
}

.menu__link {
  color: #5bb6c5;
  margin: 0 20px;
  font-family: 'Arial', sans-serif;
  text-decoration: none;
}

.menu__link:hover {
  color: #91ced8;
  text-decoration: underline;
}
</style>
