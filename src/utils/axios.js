import { useMainStore } from "@/stores/main";
import axios from "axios";

const instance = axios.create();

instance.interceptors.request.use(
    (config) => {
        const mainStore = useMainStore();
        if (mainStore.token) {
            config.headers.Authorization = mainStore.token;
        }
        return config;
    }
);

instance.interceptors.response.use(
    (response) => {
        if (response.data?.error) {
            throw new Error(response.data.error);
        }
        return response.data.data;
    }
);

export default instance;