<template>
  <el-menu
    :uniqueOpened="true"
    class="el-menu"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    :collapse="isCollapse"
    router
    :default-active="route.path"
  >
    <template v-for="(item, index) in NavArray" :key="index">
        <el-menu-item :index="item.path" v-if="!item.children">
          <component :is="item.icon"></component>
          <template #title>{{$t(item.t)}}</template>
        </el-menu-item>
      <el-sub-menu :index="item.path" v-else>
        <template #title>
          <component :is="item.icon"></component>
          <span>{{$t(item.t)}}</span>
        </template>
         <el-menu-item :index="item1.path" v-for="(item1,index1) in item.children" :key="index1">
           <component :is="item1.icon"></component>
          <template #title>{{$t(item1.t)}}</template>
          </el-menu-item>
      </el-sub-menu>
    </template>
  </el-menu>
</template>

<script lang='ts' setup>
import { NavArray } from "../../types/index";
import {useRoute} from 'vue-router'
import { ref, reactive } from 'vue'
import i18n from '../../language/index'

let route=useRoute()
let props = defineProps({
  isCollapse: {
    type: Boolean,
    default: false
  }
});
</script>

<style lang='scss' scoped>
.el-menu:not(.el-menu--collapse) {
  width: 200px;
}
svg {
  width: 1rem;
  height: 1rem;
  margin-right: 5px;
}
</style>