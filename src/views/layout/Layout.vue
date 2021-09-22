<template>
  <el-container>
    <el-aside width="auto">
      <nav-left :isCollapse="isCollapse"></nav-left>
    </el-aside>
    <el-container>
      <el-header>
        <nav-header v-model:isCollapse="isCollapse"></nav-header>
      </el-header>
      <el-main class="bc-e">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import NavHeader from "../../components/navHeader/NavHeader.vue";
import NavLeft from "../../components/navLeft/NavLeft.vue";

interface Data {
  name: string;
  age: number;
}

let isCollapse = ref<boolean>(false);
// let data = reactive<Data>({
//   name: 'jack',
//   age: 20
// })
</script>

<style scoped lang="scss">
.el-header {
  height: 50px;
  padding: 0;
}
</style>