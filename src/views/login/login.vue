<template>
  <div class="login f-j-c">
    <div class="container">
      <div class="f-w-b f-s20 t-a-c">小米 Lite</div>
      <div class="f-s14 t-a-c f-c-9 m-t-b10">欢迎来到小米 lite后台管理系统</div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="loginForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model.trim="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model.trim="ruleForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Data {
  username: string;
  password: string;
}
import { ref, reactive } from "vue";
import api from "../../http/api";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { useValidate } from "../../hooks/useValidate";

let ruleForm = reactive<Data>({
  username: "",
  password: ""
});
let loginForm = ref<any>(null);
let router = useRouter();
const rules = ref({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 10, message: "密码长度为6-10个字符", trigger: "blur" }
  ]
});

//点击登录
const submitForm = () => {
  useValidate(loginForm.value, () => {
    api
      .login(ruleForm)
      .then((res: any) => {
        // console.log(res);
        if (res.code === 200) {
          ElMessage.success("登录成功");
          localStorage.setItem("token", res.token);
          localStorage.setItem("xiaomi-pc-admin", JSON.stringify(res.data));
          setTimeout(() => {
            router.push("/");
          }, 1000);
        } else {
          ElMessage.error(res.msg);
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  });
};
</script>

<style lang="scss" scoped>
.login {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.container {
  width: 500px;
}
</style>