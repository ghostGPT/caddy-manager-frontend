import { createApp } from "vue";
import { createPinia } from "pinia";
import axios from "axios";
import piniaPersist from 'pinia-plugin-persist'
import { VueClipboard } from '@soerenmartius/vue3-clipboard'

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
    },
    timeago(date = '2020-01-01 00:00:00') {
      const seconds = Math.floor((new Date() - new Date(date)) / 1000);
      let interval = seconds / 31536000;
      if (interval > 1) {
        return Math.floor(interval) + " years ago";
      }
      interval = seconds / 2592000;
      if (interval > 1) {
        return Math.floor(interval) + " months ago";
      }
      interval = seconds / 86400;
      if (interval > 1) {
        return Math.floor(interval) + " days ago";
      }
      interval = seconds / 3600;
      if (interval > 1) {
        return Math.floor(interval) + " hours ago";
      }
      interval = seconds / 60;
      if (interval > 1) {
        return Math.floor(interval) + " minutes ago";
      }
      return Math.floor(seconds) + " seconds ago";
    }
  }
})

/* Init Pinia */
const pinia = createPinia();
pinia.use(piniaPersist)
app.use(pinia).use(VueClipboard);

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
  mainStore.version = data.data.data.version;
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
