<template>
  <div class="f-a-c m-b10">
    <el-input v-model="query" placeholder="请输入" style="width:300px">
      <template #append>
        <el-button icon="el-icon-search" @click="search"></el-button>
      </template>
    </el-input>
    <div class="m-l10">
      <el-button type="primary" @click="add">添加秒杀</el-button>
    </div>
  </div>
  <el-table
    ref="singleTable"
    :data="list"
    highlight-current-row
    style="width: 100%"
  >
    <el-table-column label="秒杀商品">
      <template #default="scope">
        {{ scope.row.goods.name }}
      </template>
    </el-table-column>
    <el-table-column property="start_time" label="开始时间" width="120">
    </el-table-column>
    <el-table-column property="end_time" label="结束时间" width="120">
    </el-table-column>
    <el-table-column property="price" label="秒杀价格" width="120">
    </el-table-column>
    <el-table-column property="goods_number" label="秒杀数量" width="120">
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
          <el-button type="primary" size="mini" @click="edit(scope.row)"
            >编辑</el-button
          >
          <el-popconfirm
            title="确定删除该秒杀吗？"
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
      <el-form-item label="秒杀商品" prop="goods">
        <el-select v-model="form.goods" placeholder="请选择">
          <el-option
            v-for="item in product"
            :key="item._id"
            :label="item.name"
            :value="item._id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间" prop="start_time">
        <el-date-picker
          v-model="form.start_time"
          type="datetime"
          placeholder="选择日期时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="end_time">
        <el-date-picker
          v-model="form.end_time"
          type="datetime"
          placeholder="选择日期时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="秒杀价格" prop="price">
        <el-input v-model.trim="form.price" type="number"></el-input>
      </el-form-item>
      <el-form-item label="秒杀数量" prop="goods_number">
        <el-input v-model.trim="form.goods_number" type="number"></el-input>
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
import dayjs from "dayjs";
import { useValidate } from "../../hooks/useValidate";

let form = ref<any>({
  start_time: "",
  end_time: "",
  goods: "",
  price: 0,
  goods_number: 0,
  id: ""
});

let ruleForm = ref<any>(null);
//添加/编辑 对话框提示文字
let title = ref("");
//点击添加幻灯片
const add = () => {
  title.value = "添加秒杀";
  show.value = true;
  form.value.start_time = "";
  form.value.end_time = "";
  form.value.goods = [];
  form.value.price = 0;
  form.value.id = "";
  form.value.goods_number = 0;
};
//弹框是否显示
let show = ref(false);
//获取秒杀列表
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
  goods: [
    {
      required: true,
      message: "请选择秒杀商品",
      trigger: "blur"
    }
  ],
  start_time: [
    {
      required: true,
      message: "请选择开始时间",
      trigger: "blur"
    }
  ],
  end_time: [
    {
      required: true,
      message: "请选择结束时间",
      trigger: "blur"
    }
  ],
  price: [
    {
      required: true,
      message: "请输入秒杀价格",
      trigger: "blur"
    }
  ],
  goods_number: [
    {
      required: true,
      message: "请输入秒杀数量",
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
    if (
      dayjs(form.value.start_time).valueOf() >
      dayjs(form.value.end_time).valueOf()
    ) {
      ElMessage.error("秒杀结束时间必须大于开始时间");
      return;
    }
    form.value.goods = product.value.filter((item: any) => {
      return item._id === form.value.goods;
    })[0];

    if (form.value.id) {
      api
        .updateSeckill(form.value)
        .then((res: any) => {
          // console.log(res);
          if (res.code === 200) {
            ElMessage.success(res.msg);
            show.value = false;
            getData();
          } else ElMessage.error(res.msg);
        })
        .catch((err: any) => {
          console.log(err);
        });
    } else {
      api
        .addSeckill(form.value)
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
  title.value = "编辑秒杀";
  form.value={...item}
  form.value.id = item._id;
  show.value = true;
};
//点击搜索
const search = () => {
  getData();
};

//删除秒杀
const del = (item: any, index: number) => {
  api.delSeckill({ id: item._id, goodsId: item.goods._id }).then((res: any) => {
    if (res.code === 200) {
      ElMessage.success(res.msg);
      getData();
    } else {
      ElMessage.error(res.msg);
    }
  });
};

//修改秒杀是否显示
const change = (item: any) => {
  api
    .showSeckill({
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
  //获取秒杀数据
  api
    .getSeckill({
      current: current.value,
      pageSize: pageSize.value,
      query: query.value
    })
    .then((res: any) => {
      if (res.code === 200) {
        list.value = res.data;
        list.value.map((item: any) => {
          item.start_time = dayjs(item.start_time).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          item.end_time = dayjs(item.end_time).format("YYYY-MM-DD HH:mm:ss");
        });
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