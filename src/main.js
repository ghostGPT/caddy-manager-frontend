import { createApp } from "vue";
import { createPinia } from "pinia";
import axios from "axios";
import piniaPersist from 'pinia-plugin-persist'

import App from "./App.vue";
import router from "./router";
import { useMainStore } from "@/stores/main.js";
import { useStyleStore } from "@/stores/style.js";
import { darkModeKey, styleKey } from "@/config.js";

import "./css/main.css";

const app = createApp(App);

app.mixin({
  methods: {
    formatBytes(bytes, decimals = 2) {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    }
  }
})

/* Init Pinia */
const pinia = createPinia();
pinia.use(piniaPersist)
app.use(pinia);

/* Init Pinia stores */
const mainStore = useMainStore(pinia);
const styleStore = useStyleStore(pinia);

/* App style */
styleStore.setStyle(localStorage[styleKey] ?? "white");

/* Dark mode */
if (
  (!localStorage[darkModeKey] &&
    window.matchMedia("(prefers-color-scheme: dark)").matches) ||
  localStorage[darkModeKey] === "1"
) {
  styleStore.setDarkMode(true);
}

axios.get("/api/site/config").then((data) => {
  const defaultDocumentTitle = data.data.data.site_name;

  router.beforeEach((to, from, next) => {
    if (["login", "oauth2-callback"].indexOf(to.name) == -1 && !mainStore.user?.token) {
      next({ name: "login" });
    } else {
      next();
    }
  });

  router.afterEach((to) => {
    document.title = to.meta?.title
      ? `${to.meta.title} — ${defaultDocumentTitle}`
      : defaultDocumentTitle;
  });

  app.use(router).mount("#app");
});
