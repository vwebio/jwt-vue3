<template>
  <h2>Вход</h2>
  <form class="flex flex-column gap-3">
    <!-- Ошибки от authStore (из Firebase) -->
    <Message v-if="authStore.error" severity="warn">{{ authStore.error }}</Message>
    <div class="p-inputgroup flex-1">
      <span class="p-inputgroup-addon">
          <i class="pi pi-user"></i>
      </span>
      <InputText type="email" v-model="email" placeholder="Ваш Email" />
    </div>
    <div class="p-inputgroup flex-1">
      <span class="p-inputgroup-addon">
          <i class="pi pi-at"></i>
      </span>
      <InputText type="password" v-model="password" placeholder="Пароль" />
    </div>
    <!-- Loader -->
    <Loader v-if="authStore.loader"/>
    <div v-else class="flex flex-column gap-3">
        <!-- Button -->
      <Button label="Войти" @click="signin"/>
      <span>Вы еще не зарегистрированы? <router-link to="/signup">Зарегистрироваться</router-link></span>
    </div>
  </form>
</template>

<script setup>
import {ref} from 'vue';
import {useAuthStore} from '../stores/auth';
import {useRouter} from 'vue-router'

import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Message from 'primevue/message';
import Loader from '../components/Loader.vue'

const authStore = useAuthStore();
const router = useRouter();

const email = ref();
const password = ref();

// Вход
const signin = async () => {
  try {
    await authStore.auth({email: email.value, password: password.value}, 'signin')
    router.push('/cars')
  } catch (error) {

    console.log('Ошибка входа: ', error);
  }
}
</script>

<style scoped>
.p-inputtext.p-component {
  width: 100%;
}
</style>