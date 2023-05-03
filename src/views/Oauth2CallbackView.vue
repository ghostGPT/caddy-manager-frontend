<script setup>
import SectionFullScreen from "@/components/SectionFullScreen.vue";
import BaseButton from "@/components/BaseButton.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";
import router from "@/router";
import { useMainStore } from "@/stores/main";

const mainStore = useMainStore();

const backToLogin = () => {
  router.push({ name: "login" });
};

const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get("code");
const state = urlParams.get("state");

mainStore.oauth2Callback(code, state);

</script>

<template>
  <LayoutGuest>
    <SectionFullScreen bg="purplePink">
      <div class="text-center">
        <h1>The page will be automatically redirected.</h1>
        <BaseButton class="mt-4" @click="backToLogin()" color="danger" label="Back to login" />
      </div>
    </SectionFullScreen>
  </LayoutGuest>
</template>
