<template>
  <div class="wrapper">
    <bank-statement-pie-chart></bank-statement-pie-chart>
    <bank-statement-radar-chart></bank-statement-radar-chart>
    <bank-statement-x-y-date-chart></bank-statement-x-y-date-chart>
  </div>
</template>

<script setup>
import BankStatementPieChart from '@/components/bank-statement/charts/BankStatementPieChart.vue';
import BankStatementRadarChart from '@/components/bank-statement/charts/BankStatementRadarChart.vue';
import BankStatementXYDateChart from '@/components/bank-statement/charts/BankStatementXYDateChart.vue';
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
  row-gap: 20px;
}
</style>
