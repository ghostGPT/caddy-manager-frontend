<script setup>
import { computed, reactive, ref } from "vue";
import { useMainStore } from "@/stores/main";
import { mdiNoteEdit, mdiTrashCan, mdiPlus } from "@mdi/js";
import CardBoxModal from "@/components/CardBoxModal.vue";
import TableCheckboxCell from "@/components/TableCheckboxCell.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import CardBox from "@/components/CardBox.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";

defineProps({
  checkable: Boolean,
});

const mainStore = useMainStore();

const items = computed(() => mainStore.plans);

const isModalActive = ref(false);

const isModalDangerActive = ref(false);

const perPage = ref(5);

const currentPage = ref(0);

const checkedRows = ref([]);

const itemsPaginated = computed(() =>
  items.value.slice(
    perPage.value * currentPage.value,
    perPage.value * (currentPage.value + 1)
  )
);

const numPages = computed(() => Math.ceil(items.value.length / perPage.value));

const currentPageHuman = computed(() => currentPage.value + 1);

const pagesList = computed(() => {
  const pagesList = [];

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i);
  }

  return pagesList;
});

const remove = (arr, cb) => {
  const newArr = [];

  arr.forEach((item) => {
    if (!cb(item)) {
      newArr.push(item);
    }
  });

  return newArr;
};

const checked = (isChecked, client) => {
  if (isChecked) {
    checkedRows.value.push(client);
  } else {
    checkedRows.value = remove(
      checkedRows.value,
      (row) => row.id === client.id
    );
  }
};

const newNode = ref("");

const form = reactive({
  uuid: "",
  name: "",
  description: "",
  nodes: [],
});

const confirm = () => {
  mainStore.patchPlan(form);
  isModalActive.value = false;
};

const itemToDelete = ref(null);

const confirmDelete = () => {
  mainStore.deletePlan(itemToDelete.value);
  isModalDangerActive.value = false;
};

const onUpdate = (payload) => {
  form.uuid = payload.plan.uuid;
  form.name = payload.plan.name;
  form.description = payload.plan.description;
  form.nodes = payload.nodes.map((n) => n.uuid);
  isModalActive.value = true;
}
</script>

<template>
  <CardBoxModal :confirm-disabled="!form.nodes.length" @confirm="confirm()" button-label="Update" title="Update Plan"
    has-cancel v-model="isModalActive">
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
        <BaseButton :disabled="!newNode.trim().length" @click="form.nodes.push(newNode.trim()); newNode = ''"
          :icon="mdiPlus" color="contrast" />
      </div>
    </CardBox>
  </CardBoxModal>

  <CardBoxModal @confirm="confirmDelete()" v-model="isModalDangerActive" button-label="Delete" title="Confirm Delete"
    button="denger" has-cancel>
    <p>Confirm to delete plan: {{ itemToDelete?.name }}</p>
  </CardBoxModal>

  <div v-if="checkedRows.length" class="p-3 bg-gray-100/50 dark:bg-slate-800">
    <span v-for="checkedRow in checkedRows" :key="checkedRow.id"
      class="inline-block px-2 py-1 rounded-sm mr-2 text-sm bg-gray-100 dark:bg-slate-700">
      {{ checkedRow.name }}
    </span>
  </div>

  <table>
    <thead>
      <tr>
        <th v-if="checkable" />
        <th />
        <th>Name</th>
        <th>Description</th>
        <th>Nodes</th>
        <th v-if="mainStore.user?.is_admin">UUID</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-for="client in itemsPaginated" :key="client.plan.uuid">
        <TableCheckboxCell v-if="checkable" @checked="checked($event, client)" />
        <td class="border-b-0 lg:w-6 before:hidden">
          <UserAvatar :name="client.plan.name" class="w-24 h-24 mx-auto lg:w-6 lg:h-6" />
        </td>
        <td data-label="Name">
          {{ client.plan.name }}
        </td>
        <td data-label="Company">
          {{ client.plan.description }}
        </td>
        <td data-label="Nodes">
          {{ client.nodes.map((n) => n.name).join(", ") }}
        </td>
        <td v-if="mainStore.user?.is_admin" data-label="UUID">
          {{ client.plan.uuid }}
        </td>
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton color="info" :icon="mdiNoteEdit" small @click="onUpdate(client)" />
            <BaseButton color="danger" :icon="mdiTrashCan" small
              @click="itemToDelete = client.plan; isModalDangerActive = true" />
          </BaseButtons>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
    <BaseLevel>
      <BaseButtons>
        <BaseButton v-for="page in pagesList" :key="page" :active="page === currentPage" :label="page + 1"
          :color="page === currentPage ? 'lightDark' : 'whiteDark'" small @click="currentPage = page" />
      </BaseButtons>
      <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
    </BaseLevel>
  </div>
</template>
