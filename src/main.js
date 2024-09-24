import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { initializeApp } from "firebase/app";
import './api'

import App from "./App.vue";
import router from "./router";

const firebaseConfig = {
  apiKey: "AIzaSyAS_BRgXKoue7kGxEIPc1XzV2idSmiKCnA",
  authDomain: "vue3-jwt-pinia.firebaseapp.com",
  databaseURL: "https://vue3-jwt-pinia-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "vue3-jwt-pinia",
  storageBucket: "vue3-jwt-pinia.appspot.com",
  messagingSenderId: "750520181105",
  appId: "1:750520181105:web:5a8458ac3dd797b54296d0",
};

initializeApp(firebaseConfig);

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});

app.mount("#app");
