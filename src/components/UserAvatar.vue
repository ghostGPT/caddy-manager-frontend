<script setup>
import { computed } from "vue";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: null,
  },
  api: {
    type: String,
    default: "avataaars",
  },
});

const avatar = computed(
  () =>
    props.avatar ??
    `https://avatars.dicebear.com/api/${props.api}/${props.name.replace(
      /[^a-z0-9]+/i,
      "-"
    )}.svg`
);

const name = computed(() => props.name);
</script>

<template>
  <div>
    <img :src="avatar" :alt="name" class="rounded-full block h-auto w-full max-w-full bg-gray-100 dark:bg-slate-800" />
    <slot />
  </div>
</template>
