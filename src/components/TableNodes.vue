<script setup>
import { computed, reactive, ref } from "vue";
import { useMainStore } from "@/stores/main";
import { mdiNoteEdit, mdiTrashCan, mdiCheckCircle, mdiInformationSlabCircle } from "@mdi/js";
import CardBoxModal from "@/components/CardBoxModal.vue";
import TableCheckboxCell from "@/components/TableCheckboxCell.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import CardBox from "@/components/CardBox.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import BaseIcon from "./BaseIcon.vue";

defineProps({
  checkable: Boolean,
});

const mainStore = useMainStore();

const items = computed(() => mainStore.nodes);

const showDeleteModal = ref(false);

const showUpdateModal = ref(false);

const perPage = ref(5);

const currentPage = ref(0);

const checkedRows = ref([]);

const itemsPaginated = computed(() =>
  items.value?.slice(
    perPage.value * currentPage.value,
    perPage.value * (currentPage.value + 1)
  )
);

const numPages = computed(() => Math.ceil((items.value?.length ?? 0) / perPage.value));

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

const form = reactive({
  uuid: "",
  name: "",
  description: "",
  server: "",
});

const showUpdate = (client) => {
  form.uuid = client.uuid;
  form.name = client.name;
  form.description = client.description;
  form.server = client.server;
  showUpdateModal.value = true;
};

const itemToDelete = ref({})

const doUpdate = async () => {
  await mainStore.patchNode(form);
  showUpdateModal.value = false;
};

const doDelete = async () => {
  await mainStore.deleteNode(itemToDelete.value);
  showDeleteModal.value = false;
}
</script>

<template>
  <CardBoxModal @confirm="doUpdate()" button-label="Update" title="Update Node" has-cancel v-model="showUpdateModal">
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

  <CardBoxModal @confirm="doDelete()" v-model="showDeleteModal" button-label="Delete" title="Confirm Delete"
    button="danger" has-cancel>
    <p>Confirm to delete node: {{ itemToDelete.name }}</p>
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
        <th v-if="mainStore.user?.is_admin">UUID</th>
        <th>Server</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-for="client in itemsPaginated" :key="client.uuid">
        <TableCheckboxCell v-if="checkable" @checked="checked($event, client)" />
        <td class="border-b-0 lg:w-6 before:hidden">
          <BaseIcon v-if="client.online" :path="mdiCheckCircle" class="text-green-600"/>
          <BaseIcon v-else :path="mdiInformationSlabCircle" class="text-red-600" />
        </td>
        <td data-label="Name">
          {{ client.name }}
        </td>
        <td data-label="Description">
          {{ client.description }}
        </td>
        <td v-if="mainStore.user?.is_admin" data-label="UUID">
          {{ client.uuid }}
        </td>
        <td data-label="Server">
          {{ client.server }}
        </td>
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton color="info" :icon="mdiNoteEdit" small @click="showUpdate(client)" />
            <BaseButton color="danger" :icon="mdiTrashCan" small @click="itemToDelete = client; showDeleteModal = true" />
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
