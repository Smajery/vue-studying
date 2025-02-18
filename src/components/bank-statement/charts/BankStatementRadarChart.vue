<template>
  <section>
    <div class="title-box">
      <h1>{{ CHART_TITLE }}</h1>
    </div>
    <div ref="radarChart" class="radar-chart"></div>
  </section>
</template>

<script setup>
import { computed, onUnmounted, ref, watch } from 'vue';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import * as am5radar from '@amcharts/amcharts5/radar';
import { useStore } from 'vuex';
import { BANK_STATEMENT_STORE } from '@/utils/types/store.types.js';

const CHART_TITLE = `"Year Spent" Chart`;
const CORRECT_CATEGORY = 'date';
const DISPLAYED_YEAR = '2024'; // yyyy
const Y_AXIS_GET_TYPE = 'renderer';
const X_AXIS_GET_TYPE = 'renderer';
const SERIES_GET_TYPE = 'tooltip';
const SERIES_LABEL_TYPE = 'text';
const SERIES_LABEL_TEXT = '[bold]{name}[/]\n{valueX.formatDate()}: {valueY}';
const CREATE_SERIES_NAME = 'Series #1';
const CREATE_SERIES_FIELD = 'total';
const CHART_SET_TYPE = 'cursor';
const X_AXIS_SET_TYPE = 'tooltip';
const Y_AXIS_SET_TYPE = 'tooltip';
const X_AXIS_TOOLTIP_SETTINGS = {
  themeTags: ['axis'],
};
const Y_AXIS_TOOLTIP_SETTINGS = {
  themeTags: ['axis'],
};

const radarChart = ref(null);
let root = null;

const store = useStore();

const datesWithTotal = computed(
  () => store.getters[BANK_STATEMENT_STORE.CATEGORIES_WITH_TOTAL],
);
const datesWithTotalValue = computed(() =>
  datesWithTotal.value(CORRECT_CATEGORY),
);

const createRadarChart = () => {
  if (!radarChart.value || Object.keys(datesWithTotalValue.value).length === 0)
    return;

  root = am5.Root.new(radarChart.value);

  const yAxisSettings = {
    extraTooltipPrecision: 1,
    renderer: am5radar.AxisRendererRadial.new(root, {
      minGridDistance: 20,
    }),
  };
  const xAxisSettings = {
    baseInterval: { timeUnit: 'month', count: 1 },
    renderer: am5radar.AxisRendererCircular.new(root, {
      minGridDistance: 20,
      cellStartLocation: 0.2,
      cellEndLocation: 0.8,
    }),
  };

  let chart = root.container.children.push(
    am5radar.RadarChart.new(root, {
      layout: root.horizontalLayout,
    }),
  );

  let data = Object.keys(datesWithTotalValue.value)
    .filter((date) => date.startsWith(DISPLAYED_YEAR))
    .map((date) => ({
      date: new Date(date).getTime(),
      total: datesWithTotalValue.value[date],
    }));

  let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, yAxisSettings));

  yAxis.get(Y_AXIS_GET_TYPE).labels.template.setAll({
    visible: false,
  });

  let xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, xAxisSettings));

  xAxis.get(X_AXIS_GET_TYPE).labels.template.setAll({
    fontSize: 12,
  });

  const createSeries = (name, field) => {
    let series = chart.series.push(
      am5radar.RadarColumnSeries.new(root, {
        name: name,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: field,
        valueXField: CORRECT_CATEGORY,
        tooltip: am5.Tooltip.new(root, {}),
        clustered: true,
      }),
    );

    series.get(SERIES_GET_TYPE).label.set(SERIES_LABEL_TYPE, SERIES_LABEL_TEXT);
    series.data.setAll(data);
  };

  createSeries(CREATE_SERIES_NAME, CREATE_SERIES_FIELD);

  const CHART_CURSOR_SETTINGS = {
    behavior: 'zoomX',
    xAxis: xAxis,
  };

  chart.set(
    CHART_SET_TYPE,
    am5radar.RadarCursor.new(root, CHART_CURSOR_SETTINGS),
  );

  xAxis.set(X_AXIS_SET_TYPE, am5.Tooltip.new(root, X_AXIS_TOOLTIP_SETTINGS));

  yAxis.set(Y_AXIS_SET_TYPE, am5.Tooltip.new(root, Y_AXIS_TOOLTIP_SETTINGS));
};

watch(datesWithTotalValue, (newValue) => {
  if (newValue && Object.keys(newValue).length > 0) {
    createRadarChart();
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
.radar-chart {
  width: 100%;
  height: 500px;
}
</style>
