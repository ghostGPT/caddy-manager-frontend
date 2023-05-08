<script setup>
import { reactive, ref } from "vue";
import {
  mdiMonitorCellphone,
  mdiTableBorder,
  mdiTableOff,
  mdiPlus,
  mdiMinus
} from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";
import TablePlans from "@/components/TablePlans.vue";
import CardBox from "@/components/CardBox.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import BaseButton from "@/components/BaseButton.vue";
import CardBoxModal from "@/components/CardBoxModal.vue";
import { useMainStore } from "@/stores/main";

const showCreateModal = ref(false);
const mainStore = useMainStore();

const newNode = ref("");

const form = reactive({
  name: "",
  description: "",
  nodes: [],
});

const confirm = () => {
  mainStore.createPlan(form);
  showCreateModal.value = false;
};

</script>

<template>
  <CardBoxModal @confirm="confirm()" button-label="Create" title="Create Plan" has-cancel v-model="showCreateModal">
    <CardBox>
      <FormField label="Name" help="name of plan">
        <FormControl v-model="form.name" placeholder="Default Plan" />
      </FormField>
      <FormField label="Description" help="description of plan">
        <FormControl v-model="form.description" placeholder="Plan for everyone" />
      </FormField>
      <div v-for="(item, index) in form.nodes">
        <FormControl disabled class="inline-block mr-4 w-10/12" v-model="form.nodes[index]" placeholder="Node UUID" />
        <BaseButton @click="form.nodes.splice(index, 1)" :icon="mdiMinus" color="danger" />
      </div>
      <div>
        <FormControl v-model="newNode" class="inline-block mr-4 w-10/12" placeholder="Node UUID" />
        <BaseButton @click="form.nodes.push(newNode.trim()); newNode = ''" :icon="mdiPlus" color="contrast" />
      </div>
    </CardBox>
  </CardBoxModal>

  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiTableBorder" title="Plans" main>
        <BaseButton @click="showCreateModal = true" :icon="mdiPlus" label="Add" color="contrast" rounded-full small />
      </SectionTitleLineWithButton>

      <CardBox class="mb-6" has-table>
        <TablePlans checkable />
      </CardBox>

    </SectionMain>
  </LayoutAuthenticated>
</template>
