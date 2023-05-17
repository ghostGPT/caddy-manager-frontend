<script setup>
import { computed, ref } from "vue";
import { useMainStore } from "@/stores/main";
import { mdiTextBoxEdit } from "@mdi/js";
import CardBoxModal from "@/components/CardBoxModal.vue";
import TableCheckboxCell from "@/components/TableCheckboxCell.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import FormCheckRadioGroup from "@/components/FormCheckRadioGroup.vue";

defineProps({
  checkable: Boolean,
});

const mainStore = useMainStore();

const items = computed(() => mainStore.users);

const perPage = ref(20);

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

const updateUser = ref({});
const showUpdateModal = ref(false);

const confirm = async () => {
  updateUser.value.plans_uuid = updateUser.value.plans_uuid?.trim();
  if (!updateUser.value.plans_uuid) {
    updateUser.value.plans_uuid = null;
  }
  await mainStore.patchUser(updateUser.value);
  showUpdateModal.value = false;
};

</script>

<template>
  <CardBoxModal @confirm="confirm()" button-label="Update" title="Update User" has-cancel v-model="showUpdateModal">
    <CardBox>
      <FormField label="Label" help="label of user">
        <FormControl v-model="updateUser.label" placeholder="Guy" />
      </FormField>
      <FormField label="Plan" help="uuid of plan">
        <FormControl v-model="updateUser.plans_uuid" placeholder="Plan" />
      </FormField>
      <FormField label="Admin" help="Set user as admin">
        <FormCheckRadioGroup v-model="updateUser.is_admin" type="switch" name="notifications-switch"
          :options="{ outline: 'IsAdmin' }" />
      </FormField>
      <FormField label="Monthly Limit" help="monthly limit (bytes)">
        <FormControl type="number" v-model="updateUser.monthly_limit" placeholder="10000000" />
      </FormField>
    </CardBox>
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
        <th>Label</th>
        <th>Plan</th>
        <th>Usage</th>
        <th>Limit</th>
        <th>Latest Use</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-for="client in itemsPaginated" :key="client.uuid">
        <TableCheckboxCell v-if="checkable" @checked="checked($event, client)" />
        <td class="border-b-0 lg:w-6 before:hidden">
          <UserAvatar :avatar="client.avatar" class="w-24 h-24 mx-auto lg:w-6 lg:h-6" />
        </td>
        <td data-label="Name">
          {{ client.name }}
        </td>
        <td data-label="Label">
          {{ client.label }}
        </td>
        <td data-label="Plan">
          {{ client.plans_uuid }}
        </td>
        <td data-label="Usage">
          {{ formatBytes(client.monthly_usage) }}
        </td>
        <td data-label="Limit">
          {{ formatBytes(client.monthly_limit) }}
        </td>
        <td data-label="Latest">
          {{ timeago(client.updated_at) }}
        </td>
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton @click="updateUser = client; showUpdateModal = true" color="info" :icon="mdiTextBoxEdit" small />
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
