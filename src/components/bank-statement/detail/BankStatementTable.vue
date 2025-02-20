<template>
  <section>
    <ag-grid-vue
      class="bank-statement-table"
      @cellValueChanged="onCellValueChanged"
      :rowClassRules="rowClassRules"
      :rowData="bankStatement"
      :columnDefs="colDefs"
      :singleClickEdit="true"
      :pagination="true"
      :pinnedBottomRowData="pinnedBottomRowData"
    ></ag-grid-vue>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { AgGridVue } from 'ag-grid-vue3';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { useStore } from 'vuex';
import { computed } from 'vue';
import { BANK_STATEMENT_COL_DEFS } from '@/utils/constants/ag-grid/col-defs.constants.js';
import {
  COL_DEFS_FIELD_NAMES,
  COL_DEFS_FOOTER_NAMES,
} from '@/utils/types/ag-grid.types.js';
import { BANK_STATEMENT_STORE } from '@/utils/types/store.types.js';

ModuleRegistry.registerModules([AllCommunityModule]);

const rowClassRules = ref({
  'odd-row': (params) => params.node.rowIndex % 2 === 0,
});
const colDefs = ref(BANK_STATEMENT_COL_DEFS);

const store = useStore();

const bankStatement = computed(
  () => store.getters[BANK_STATEMENT_STORE.FULL_STATEMENT],
);
const totalAmount = computed(
  () => store.getters[BANK_STATEMENT_STORE.TOTAL_AMOUNT],
);
const getFixedTotal = (total) => {
  return total ? Number(total.toFixed(2)) : 0;
};
const pinnedBottomRowData = computed(() => [
  {
    [COL_DEFS_FIELD_NAMES.CATEGORY]: COL_DEFS_FOOTER_NAMES.TOTAL,
    [COL_DEFS_FIELD_NAMES.AMOUNT]: getFixedTotal(totalAmount.value),
  },
]);

const onCellValueChanged = (params) => {
  if (params.colDef.field === COL_DEFS_FIELD_NAMES.AMOUNT) {
    store.commit(BANK_STATEMENT_STORE.UPDATE_AMOUNT, {
      transactionId: params.data.transaction_id,
      newAmount: Number(params.newValue),
    });
  }
};
</script>

<style scoped>
.bank-statement-table {
  width: 100%;
  height: 500px;
}
.odd-row {
  background-color: #f9f9f9;
}
</style>
