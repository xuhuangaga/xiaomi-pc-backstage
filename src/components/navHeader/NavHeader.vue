<template>
  <div class="header f-j-b">
    <div @click="toggle">
      <el-icon-expand v-if="isCollapse"></el-icon-expand>
      <el-icon-fold v-else></el-icon-fold>
    </div>
    <div class="f-a-c">
      <iframe class=" m-r20" width="200" height="24" frameBorder="0" scrolling="no" src="https://i.tianqi.com/?c=code&id=11"></iframe>
      <el-dropdown class="c-p">
        <div v-if="userInfo" class="f-j-c">
          <el-icon-avatar />
          <span class="m-l10">{{ userInfo.username }}</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="signout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dropdown class="c-p m-l10">
        <span class="el-dropdown-link">
          {{ locals }}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <template #dropdown>
          <el-dropdown-menu @click="change">
            <el-dropdown-item>中文</el-dropdown-item>
            <el-dropdown-item>英文</el-dropdown-item>
            <el-dropdown-item>繁体</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

//用户信息
let userInfo = ref(JSON.parse(localStorage.getItem("xiaomi-pc-admin")!));
let router = useRouter();
const { locale } = useI18n();
let locals = ref("中文");
let props = defineProps({
  isCollapse: {
    type: Boolean,
    default: false
  }
});
let emits = defineEmits(["update:isCollapse"]);

let toggle = () => {
  emits("update:isCollapse", !props.isCollapse);
};
//切换语言
const change = (e: any) => {
  let name = e.target.innerText;
  let desc = "";
  if (name === "中文") desc = "zh-CN";
  else if (name === "英文") desc = "en-US";
  else desc = "zh-TW";
  locals.value = name;
  locale.value = desc;
  localStorage.setItem("language", desc);
};

//点击退出登录
const signout = () => {
  localStorage.removeItem("xiaomi-pc-admin");
  router.push("/login");
};
</script>

<style lang='scss' scoped>
svg {
  width: 20px;
  height: 20px;
}
.header {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 20px;
}
</style>