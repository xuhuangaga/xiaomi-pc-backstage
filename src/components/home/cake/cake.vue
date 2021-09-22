<template>
  <div ref="chartDom" id="cake"></div>
</template>

<script setup lang="ts">
import api from "../../../http/api";
import * as echarts from "echarts";
import { onMounted, reactive, ref } from "vue";

let arr = ref<any>([]);
let chartDom = ref<any>(null);
onMounted(() => {
  api
    .getCategory("")
    .then((res: any) => {
      // console.log(res);
      if (res.code === 200) {
        res.data.map((item: any) => {
          arr.value.push({ value: item.list.length, name: item.name });
        });
        
        let myChart = echarts.init(chartDom.value);
        
          myChart.setOption({
            title: {
              text: "商品分类",
              left: "left"
            },
            tooltip: {
              trigger: "item"
            },
            legend: {
              orient: "vertical",
              left: "left",
              top: 50
            },
            series: [
              {
                name: "访问来源",
                type: "pie",
                radius: "50%",
                data: arr.value,
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)"
                  }
                }
              }
            ]
          });
      }
    })
    .catch((err: any) => {
      console.log(err);
    });
});
</script>

<style scoped>
#cake {
  width: 1000px;
  height: 500px;
}
</style>
