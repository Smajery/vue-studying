<template>
  <div class="wrapper">
    <bank-statement-table></bank-statement-table>
    <bank-statement-x-y-chart></bank-statement-x-y-chart>
  </div>
</template>

<script setup>
import BankStatementTable from '@/components/bank-statement/detail/BankStatementTable.vue';
import BankStatementXYChart from '@/components/bank-statement/detail/BankStatementXYChart.vue';
import { useBankStatement } from '@/hooks/useBankStatement.js';
import { onMounted } from 'vue';

const { loadBankStatement, bankStatement } = useBankStatement();
onMounted(() => {
  if (!bankStatement.value || bankStatement.value.length === 0) {
    loadBankStatement();
  }
});
</script>

<style scoped>
.wrapper {
  padding: 40px 0 20px;
  display: flex;
  flex-direction: column;
}
</style>
