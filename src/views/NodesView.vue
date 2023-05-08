<script setup>
import { reactive, ref } from "vue";
import {
  mdiMonitorCellphone,
  mdiTableBorder,
  mdiTableOff,
  mdiPlus,
} from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";
import NotificationBar from "@/components/NotificationBar.vue";
import TableNodes from "@/components/TableNodes.vue";
import CardBox from "@/components/CardBox.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import BaseButton from "@/components/BaseButton.vue";
import CardBoxComponentEmpty from "@/components/CardBoxComponentEmpty.vue";
import CardBoxModal from "@/components/CardBoxModal.vue";
import { useMainStore } from "@/stores/main";

const showCreateModal = ref(false);
const mainStore = useMainStore();

const form = reactive({
  name: "",
  description: "",
  server: "",
});

const confirm = () => {
  mainStore.createNode(form);
  showCreateModal.value = false;
};

</script>

<template>
  <CardBoxModal @confirm="confirm()" button-label="Create" title="Create Node" has-cancel v-model="showCreateModal">
    <CardBox>
      <FormField label="Name" help="name of server">
        <FormControl v-model="form.name" placeholder="Earth Server" />
      </FormField>
      <FormField label="Description" help="description of server">
        <FormControl v-model="form.description" placeholder="Server hosted on earth" />
      </FormField>
      <FormField label="Server" help="Domain of server">
        <FormControl v-model="form.server" placeholder="example.com" />
      </FormField>
    </CardBox>
  </CardBoxModal>

  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiTableBorder" title="Nodes" main>
        <BaseButton @click="showCreateModal = true" :icon="mdiPlus" label="Add" color="contrast" rounded-full small />
      </SectionTitleLineWithButton>

      <CardBox class="mb-6" has-table>
        <TableNodes checkable />
      </CardBox>

    </SectionMain>
  </LayoutAuthenticated>
</template>
