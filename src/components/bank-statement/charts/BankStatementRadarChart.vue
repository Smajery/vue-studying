<template>
  <section>
    <div class="title-box">
      <h1>{{ CHART_TITLE }}</h1>
    </div>
    <div :id="CHART_ID" class="radar-chart"></div>
  </section>
</template>

<script setup>
import { computed, onMounted, onUnmounted, watch } from 'vue';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import * as am5radar from '@amcharts/amcharts5/radar';
import { useStore } from 'vuex';
import { BANK_STATEMENT_STORE } from '@/utils/types/store.types.js';

const CHART_ID = 'radarChart';
const CHART_TITLE = `"Year Spent" Chart`;
const SELECTED_CATEGORY = 'date';
const Y_AXIS_GET_TYPE = 'renderer';
const X_AXIS_GET_TYPE = 'renderer';
const SERIES_GET_TYPE = 'tooltip';
const SERIES_LABEL_TYPE = 'text';
const SERIES_LABEL_TEXT = '[bold]{name}[/]\n{valueX.formatDate()}: {valueY}';
const SERIES_NAME = 'Series #1';
const SERIES_VALUE_Y_FIELD = 'total';
const SERIES_VALUE_X_FIELD = 'date';
const CHART_CURSOR_PROPERTY = 'cursor';
const X_AXIS_SET_TYPE = 'tooltip';
const Y_AXIS_SET_TYPE = 'tooltip';

const store = useStore();

const categoriesWithTotal = computed(() =>
  store.getters[BANK_STATEMENT_STORE.CATEGORIES_WITH_TOTAL](SELECTED_CATEGORY),
);
const chartData = computed(() =>
  Object.entries(categoriesWithTotal.value).map(([date, total]) => ({
    date: new Date(date).getTime(),
    total,
  })),
);

let root, chart, xAxis, series;

onMounted(() => {
  root = am5.Root.new(CHART_ID);
  chart = root.container.children.push(
    am5radar.RadarChart.new(root, {
      layout: root.horizontalLayout,
    }),
  );

  let yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      extraTooltipPrecision: 1,
      renderer: am5radar.AxisRendererRadial.new(root, {
        minGridDistance: 20,
      }),
    }),
  );

  yAxis.get(Y_AXIS_GET_TYPE).labels.template.setAll({
    visible: false,
  });

  xAxis = chart.xAxes.push(
    am5xy.DateAxis.new(root, {
      baseInterval: { timeUnit: 'month', count: 1 },
      renderer: am5radar.AxisRendererCircular.new(root, {
        minGridDistance: 20,
        cellStartLocation: 0.2,
        cellEndLocation: 0.8,
      }),
    }),
  );

  xAxis.get(X_AXIS_GET_TYPE).labels.template.setAll({
    fontSize: 12,
  });

  series = chart.series.push(
    am5radar.RadarColumnSeries.new(root, {
      name: SERIES_NAME,
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: SERIES_VALUE_Y_FIELD,
      valueXField: SERIES_VALUE_X_FIELD,
      tooltip: am5.Tooltip.new(root, {}),
      clustered: true,
    }),
  );
  series.get(SERIES_GET_TYPE).label.set(SERIES_LABEL_TYPE, SERIES_LABEL_TEXT);
  series.data.setAll(chartData.value);

  chart.set(
    CHART_CURSOR_PROPERTY,
    am5radar.RadarCursor.new(root, {
      behavior: 'zoomX',
      xAxis: xAxis,
    }),
  );

  xAxis.set(
    X_AXIS_SET_TYPE,
    am5.Tooltip.new(root, {
      themeTags: ['axis'],
    }),
  );

  yAxis.set(
    Y_AXIS_SET_TYPE,
    am5.Tooltip.new(root, {
      themeTags: ['axis'],
    }),
  );
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
.radar-chart {
  width: 100%;
  height: 500px;
}
</style>
