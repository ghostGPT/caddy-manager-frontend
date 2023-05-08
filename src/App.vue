<script setup>
import { RouterView } from "vue-router";
import { useMainStore } from "./stores/main";
import { computed, onMounted } from "vue";
import CardBoxModal from "@/components/CardBoxModal.vue";

const mainStore = useMainStore();

const error = computed(() => {
  return mainStore.errors[0];
});

onMounted(() => {
  mainStore.init();
});

</script>

<template>
  <CardBoxModal :model-value="true" @confirm="mainStore.removeError(error.id)" v-if="error" title="Unhandled exception"
    button="Ok">
    <p>{{ error.msg }}</p>
  </CardBoxModal>
  <RouterView />
</template>
