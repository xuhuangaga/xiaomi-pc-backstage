<template>
  <div class="f-a-c m-b10">
    <el-input v-model="query" placeholder="请输入" style="width:300px">
      <template #append>
        <el-button icon="el-icon-search" @click="search"></el-button>
      </template>
    </el-input>
    <div class="m-l10">
      <el-button type="primary" @click="add">添加导航</el-button>
    </div>
  </div>
  <el-table
    ref="singleTable"
    :data="list"
    highlight-current-row
    style="width: 100%"
  >
    <el-table-column label="图片" width="300">
      <template #default="scope">
        <el-image :src="scope.row.url" class="c-img" :preview-src-list="[scope.row.url]" />
      </template>
    </el-table-column>
    <el-table-column property="url" label="路径" width="120"> </el-table-column>
    <el-table-column property="title" label="标题"> </el-table-column>
    <el-table-column property="isShow" label="是否显示">
      <template #default="scope">
        <el-switch
          v-model="scope.row.isShow"
          @change="change(scope.row)"
        ></el-switch>
      </template>
    </el-table-column>
    <el-table-column property="address" label="操作">
      <template #default="scope">
        <div class="f-j-c">
          <el-button type="primary" size="mini" @click="edit(scope.row)"
            >编辑</el-button
          >
          <el-popconfirm
            title="确定删除该导航吗？"
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
                style="width:100px;height:100px"
              ></el-image>
            </div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item label="导航标题" prop="title">
        <el-input v-model.trim="form.title" autocomplete="off"></el-input>
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
import { ref, onMounted, defineComponent, reactive } from "vue";
import { ElMessage } from "element-plus";
import { useValidate } from "../../hooks/useValidate";

let form = ref<any>({
  url: "",
  title: "",
  id: ""
});

let headers = ref<any>({
  authorization: localStorage.getItem("token")!
});
let url = ref("");
let ruleForm = ref<any>(null);
//添加/编辑 对话框提示文字
let title = ref("");
//点击添加幻灯片
const add = () => {
  title.value = "添加导航";
  show.value = true;
  form.value.title = "";
  form.value.id = "";
  form.value.url = "";
  url.value = "";
};
//弹框是否显示
let show = ref(false);
//获取导航列表
let list = ref<any>([]);
//搜索内容
let query = ref("");
//当前页码
let current = ref(1);
//每页显示条数
let pageSize = ref(5);
//数据总条数
let total = ref(0);
//关闭弹框时触发
const close = () => {
  ruleForm.value.clearValidate();
};
const rules = ref({
  url: [
    {
      required: true,
      message: "请选择图片",
      trigger: "blur"
    }
  ],
  title: [
    {
      required: true,
      message: "请输入导航标题",
      trigger: "blur"
    }
  ]
});

//文件上传成功时触发
const success = (res: any) => {
  if (res.code === 200) {
    url.value = res.data;
    form.value.url = res.data;
  }
};
//点击确定
const submit = () => {
  useValidate(ruleForm.value, () => {
    if (form.value.id) {
      form.value.url = url.value;
      api
        .updateNav(form.value)
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
        .addNav(form.value)
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
  title.value = "编辑导航";
  form.value={...item}
  form.value.id = item._id;
  show.value = true;
  url.value = item.url;
};
//点击搜索
const search = () => {
  getData();
};

//删除导航
const del = (item: any, index: number) => {
  api.delNav(item._id).then((res: any) => {
    if (res.code === 200) {
      ElMessage.success(res.msg);
      getData();
    } else {
      ElMessage.error(res.msg);
    }
  });
};

//修改导航是否显示
const change = (item: any) => {
  api
    .showNav({
      id: item._id,
      isShow: item.isShow
    })
    .then((res: any) => {
      // console.log(res);
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
    .getNav({
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
    .catch((err: any) => {
      console.log(err);
    });
};
onMounted(() => {
  getData();
});
</script>


<style lang="scss" scoped>
.c-img {
  width: 100px;
  height: 100px;
}
</style>