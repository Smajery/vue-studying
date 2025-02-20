<template>
  <section>
    <div class="title-box">
      <h1>{{ CHART_TITLE }}</h1>
    </div>
    <div :id="CHART_ID" class="x-y-date-chart"></div>
  </section>
</template>

<script setup>
import { computed, onMounted, onUnmounted, watch } from 'vue';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import { useStore } from 'vuex';
import { BANK_STATEMENT_STORE } from '@/utils/types/store.types.js';

const CHART_ID = 'xYDateChart';
const CHART_TITLE = `"Year Spent" XY Chart`;
const SELECTED_CATEGORY = 'date';
const CHART_SETTINGS = {
  panX: true,
  panY: true,
  wheelX: 'panX',
  wheelY: 'zoomX',
};
const CHART_CURSOR_PROPERTY = 'cursor';
const CURSOR_LINE_Y_TYPE = 'visible';
const CHART_SET_TYPE = 'scrollbarX';
const SERIES_APPEAR_DURATION = 1000;
const SERIES_APPEAR_DELAY = 100;
const CHART_APPEAR_DURATION = 1000;
const CHART_APPEAR_DELAY = 100;

const store = useStore();

const categoriesWithTotal = computed(() =>
  store.getters[BANK_STATEMENT_STORE.CATEGORIES_WITH_TOTAL](SELECTED_CATEGORY),
);
const chartData = computed(() =>
  Object.entries(categoriesWithTotal.value)
    .map(([date, total]) => ({
      date: new Date(date).getTime(),
      total,
    }))
    .sort((a, b) => a.date - b.date),
);

let root, chart, xAxis, series;

onMounted(() => {
  root = am5.Root.new(CHART_ID);
  chart = root.container.children.push(am5xy.XYChart.new(root, CHART_SETTINGS));

  let easing = am5.ease.linear;

  let xAxis = chart.xAxes.push(
    am5xy.GaplessDateAxis.new(root, {
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
    }),
  );

  let yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      maxDeviation: 0.1,
      renderer: am5xy.AxisRendererY.new(root, {}),
    }),
  );

  series = chart.series.push(
    am5xy.LineSeries.new(root, {
      minBulletDistance: 10,
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: 'total',
      valueXField: 'date',
      tooltip: am5.Tooltip.new(root, {
        pointerOrientation: 'horizontal',
        labelText: '{valueY}',
      }),
    }),
  );

  series.bullets.push(function () {
    return am5.Bullet.new(root, {
      sprite: am5.Circle.new(root, {
        radius: 5,
        fill: series.get('fill'),
        stroke: root.interfaceColors.get('background'),
        strokeWidth: 2,
      }),
    });
  });
  series.data.setAll(chartData.value);

  let cursor = chart.set(
    CHART_CURSOR_PROPERTY,
    am5xy.XYCursor.new(root, {
      xAxis,
    }),
  );
  cursor.lineY.set(CURSOR_LINE_Y_TYPE, false);

  chart.set(
    CHART_SET_TYPE,
    am5.Scrollbar.new(root, {
      orientation: 'horizontal',
    }),
  );

  series.appear(SERIES_APPEAR_DURATION, SERIES_APPEAR_DELAY, easing);
  chart.appear(CHART_APPEAR_DURATION, CHART_APPEAR_DELAY, easing);
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
.x-y-date-chart {
  width: 100%;
  height: 500px;
}
</style>
