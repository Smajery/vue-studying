<template>
  <section>
    <div class="title-box">
      <h1>{{ CHART_TITLE }}</h1>
    </div>
    <div ref="xYDateChart" class="x-y-date-chart"></div>
  </section>
</template>

<script setup>
import { computed, onUnmounted, ref, watch } from 'vue';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import { useStore } from 'vuex';
import { BANK_STATEMENT_STORE } from '@/utils/types/store.types.js';

const CHART_TITLE = `"Year Spent" XY Chart`;
const CATEGORY_VALUE = 'date';
const DISPLAYED_YEAR = '2024'; // yyyy
const CHART_SETTINGS = {
  panX: true,
  panY: true,
  wheelX: 'panX',
  wheelY: 'zoomX',
};
const CURSOR_SET_TYPE = 'cursor';
const CURSOR_LINE_Y_TYPE = 'visible';
const CHART_SET_TYPE = 'scrollbarX';
const CHART_SCROLLBAR_SETTINGS = {
  orientation: 'horizontal',
};
const SERIES_APPEAR_DURATION = 1000;
const SERIES_APPEAR_DELAY = 100;
const CHART_APPEAR_DURATION = 1000;
const CHART_APPEAR_DELAY = 100;

const xYDateChart = ref(null);
let root = null;

const store = useStore();

const datesWithTotal = computed(
  () => store.getters[BANK_STATEMENT_STORE.CATEGORIES_WITH_TOTAL],
);
const datesWithTotalValue = computed(() =>
  datesWithTotal.value(CATEGORY_VALUE),
);

const createXYDateChart = () => {
  if (!xYDateChart.value || Object.keys(datesWithTotalValue.value).length === 0)
    return;

  root = am5.Root.new(xYDateChart.value);

  const xAxisSettings = {
    maxDeviation: 0.1,
    groupData: false,
    baseInterval: {
      timeUnit: 'day',
      count: 1,
    },
    renderer: am5xy.AxisRendererX.new(root, {
      minGridDistance: 50,
    }),
    tooltip: am5.Tooltip.new(root, {}),
  };
  const yAxisSettings = {
    maxDeviation: 0.1,
    renderer: am5xy.AxisRendererY.new(root, {}),
  };

  let chart = root.container.children.push(
    am5xy.XYChart.new(root, CHART_SETTINGS),
  );

  let easing = am5.ease.linear;

  let xAxis = chart.xAxes.push(am5xy.GaplessDateAxis.new(root, xAxisSettings));

  let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, yAxisSettings));

  const seriesSettings = {
    minBulletDistance: 10,
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: 'total',
    valueXField: 'date',
    tooltip: am5.Tooltip.new(root, {
      pointerOrientation: 'horizontal',
      labelText: '{valueY}',
    }),
  };

  let series = chart.series.push(am5xy.LineSeries.new(root, seriesSettings));

  let data = Object.keys(datesWithTotalValue.value)
    .filter((date) => date.startsWith(DISPLAYED_YEAR))
    .map((date) => ({
      date: new Date(date).getTime(),
      total: datesWithTotalValue.value[date],
    }))
    .sort((a, b) => a.date - b.date);

  series.data.setAll(data);

  const seriesBulletsSettings = {
    sprite: am5.Circle.new(root, {
      radius: 5,
      fill: series.get('fill'),
      stroke: root.interfaceColors.get('background'),
      strokeWidth: 2,
    }),
  };

  series.bullets.push(function () {
    return am5.Bullet.new(root, seriesBulletsSettings);
  });

  let cursor = chart.set(
    CURSOR_SET_TYPE,
    am5xy.XYCursor.new(root, {
      xAxis,
    }),
  );
  cursor.lineY.set(CURSOR_LINE_Y_TYPE, false);

  chart.set(CHART_SET_TYPE, am5.Scrollbar.new(root, CHART_SCROLLBAR_SETTINGS));

  series.appear(SERIES_APPEAR_DURATION, SERIES_APPEAR_DELAY, easing);
  chart.appear(CHART_APPEAR_DURATION, CHART_APPEAR_DELAY, easing);
};

watch(datesWithTotalValue, (newValue) => {
  if (newValue && Object.keys(newValue).length > 0) {
    createXYDateChart();
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
.x-y-date-chart {
  width: 100%;
  height: 500px;
}
</style>
