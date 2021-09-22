<template>
  <div class="f-a-c m-b10">
    <el-select v-model="form.parentId" placeholder="请选择" @change="change">
      <el-option
        v-for="item in product"
        :key="item._id"
        :label="item.name"
        :value="item._id"
      >
      </el-option>
    </el-select>
    <el-button type="primary" size="mini" style="margin-left:10px" :disabled="!form.parentId" @click="add"
      >添加参数</el-button
    >
  </div>
  <el-table
    ref="singleTable"
    :data="list"
    highlight-current-row
    style="width: 100%"
  >
    <el-table-column type="index"></el-table-column>
    <el-table-column property="name" label="图片">
      <template #default="scope">
        <el-image :src="scope.row.url" :preview-src-list="[scope.row.url]" class="c-img"/>
      </template>
    </el-table-column>
    <el-table-column property="name" label="参数名称"> </el-table-column>
    <el-table-column property="desc" label="参数描述"> </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <div class="f-j-c">
           <el-button type="primary" size="mini" @click="edit(scope.row)"
            >编辑</el-button
          >
          <el-popconfirm
            title="确定删除该参数吗？"
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
      <el-form-item label="图片地址" prop="url">
        <el-upload
          class="upload-demo"
          action="http://localhost:5000/admin/upload"
          list-type="picture"
          :headers="headers"
          :on-success="success"
          :show-file-list="false"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <template #tip>
            <div class="el-upload__tip">
              <el-image
                v-if="url"
                :preview-src-list="[url]"
                :src="url"
                class="c-img"
              ></el-image>
            </div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item label="参数名称" prop="name">
        <el-input v-model.trim="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="参数描述" prop="desc">
        <el-input v-model.trim="form.desc" autocomplete="off"></el-input>
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
import { useValidate } from "../../hooks/useValidate";

let form = ref<any>({
  name: "",
  url: "",
  desc: "",
  parentId: "",
  id: ""
});

let url = ref("");
let ruleForm = ref<any>(null);
//添加/编辑 对话框提示文字
let title = ref("");
//点击添加参数
const add = () => {
  title.value = "添加参数";
  show.value = true;
  form.value.name = "";
  form.value.url = "";
  form.value.desc = "";
  form.value.id = "";
  url.value=""
};
let headers = ref<any>({
  authorization: localStorage.getItem("token")!
});
//弹框是否显示
let show = ref(false);
//获取参数列表
let list = ref<any>([]);
//产品列表
let product = ref<any>([]);
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
      message: "请输入参数名称",
      trigger: "blur"
    }
  ],
  desc: [
    {
      required: true,
      message: "请输入参数描述",
      trigger: "blur"
    }
  ],
  url: [
    {
      required: true,
      message: "请选择图片",
      trigger: "blur"
    }
  ]
});
//选择下拉列表时触发
const change=()=>{
  getData()
}
//文件上传成功时触发
const success = (res: any) => {
  if (res.code === 200) {
    url.value = res.data;
    form.value.url = res.data;
  }
};
//关闭弹框时触发
const close = () => {
  ruleForm.value.clearValidate();
};
//点击确定
const submit = () => {
  useValidate(ruleForm.value, () => {
    if (form.value.id) {
      console.log(form.value);
      
      api
        .updateParams(form.value)
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
        .addParams(form.value)
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
  title.value = "编辑参数";
  form.value={...item}
  form.value.id = item._id;
  url.value=item.url
  show.value = true;
};
//点击查询
const search = () => {
  getData();
};

//删除参数
const del = (item: any, index: number) => {
  api
    .delParams({ parentId: form.value.parentId, attrId: item._id })
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
  //获取参数数据
  api
    .getParams({
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
//获取商品数据
const getProduct = () => {
  //获取商品数据
  api
    .getGoods({
      current: 1,
      pageSize: 100000,
      query:''
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
onMounted(() => {
  getProduct();
});
</script>


<style lang="scss" scoped>
.c-img {
  width: 50px;
  height: 50px;
}
</style>