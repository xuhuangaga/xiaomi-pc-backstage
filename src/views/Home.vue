<template>
  <div class="bc-w home wbfb p-10">
    <div class="f-j-a f-c-w">
      <div class="h-o f-1 p-10">
        <div>{{ statistics.orderCount }}</div>
        <div class="m-t5">订单总数</div>
      </div>
      <div class="h-w f-1 p-10 m-lr10">
        <div>{{ statistics.goodsCount }}</div>
        <div class="m-t5">商品总数</div>
      </div>
      <div class="h-t f-1 p-10">
        <div>{{ statistics.userCount }}</div>
        <div class="m-t5">用户总数</div>
      </div>
    </div>
    <!-- 折线图 -->
    <div class="f-j-b m-t20">
      <Line
      v-if="hour.length && source.length"
        divId="main"
        title="今日订单"
        :legend="legend"
        :hour="hour"
        :source="source"
      ></Line>
      <Line
      v-if="hour.length && source1.length"
        divId="main1"
        title="今日销售额"
        :legend="legend1"
        :hour="hour"
        :source="source1"
      ></Line>
    </div>
    <!-- 饼图 -->
    <Cake class="m-t10"></Cake>
  </div>
</template>

<script lang='ts' setup>
import { onMounted, reactive, ref, defineComponent } from "vue";
import api from "../http/api";
import Cake from "../components/home/cake/cake.vue";
import Line from "../components/home/line/line.vue";
import dayjs from "dayjs";

let legend = ref(["订单量合计"]);
let legend1 = ref(["销售额合计"]);
//统计数据
let statistics = ref<any>({});
//当天的小时
let hour = ref<any>([]);

// 今日订单数据
let source = ref<any>([]);

// 今日销售额数据
let source1 = ref<any>([]);

onMounted(() => {
  for (let i = 1; i <= 24; i++) {
    hour.value.push(i);
  }
  //获取顶部统计数据
  api
    .getIndex()
    .then((res: any) => {
      if (res.code === 200) {
        statistics.value = res.data;
      }
    })
    .catch((err: any) => {
      console.log(err);
    });
  //获取订单数据和今日销售额数据
  api
    .getOrder({ current: 1, pageSize: 100000, query: "" })
    .then((res: any) => {
      if (res.code === 200) {
        hour.value.map((item: number, index: number) => {
          let timeStart =
            dayjs().format("YYYY-MM-DD ") +
            (item < 10 ? "0" + item : item) +
            ":00:00";
          let timeEnd =
            dayjs().format("YYYY-MM-DD ") +
            (item < 10 ? "0" + item : item) +
            ":59:59";
          let arr = res.data.filter((item: any) => {
            return (
              dayjs(item.pay_time).valueOf() >= dayjs(timeStart).valueOf() &&
              dayjs(item.pay_time).valueOf() <= dayjs(timeEnd).valueOf()
            );
          });
          //获取当日每个小时的订单数量
          source.value.push(arr.length);
          //获取当日每个小时的订单总额
          let total = 0;
          arr.map((item1: any) => {
            total += Number(item1.price);
          });
          source1.value.push(total);
        });
      }
    })
    .catch((err: any) => {
      console.log(err);
    });
});
</script>

<style lang='scss' scoped>
.home {
  .h-o {
    background: rgb(230, 66, 65);
  }
  .h-w {
    background: rgb(48, 185, 92);
  }
  .h-t {
    background: rgb(31, 45, 61);
  }
}
</style>