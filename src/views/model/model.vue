<template>
  <div class="f-a-c m-b10">
    <el-input v-model="query" placeholder="请输入" style="width:300px">
      <template #append>
        <el-button icon="el-icon-search" @click="search"></el-button>
      </template>
    </el-input>
    <div class="m-l10">
      <el-button type="primary" @click="add">添加模型</el-button>
    </div>
  </div>
  <el-table
    ref="singleTable"
    :data="list"
    highlight-current-row
    style="width: 100%"
  >
    <el-table-column type="index"></el-table-column>
    <el-table-column property="name" label="模型名称"> </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <div class="f-j-c">
          <el-button size="mini" @click="addSpec(scope.row)"
            >添加规格</el-button
          >
          <el-button type="primary" size="mini" @click="edit(scope.row)"
            >编辑</el-button
          >
          <el-popconfirm
            title="确定删除该模型吗？"
            @confirm="del(scope.row, scope.$index)"
          >
            <template #reference>
              <el-button type="danger" size="mini">删除</el-button>
            </template>
          </el-popconfirm>
        </div>
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
  <!-- 表单 -->
  <el-dialog :title="title" v-model="show" @close="close">
    <el-form :model="form" ref="ruleForm" label-width="120px" :rules="rules">
      <el-form-item label="模型名称" prop="name">
        <el-input v-model.trim="form.name" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="show = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import api from "../../http/api";
import { ref, onMounted, defineComponent } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { useValidate } from "../../hooks/useValidate";

let form = ref<any>({
  name: "",
  id: ""
});
let router = useRouter();
let ruleForm = ref<any>(null);
//添加/编辑 对话框提示文字
let title = ref("");
//点击添加模型
const add = () => {
  title.value = "添加模型";
  show.value = true;
  form.value.name = "";
  form.value.id = "";
};
//弹框是否显示
let show = ref(false);
//获取模型列表
let list = ref<any>([]);
//搜索内容
let query = ref("");
//当前页码
let current = ref(1);
//每页显示条数
let pageSize = ref(10);
//数据总条数
let total = ref(0);
const rules = ref({
  name: [
    {
      required: true,
      message: "请输入模型名称",
      trigger: "blur"
    }
  ]
});

//点击添加规格
const addSpec = (item: any) => {
  localStorage.setItem("model", JSON.stringify(item));
  router.push("/spec");
};
//关闭弹框时触发
const close = () => {
  ruleForm.value.clearValidate();
};
//点击确定
const submit = () => {
  useValidate(ruleForm.value, () => {
    if (form.value.id) {
      api
        .updateModel(form.value)
        .then((res: any) => {
          // console.log(res);
          if (res.code === 200) {
            ElMessage.success(res.msg);
            show.value = false;
            getData();
          }
        })
        .catch((err: any) => {
          console.log(err);
        });
    } else {
      api
        .addModel(form.value)
        .then((res: any) => {
          // console.log(res);
          if (res.code === 200) {
            ElMessage.success(res.msg);
            show.value = false;
            getData();
          }
        })
        .catch((err: any) => {
          console.log(err);
        });
    }
  });
};

//点击编辑
const edit = (item: any) => {
  title.value = "编辑模型";
  form.value.id = item._id;
  form.value.name = item.name;
  show.value = true;
};
//点击搜索
const search = () => {
  getData();
};

//删除模型
const del = (item: any, index: number) => {
  api.delModel(item._id).then((res: any) => {
    if (res.code === 200) {
      ElMessage.success(res.msg);
      getData();
    } else {
      ElMessage.error(res.msg);
    }
  });
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
  api
    .getModel({
      current: current.value,
      pageSize: pageSize.value,
      query: query.value
    })
    .then((res: any) => {
      if (res.code === 200) {
        list.value = res.data;
        total.value = res.total;
      }
    })
};
onMounted(() => {
  getData();
});
</script>


<style lang="scss" scoped>
.c-img {
  width: 300px;
  height: 100px;
}
</style>