<template>
  <section>
    <div class="title-box">
      <h1>{{ CHART_TITLE }}</h1>
    </div>
    <div ref="pieChart" class="pie-chart"></div>
  </section>
</template>

<script setup>
import { computed, onUnmounted, ref, watch } from 'vue';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import { useStore } from 'vuex';
import { BANK_STATEMENT_STORE } from '@/utils/types/store.types.js';

const CHART_TITLE = `"Subcategories Spent" Chart`;
const CORRECT_CATEGORY = 'subcategory';
const CHART_NAME = 'Series';
const CHART_VALUE_FIELD = 'total';

const pieChart = ref(null);
let root = null;

const store = useStore();

const subcategoriesWithTotal = computed(
  () => store.getters[BANK_STATEMENT_STORE.CATEGORIES_WITH_TOTAL],
);
const subcategoriesWithTotalValue = computed(() =>
  subcategoriesWithTotal.value(CORRECT_CATEGORY),
);

const createPieChart = () => {
  if (
    !pieChart.value ||
    Object.keys(subcategoriesWithTotalValue.value).length === 0
  )
    return;

  root = am5.Root.new(pieChart.value);
  let chart = root.container.children.push(
    am5percent.PieChart.new(root, {
      layout: root.verticalLayout,
    }),
  );

  let data = Object.keys(subcategoriesWithTotalValue.value).map(
    (subcategory) => ({
      subcategory,
      total: subcategoriesWithTotalValue.value[subcategory],
    }),
  );

  let series = chart.series.push(
    am5percent.PieSeries.new(root, {
      name: CHART_NAME,
      categoryField: CORRECT_CATEGORY,
      valueField: CHART_VALUE_FIELD,
    }),
  );

  series.data.setAll(data);

  let legend = chart.children.push(
    am5.Legend.new(root, {
      centerX: am5.percent(50),
      x: am5.percent(50),
      layout: root.horizontalLayout,
    }),
  );

  legend.data.setAll(series.dataItems);
};

watch(subcategoriesWithTotalValue, (newValue) => {
  if (newValue && Object.keys(newValue).length > 0) {
    createPieChart();
  }
});

onUnmounted(() => {
  if (root) {
    root.dispose();
    root = null;
  }
});
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.title-box {
  padding: 20px 0 10px;
}
.title-box h1 {
  font-size: 2rem;
}
.pie-chart {
  width: 100%;
  height: 500px;
}
</style>
