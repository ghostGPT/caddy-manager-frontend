<script setup>
import { containerMaxW } from "@/config.js";
import BaseLevel from "@/components/BaseLevel.vue";
import JustboilLogo from "@/components/JustboilLogo.vue";

const year = new Date().getFullYear();
</script>

<template>
  <footer class="py-2 px-6" :class="containerMaxW">
    <BaseLevel>
      <div class="text-center md:text-left">
        <b>&copy;{{ year }},
          CADDY MANAGER.</b>
        <slot />
      </div>
      <div class="md:py-2">
        <JustboilLogo class="w-auto h-8 md:h-6" />
      </div>
    </BaseLevel>
  </footer>
</template>
