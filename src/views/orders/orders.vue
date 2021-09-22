<template>
  <div class="f-a-c m-b10">
    <el-input v-model="query" placeholder="请输入" style="width:300px">
      <template #append>
        <el-button icon="el-icon-search" @click="search"></el-button>
      </template>
    </el-input>
  </div>
  <el-table
    ref="singleTable"
    :data="list"
    highlight-current-row
    style="width: 100%"
  >
    <el-table-column label="用户id" property="user_id"> </el-table-column>
    <el-table-column property="pay_time" label="订单日期">
    </el-table-column>
    <el-table-column property="count" label="商品数量">
    </el-table-column>
    <el-table-column property="price" label="订单价格">
    </el-table-column>
    <el-table-column property="number" label="商品名称" width="210">
      <template #default="scope">
        <div v-for="(item,index) in scope.row.goods_list" style="text-align:left" class="m-t-b5">
          {{index+1}}.{{item.goods.name}}
        </div>
      </template>
    </el-table-column>
    <el-table-column label="订单地址" width="210">
      <template #default="scope">
        {{scope.row.address.split(',').join('')}}
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <div class="m-t10 t-a-r">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="current"
      :page-sizes="[5, 10, 20, 30]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script setup lang="ts">
import api from "../../http/api";
import { ref, onMounted, defineComponent } from "vue";
import { ElMessage } from "element-plus";
import dayjs from "dayjs";

//搜索内容
let query = ref("");
//当前页码
let current = ref(1);
//每页显示条数
let pageSize = ref(10);
//数据总条数
let total = ref(0);
//获取订单列表
let list = ref<any>([]);
//点击搜索
const search = () => {
  getData();
};
//选择每页多少条
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  getData();
};
//选择第几页
const handleCurrentChange = (val: number) => {
  current.value = val;
  getData();
};
//获取数据
const getData = () => {
  //获取订单数据
  api
    .getOrder({
      current: current.value,
      pageSize: pageSize.value,
      query: query.value
    })
    .then((res: any) => {
      if (res.code === 200) {
        list.value = res.data;
        list.value.map((item: any) => {
          item.pay_time = dayjs(item.pay_time).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        });
        total.value = res.total;
      }
    })
    .catch((err: any) => {
      console.log(err);
    });
};
onMounted(() => {
  getData();
});
</script>


<style lang="scss" scoped>
</style>