import { useMainStore } from "@/stores/main";
import axios from "axios";

const instance = axios.create();

instance.interceptors.request.use(
    (config) => {
        const mainStore = useMainStore();
        if (mainStore.user?.token) {
            config.headers.Authorization = mainStore.user?.token;
        }
        return config;
    }
);

instance.interceptors.response.use(
    (response) => {
        if (response.data?.error) {
            const mainStore = useMainStore();
            mainStore.pushError(response.data.error);
            return;
        }
        return response.data.data;
    }
);

export default instance;
