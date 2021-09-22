<template>
  <div :id="props.divId" class="line"></div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { ref, onMounted } from "vue";

//接收父组件传递过来得值
let props = defineProps({
  divId: {
    type: String
  },
  title: {
    type: String
  },
  legend: {
    type: Array
  },
  hour: {
    type: Array
  },
  source: {
    type: Array
  }
});
let option = ref<any>({
  title: {
    text: props.title
  },
  legend: {
    data: props.legend
  },
  xAxis: {
    type: "category",
    data: props.hour
  },
  yAxis: {
    type: "value"
  },
  series: [
    {
      name: props.legend![0],
      data: props.source,
      type: "line"
    }
  ]
});

onMounted(() => {
  var chartDom = document.getElementById(props.divId!);
  var myChart = echarts.init(chartDom!)
  myChart.setOption(option.value);
});
</script>

<style scoped>
.line {
  width: 500px;
  height: 300px;
}
</style>