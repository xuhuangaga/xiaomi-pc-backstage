<template>
    <router-view></router-view>
</template>


<style lang='scss'>
@import './styles/common';
* {
  margin: 0;
  padding: 0;
}
html, body, #app, .el-container, .el-menu {
  height: 100%;
}
.el-menu-item {
  height: 50px !important;
  line-height: 50px;
}
th {
  text-align: center !important;
}
td {
   text-align: center !important;
}
.el-sub-menu .el-menu-item {
  min-width: 199px !important;
}
.el-tabs__content {
  overflow: inherit !important;
}
</style>