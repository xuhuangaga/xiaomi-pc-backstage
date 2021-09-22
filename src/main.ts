import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { toLine } from './utils'
import * as Icons from '@element-plus/icons'
import i18n from './language/index';




const app = createApp(App)
// el-icon-xxx
for (let i in Icons) {
  app.component(`el-icon${toLine(i)}`, (Icons as any)[i])
}

// use传的参数: 
// 1. 可以是一个函数 但这个函数必须叫install
// 2. 传入一个对象 但这个对象必须有一个属性叫install而且是函数
app.use(i18n);
app.use(router)
app.use(store)
app.use(ElementPlus, {
  locale: zhCn,
})
app.mount('#app')
