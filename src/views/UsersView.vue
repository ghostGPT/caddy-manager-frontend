<script setup>
import {
  mdiAccountMultiple
} from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";
import TableUsers from "@/components/TableUsers.vue";
import CardBox from "@/components/CardBox.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import { onMounted } from "vue";
import { useMainStore } from "@/stores/main";

const mainStore = useMainStore();

onMounted(() => {
  mainStore.fetchUsers();
});
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiAccountMultiple" title="Users" main>
        <span></span>
      </SectionTitleLineWithButton>

      <CardBox class="mb-6" has-table>
        <TableUsers checkable />
      </CardBox>

    </SectionMain>
  </LayoutAuthenticated>
</template>
