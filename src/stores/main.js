import { defineStore } from "pinia";
import axios from "@/utils/axios";
import router from "@/router";

export const useMainStore = defineStore("main", {
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'main',
        storage: localStorage,
      },
    ],
  },
  state: () => ({
    user: null,

    /* Field focus with ctrl+k (to register only once) */
    isFieldFocusRegistered: false,

    /* Sample data (commonly used) */
    errors: [],
    nodes: [],
    plans: [],
    users: [],

    clients: [],
    history: [],
  }),
  actions: {
    init() {
      if (['/login', '/oauth2-callback'].indexOf(window.location.pathname) != -1) {
        return;
      }
      this.fetchCurrentUser().then(() => {
        this.fetchNodes();
        if (this.user?.is_admin) {
          this.fetchPlans();
          this.fetchUsers();
        }
      }).catch(() => {
        this.setUser(null);
        router.push({ name: "login" });
      })
    },

    fetchCurrentUser() {
      return new Promise((resolve, reject) => {
        axios
          .get(`/api/me`)
          .then((data) => {
            this.setUser(data);
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    },

    async fetchNodes() {
      let data = await axios
        .get(`/api/node`)
      this.nodes = data;
    },

    async fetchUsers() {
      let data = await axios
        .get(`/api/user`)
      this.users = data;
    },

    fetchPlans() {
      axios
        .get(`/api/plan`)
        .then((data) => {
          this.plans = data;
        })
    },

    pushError(msg) {
      this.errors.push({
        id: new Date().getTime(),
        msg: msg,
      });
    },

    removeError(id) {
      this.errors = this.errors.filter((e) => e.id !== id);
    },

    setUser(payload) {
      if (!payload) {
        this.nodes = []
        this.plans = []
        this.users = []
      }
      this.user = payload
    },

    createNode(payload) {
      axios.post(`/api/node`, payload).then((data) => {
        this.nodes.push(data);
      })
    },

    createPlan(payload) {
      axios.post(`/api/plan`, payload).then((data) => {
        this.plans.push(data);
      })
    },

    oauth2Login() {
      axios
        .get(`/api/oauth2`)
        .then((data) => {
          localStorage.setItem("csrf_state_id", data.csrf_state_id);
          window.location.href = data.auth_url;
        })
    },

    oauth2Callback(code, state) {
      axios
        .post(`/api/oauth2`, {
          code: code,
          csrf_state: state,
          csrf_state_id: localStorage.getItem("csrf_state_id"),
        })
        .then(async (data) => {
          this.setUser(data);
          await this.fetchNodes();
          router.push("/");
        })
    },

    async patchUser(payload) {
      const uuid = payload.uuid
      delete payload.uuid
      await axios
        .patch(`/api/user/${uuid}`, payload)
      await this.fetchUsers()
    },

    async patchNode(payload) {
      const uuid = payload.uuid
      delete payload.uuid
      await axios
        .patch(`/api/node/${uuid}`, payload)
      await this.fetchNodes()
    },

    async deleteNode(payload) {
      await axios
        .delete(`/api/node/${payload.uuid}`)
      await this.fetchNodes()
    },

    async patchPlan(payload) {
      const uuid = payload.uuid
      delete payload.uuid
      await axios
        .patch(`/api/plan/${uuid}`, payload)
      await this.fetchPlans()
    },

    async deletePlan(payload) {
      await axios
        .delete(`/api/plan/${payload.uuid}`)
      await this.fetchPlans()
    }
  },

});
