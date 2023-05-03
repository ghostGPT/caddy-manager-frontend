<script setup>
import SectionFullScreen from "@/components/SectionFullScreen.vue";
import CardBox from "@/components/CardBox.vue";
import BaseButton from "@/components/BaseButton.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";
import { useMainStore } from "@/stores/main";
import { mdiGithub } from "@mdi/js";

const store = useMainStore();

const login = () => {
  store.oauth2Login();
};
</script>

<template>
  <LayoutGuest>
    <SectionFullScreen bg="purplePink">
      <BaseButton @click="login()" :icon="mdiGithub" color="danger" label="Login With GitHub" />
    </SectionFullScreen>
  </LayoutGuest>
</template>
