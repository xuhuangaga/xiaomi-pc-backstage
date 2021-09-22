<template>
  <div>
    <el-select v-model="parentId" placeholder="请选择" @change="change">
      <el-option
        v-for="item in product"
        :key="item._id"
        :label="item.name"
        :value="item._id"
      >
      </el-option>
    </el-select>
  </div>
  <div id="div" class="m-t20 p-r" style="z-index:0">
  </div>
  <div class="f-j-e m-t20">
    <el-button type="primary" @click="submit">确定</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "../../http/api";
import E from "wangeditor";
import {ElMessage} from 'element-plus'

//选择的商品id
let parentId = ref("");
//编辑器内容
let details = ref("");
//产品列表
let product = ref<any>([]);
let editor1 = ref<any>(null);
//选择商品触发
const change = () => {
  api.getSpecParams({ parentId: parentId.value }).then((res: any) => {
    if (res.code === 200) {
       editor1.value.txt.html(res.data)
    }
  });
};
//获取商品数据
const getProduct = () => {
  //获取商品数据
  api
    .getGoods({
      current: 1,
      pageSize: 100000,
      query: ""
    })
    .then((res: any) => {
      if (res.code === 200) {
        product.value = res.data;
      }
    })
    .catch((err: any) => {
      console.log(err);
    });
};
//点击确定
const submit=()=>{
  api.addSpecParams({parentId:parentId.value, specParams:details.value})
  .then((res:any)=>{
    if(res.code===200) {
      ElMessage.success('编辑成功')
      details.value=""
      parentId.value=""
      editor1.value.txt.html('')
    }else ElMessage.error(res.msg)
  })
}
onMounted(() => {
  getProduct();
  const editor = new E("#div");
  editor.config.onchange = (newHtml: any) => {
    details.value = newHtml;
  };
  editor1.value = editor;
  editor.create();
});
</script>

<style lang="scss" scoped>
</style>