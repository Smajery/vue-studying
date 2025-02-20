<template>
  <section>
    <div class="title-box">
      <h1>{{ CHART_TITLE }}</h1>
    </div>
    <div :id="CHART_ID" class="chart"></div>
  </section>
</template>

<script setup>
import { computed, onMounted, onUnmounted, watch } from 'vue';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { useStore } from 'vuex';
import { BANK_STATEMENT_STORE } from '@/utils/types/store.types.js';

const CHART_ID = 'xYChart';
const CHART_TITLE = `"Total Spent" Chart`;
const SELECTED_CATEGORY = 'category';
const X_AXIS_CATEGORY_FIELD = 'category';
const SERIES_NAME = 'Total Spent';
const SERIES_VALUE_Y_FIELD = 'total';
const SERIES_CATEGORY_X_FIELD = 'category';
const CHART_CURSOR_PROPERTY = 'cursor';

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

let root, chart, xAxis, series;

onMounted(() => {
  root = am5.Root.new(CHART_ID);

  root.setThemes([am5themes_Animated.new(root)]);

  chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panY: false,
      layout: root.verticalLayout,
    }),
  );

  let yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {}),
    }),
  );
  xAxis = chart.xAxes.push(
    am5xy.CategoryAxis.new(root, {
      renderer: am5xy.AxisRendererX.new(root, {}),
      categoryField: X_AXIS_CATEGORY_FIELD,
    }),
  );
  xAxis.data.setAll(chartData.value);

  series = chart.series.push(
    am5xy.ColumnSeries.new(root, {
      name: SERIES_NAME,
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: SERIES_VALUE_Y_FIELD,
      categoryXField: SERIES_CATEGORY_X_FIELD,
    }),
  );
  series.data.setAll(chartData.value);
  chart.set(CHART_CURSOR_PROPERTY, am5xy.XYCursor.new(root, {}));
});

onUnmounted(() => {
  if (root) {
    root.dispose();
  }
});

watch(chartData, (newChartData) => {
  series.data.setAll(newChartData);
  xAxis.data.setAll(newChartData);
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
