<template>
  <div class="f-a-c m-b10 b-b">
    <div class="f-a-c">
      <el-form>
        <el-form-item label="所属模型" required>
          <el-select v-model="form.parentId" placeholder="请选择">
            <el-option
              v-for="item in model"
              :key="item._id"
              :label="item.name"
              :value="item._id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="margin-top:-20px">
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          style="margin-left:10px"
          @click="search"
          >查询</el-button
        >
        <el-button
          icon="el-icon-refresh"
          size="mini"
          style="margin-left:10px"
          @click="refresh"
          >重置</el-button
        >
      </div>
    </div>
  </div>
  <div class="m-l10 m-b10">
    <el-button
      type="primary"
      @click="add"
      size="mini"
      icon="el-icon-plus"
      :disabled="!form.parentId"
      >添加规格</el-button
    >
  </div>
  <el-table
    ref="singleTable"
    :data="list"
    highlight-current-row
    style="width: 100%"
  >
    <el-table-column type="index"></el-table-column>
    <el-table-column property="name" label="规格名称"> </el-table-column>
    <el-table-column property="model" label="所属模型"> </el-table-column>
    <el-table-column property="mode" label="展现方式"> </el-table-column>
    <el-table-column property="spec_item" label="规格项" width="300">
      <template #default="scope">
        {{ scope.row.spec_item.split("\n").join() }}
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <div class="f-j-c">
          <el-popconfirm
            title="确定删除该规格吗？"
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
      <el-form-item label="规格名称" prop="name">
        <el-input
          v-model.trim="form.name"
          autocomplete="off"
          placeholder="请输入规格名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="所属模型" prop="parentId">
        <el-select v-model="form.parentId" placeholder="请选择">
          <el-option
            v-for="item in model"
            :key="item._id"
            :label="item.name"
            :value="item._id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="规格项" prop="spec_item">
        <el-input
          placeholder="请输入规格项"
          v-model="form.spec_item"
          type="textarea"
          :rows="5"
        ></el-input>
      </el-form-item>
      <el-form-item label="展示方式" prop="mode">
        <el-radio-group v-model="form.mode">
          <el-radio label="文字">文字</el-radio>
          <el-radio label="图片">图片</el-radio>
          <el-radio label="颜色">颜色</el-radio>
        </el-radio-group>
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
import { ref, onMounted, defineComponent ,onUnmounted} from "vue";
import { ElMessage } from "element-plus";
import { useValidate } from "../../hooks/useValidate";

let form = ref<any>({
  name: "",
  model: "",
  spec_item: "",
  mode: "",
  parentId: "",
  id: ""
});

let ruleForm = ref<any>(null);
//添加/编辑 对话框提示文字
let title = ref("");
//点击重置
const refresh = () => {
  form.value.parentId = "";
  list.value = [];
  localStorage.removeItem("model");
};
//点击添加规格
const add = () => {
  title.value = "添加规格";
  show.value = true;
  form.value.name = "";
  form.value.mode = "";
  form.value.spec_item = "";
  form.value.id = "";
};
//弹框是否显示
let show = ref(false);
//获取规格列表
let list = ref<any>([]);
//模型列表
let model = ref<any>([]);
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
      message: "请输入规格名称",
      trigger: "blur"
    }
  ],
  spec_item: [
    {
      required: true,
      message: "请输入规格项",
      trigger: "blur"
    }
  ],
  mode: [
    {
      required: true,
      message: "请选择展示方式",
      trigger: "blur"
    }
  ]
});

//关闭弹框时触发
const close = () => {
  ruleForm.value.clearValidate();
};
//点击确定
const submit = () => {
  useValidate(ruleForm.value, () => {
    form.value.model = model.value.filter((item: any) => {
      return item._id === form.value.parentId;
    })[0].name;
    api
      .addSpec(form.value)
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
  });
};

//点击编辑
const edit = (item: any) => {
  title.value = "编辑规格";
  form.value.id = item._id;
  form.value.name = item.name;
  show.value = true;
};
//点击查询
const search = () => {
  getData();
};

//删除规格
const del = (item: any, index: number) => {
  api
    .delSpec({ parentId: form.value.parentId, attrId: item._id })
    .then((res: any) => {
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
  //获取规格数据
  api
    .getSpec({
      parentId: form.value.parentId,
      current: current.value,
      pageSize: pageSize.value
    })
    .then((res: any) => {
      if (res.code === 200) {
        list.value = res.data;
        total.value = res.total;
      }
    })
    .catch((err: any) => {
      console.log(err);
    });
};
//获取模型数据
const getModel = () => {
  //获取模型数据
  api
    .getModel({
      current: 1,
      pageSize: 100000,
      query: ""
    })
    .then((res: any) => {
      if (res.code === 200) {
        model.value = res.data;
      }
    })
    .catch((err: any) => {
      console.log(err);
    });
};
onMounted(() => {
  getModel();
  let model = localStorage.getItem("model") as any;
  if (model) {
    form.value.parentId = JSON.parse(model)._id;
    getData();
  }
});
onUnmounted(()=>{
  localStorage.removeItem('model')
})
</script>


<style lang="scss" scoped>
.c-img {
  width: 300px;
  height: 100px;
}
</style>