<template>
  <section>
    <div class="title-box">
      <h1>{{ CHART_TITLE }}</h1>
    </div>
    <div ref="xYChart" class="chart"></div>
  </section>
</template>

<script setup>
import { ref, onBeforeUnmount, computed, watch } from 'vue';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { useStore } from 'vuex';
import { BANK_STATEMENT_STORE } from '@/utils/types/store.types.js';

const CHART_TITLE = `"Total Spent" Chart`;
const CORRECT_CATEGORY = 'category';
const CHART_NAME = 'Total Spent';
const CHART_VALUE_Y_FIELD = 'total';
const CHART_SET_TYPE = 'cursor';

const xYChart = ref(null);
let root = null;

const store = useStore();

const categoriesWithTotal = computed(
  () => store.getters[BANK_STATEMENT_STORE.CATEGORIES_WITH_TOTAL],
);
const categoriesWithTotalValue = computed(() =>
  categoriesWithTotal.value(CORRECT_CATEGORY),
);

const createChart = () => {
  if (
    !xYChart.value ||
    Object.keys(categoriesWithTotalValue.value).length === 0
  )
    return;

  if (root) {
    root.dispose();
    root = null;
  }

  root = am5.Root.new(xYChart.value);
  root.setThemes([am5themes_Animated.new(root)]);

  let chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panY: false,
      layout: root.verticalLayout,
    }),
  );

  let data = Object.entries(categoriesWithTotalValue.value).map(
    ([category, total]) => ({ category, total }),
  );

  let yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) }),
  );

  let xAxis = chart.xAxes.push(
    am5xy.CategoryAxis.new(root, {
      categoryField: CORRECT_CATEGORY,
      renderer: am5xy.AxisRendererX.new(root, {}),
    }),
  );

  xAxis.data.setAll(data);

  let series = chart.series.push(
    am5xy.ColumnSeries.new(root, {
      name: CHART_NAME,
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: CHART_VALUE_Y_FIELD,
      categoryXField: CORRECT_CATEGORY,
    }),
  );

  series.data.setAll(data);

  let legend = chart.children.push(am5.Legend.new(root, {}));
  legend.data.setAll(chart.series.values);

  chart.set(CHART_SET_TYPE, am5xy.XYCursor.new(root, {}));
};

watch(categoriesWithTotalValue, (newValue) => {
  if (newValue && Object.keys(newValue).length > 0) {
    createChart();
  }
});

onBeforeUnmount(() => {
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
.chart {
  width: 100%;
  height: 500px;
}
</style>
