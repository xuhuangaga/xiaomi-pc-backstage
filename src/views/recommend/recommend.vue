<template>
  <div class="f-a-c m-b10">
    <el-input v-model="query" placeholder="请输入" style="width:300px">
      <template #append>
        <el-button icon="el-icon-search" @click="search"></el-button>
      </template>
    </el-input>
    <div class="m-l10">
      <el-button type="primary" @click="add">添加推荐导航</el-button>
    </div>
  </div>
  <el-table
    ref="singleTable"
    :data="list"
    highlight-current-row
    style="width: 100%"
  >
    <el-table-column label="导航名称" width="300" property="name">
    </el-table-column>
    <el-table-column property="desc" label="导航描述" width="120">
    </el-table-column>
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
          <el-button size="mini" @click="look(scope.row.goods)"
            >查看商品</el-button
          >
          <el-button type="primary" size="mini" @click="edit(scope.row)"
            >编辑</el-button
          >
          <el-popconfirm
            title="确定删除该推荐导航吗？"
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
      <el-form-item label="导航名称" prop="name">
        <el-input v-model.trim="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="导航描述" prop="desc">
        <el-input v-model.trim="form.desc" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="所属商品" prop="goods">
        <el-select v-model="form.goods" multiple placeholder="请选择">
          <el-option
            v-for="item in product"
            :key="item._id"
            :label="item.name"
            :value="item._id"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="show = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 显示下属商品 -->
  <el-dialog title="下属商品" v-model="show1" width="30%">
    <div v-for="(item, index) in goods" :key="index" class="f-a-c p-10">
      <div>商品名称:</div>
      <div class="m-l10">{{ item.name }}</div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import api from "../../http/api";
import { ref, onMounted, defineComponent, reactive } from "vue";
import { ElMessage } from "element-plus";
import { useValidate } from "../../hooks/useValidate";

let form = ref<any>({
  name: "",
  desc: "",
  goods: [],
  id: ""
});

let ruleForm = ref<any>(null);
//添加/编辑 对话框提示文字
let title = ref("");
//商品对象数组
let productArr = ref([]);
//点击添加幻灯片
const add = () => {
  title.value = "添加推荐导航";
  show.value = true;
  form.value.name = "";
  form.value.desc = "";
  form.value.goods = [];
  form.value.id = "";
};
//弹框是否显示
let show = ref(false);
let show1 = ref(false);
let goods = ref([]);
//点击下属商品
const look = (item: any) => {
  show1.value = true;
  goods.value = item;
};
//获取推荐导航列表
let list = ref<any>([]);
//商品列表
let product = ref<any>([]);
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
      message: "请输入导航名称",
      trigger: "blur"
    }
  ],
  desc: [
    {
      required: true,
      message: "请输入导航描述",
      trigger: "blur"
    }
  ],
  goods: [
    {
      required: true,
      message: "请选择下属商品",
      trigger: "blur"
    }
  ]
});
//关闭弹框时触发
const close = () => {
  ruleForm.value.clearValidate();
};

//根据商品id数组 获取整个对象数组
const getProductArr = () => {
  productArr.value = [];
  form.value.goods.map((item: any) => {
    product.value.map((item1: any) => {
      if (item === item1._id) {
        productArr.value.push(item1);
      }
    });
  });
};
//点击确定
const submit = () => {
  useValidate(ruleForm.value, () => {
    getProductArr();
    form.value.goods = productArr.value;
    if (form.value.id) {
      api
        .updateRecommendNav(form.value)
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
        .addRecommendNav(form.value)
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
  title.value = "编辑推荐导航";
  form.value={...item}
  form.value.id = item._id;
  let temp = ref([]);
  item.goods.map((item: any) => {
    temp.value.push(item._id);
  });
  form.value.goods = temp.value;
  show.value = true;
};
//点击搜索
const search = () => {
  getData();
};

//删除推荐导航
const del = (item: any, index: number) => {
  api.delRecommendNav(item._id).then((res: any) => {
    if (res.code === 200) {
      ElMessage.success(res.msg);
      getData();
    } else {
      ElMessage.error(res.msg);
    }
  });
};

//修改推荐导航是否显示
const change = (item: any) => {
  api
    .showRecommendNav({
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
  //获取推荐导航数据
  api
    .getRecommendNav({
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
  //获取商品列表数据
  api
    .getGoods({
      current: 1,
      pageSize: 100000,
      query: ""
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
  getData();
});
</script>


<style lang="scss" scoped>
.c-img {
  width: 300px;
  height: 100px;
}
</style>