import { createRouter, createWebHistory } from "vue-router";
import Style from "@/views/StyleView.vue";
import Home from "@/views/HomeView.vue";

const routes = [
  {
    meta: {
      title: "Login",
    },
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginView.vue"),
  },
  {
    meta: {
      title: "Oauth2 Callback",
    },
    path: "/oauth2-callback",
    name: "oauth2-callback",
    component: () => import("@/views/Oauth2CallbackView.vue"),
  },
  {
    // Document title tag
    // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
    meta: {
      title: "Dashboard",
    },
    path: "/",
    name: "dashboard",
    component: Home,
  },
  {
    meta: {
      title: "Nodes",
    },
    path: "/nodes",
    name: "nodes",
    component: () => import("@/views/NodesView.vue"),
  },
  {
    meta: {
      title: "Plans",
    },
    path: "/plans",
    name: "plans",
    component: () => import("@/views/PlansView.vue"),
  },
  {
    meta: {
      title: "Users",
    },
    path: "/users",
    name: "users",
    component: () => import("@/views/UsersView.vue"),
  },
  {
    meta: {
      title: "Error",
    },
    path: '/:pathMatch(.*)*',
    component: () => import("@/views/ErrorView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 };
  },
});

export default router;
