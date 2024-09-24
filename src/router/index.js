import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import SignUp from "../views/SignUp.vue";
import SignIn from "../views/SignIn.vue";
import Cars from "../views/Cars.vue";
import { useAuthStore } from "../stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/signup",
      name: "signup",
      component: SignUp,
      meta: {
        auth: false, // для не зарегистрированных
      },
    },
    {
      path: "/signin",
      name: "signin",
      component: SignIn,
      meta: {
        auth: false, // для не зарегистрированных
      },
    },
    {
      path: "/cars",
      name: "cars",
      component: Cars,
      meta: {
        auth: true, // для зарегистрированных
      },
    },
  ],
});

// Перед каждым переходом маршрута выполняется эта функция
router.beforeEach((to, from, next) => {
  // Получаем доступ к хранилищу аутентификации
  const authStore = useAuthStore();

  // Если маршрут требует аутентификации и пользователь не аутентифицирован
  if (to.meta.auth && !authStore.userInfo.token) {
    // Перенаправляем пользователя на страницу входа
    next("/signin");
  }
  // Если маршрут не требует аутентификации, но пользователь аутентифицирован
  else if (!to.meta.auth && authStore.userInfo.token) {
    // Перенаправляем пользователя на страницу с авто
    next("/cars");
  }
  // В остальных случаях продолжаем переход
  else {
    next();
  }
});

export default router;
