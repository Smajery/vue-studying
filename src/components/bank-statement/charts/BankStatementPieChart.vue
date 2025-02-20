<template>
  <section>
    <div class="title-box">
      <h1>{{ CHART_TITLE }}</h1>
    </div>
    <div :id="CHART_ID" class="pie-chart"></div>
  </section>
</template>

<script setup>
import { computed, onMounted, onUnmounted, watch } from 'vue';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import { useStore } from 'vuex';
import { BANK_STATEMENT_STORE } from '@/utils/types/store.types.js';

const CHART_ID = 'pieChart';
const CHART_TITLE = `"Subcategories Spent" Chart`;
const SELECTED_CATEGORY = 'subcategory';
const SERIES_NAME = 'Series';
const SERIES_VALUE_FIELD = 'total';
const SERIES_CATEGORY_FIELD = 'subcategory';

const store = useStore();

const categoriesWithTotal = computed(() =>
  store.getters[BANK_STATEMENT_STORE.CATEGORIES_WITH_TOTAL](SELECTED_CATEGORY),
);
const chartData = computed(() =>
  Object.entries(categoriesWithTotal.value).map(([category, total]) => ({
    category,
    total,
  })),
);

let root, chart, series;

onMounted(() => {
  root = am5.Root.new(CHART_ID);
  chart = root.container.children.push(
    am5percent.PieChart.new(root, {
      layout: root.verticalLayout,
    }),
  );

  series = chart.series.push(
    am5percent.PieSeries.new(root, {
      name: SERIES_NAME,
      categoryField: SERIES_CATEGORY_FIELD,
      valueField: SERIES_VALUE_FIELD,
    }),
  );
  series.data.setAll(chartData.value);
});

onUnmounted(() => {
  if (root) {
    root.dispose();
  }
});

watch(chartData, (newChartData) => {
  series.data.setAll(newChartData);
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
