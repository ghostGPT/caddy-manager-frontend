<script setup>
import { useMainStore } from "@/stores/main";
import UserAvatar from "@/components/UserAvatar.vue";

const mainStore = useMainStore();
</script>

<template>
  <UserAvatar :name="mainStore.user?.name" :avatar="mainStore.user?.avatar">
    <slot />
  </UserAvatar>
</template>
