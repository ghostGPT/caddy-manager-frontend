import { defineStore } from "pinia";
import axios from "@/utils/axios";
import router from "@/router";

export const useMainStore = defineStore("main", {
  persist: {
    enabled: true
  },
  state: () => ({
    userGitHubId: null,
    userName: null,
    userAvatar: null,
    isAdmin: null,
    token: null,

    /* Field focus with ctrl+k (to register only once) */
    isFieldFocusRegistered: false,

    /* Sample data (commonly used) */
    clients: [],
    history: [],
  }),
  actions: {
    setUser(payload) {
      this.userName = payload?.name;
      this.userAvatar = payload?.avatar;
      this.userGitHubId = payload?.github_id;
      this.isAdmin = payload?.is_admin;
      this.token = payload?.token;
    },

    oauth2Login() {
      axios
        .get(`/api/oauth2`)
        .then((data) => {
          localStorage.setItem("csrf_state_id", data.csrf_state_id);
          window.location.href = data.auth_url;
        })
        .catch((error) => {
          alert(error.message);
        });
    },

    oauth2Callback(code, state) {
      axios
        .post(`/api/oauth2`, {
          code: code,
          csrf_state: state,
          csrf_state_id: localStorage.getItem("csrf_state_id"),
        })
        .then((data) => {
          this.setUser(data);
          router.push("/");
        })
        .catch((error) => {
          alert(error.message);
        });
    }
  },
});
