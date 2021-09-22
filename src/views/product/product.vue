<template>
  <div v-if="!show">
    <div class="f-a-c m-b10">
      <el-input v-model="query" placeholder="请输入" style="width:300px">
        <template #append>
          <el-button icon="el-icon-search" @click="search"></el-button>
        </template>
      </el-input>
      <div class="m-l10">
        <el-button type="primary" @click="show = true">添加商品</el-button>
      </div>
    </div>
    <el-table
      ref="singleTable"
      :data="list"
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column type="index"></el-table-column>
      <el-table-column label="商品名称" property="name"></el-table-column>
      <el-table-column
        property="originalPrice"
        label="商品原价"
      ></el-table-column>
      <el-table-column property="presentPrice" label="商品现价">
      </el-table-column>
      <el-table-column property="stock" label="商品库存"> </el-table-column>
      <el-table-column label="是否新品">
        <template #default="scope">
          {{ scope.row.isNewGood ? "是" : "否" }}
        </template>
      </el-table-column>
      <el-table-column label="是否热卖">
        <template #default="scope">
          {{ scope.row.isHot ? "是" : "否" }}
        </template>
      </el-table-column>
      <el-table-column label="是否推荐">
        <template #default="scope">
          {{ scope.row.isRecommend ? "是" : "否" }}
        </template>
      </el-table-column>
      <el-table-column label="上下架">
        <template #default="scope">
          <el-switch
            v-model="scope.row.isShow"
            @change="change(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column property="address" label="操作">
        <template #default="scope">
          <div>
            <el-button type="primary" size="mini" @click="edit(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              @click="showDetail(scope.row)"
              style="margin:5px 0px;"
              >详情</el-button
            >
            <el-popconfirm
              title="确定删除该商品吗？"
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
  </div>
  <div v-else>
    <AddProduct
      v-if="category"
      :category="category"
      v-model:show="show"
      @refresh="refresh"
    ></AddProduct>
  </div>
  <el-dialog title="商品详情" v-model="visible" width="70%">
    <div class="m-t-b10 f-a-c">
      <div>商品名称:</div>
      <div class="m-l10">{{ details.name }}</div>
    </div>
    <div class="m-t-b10 f-a-c">
      <div>所属分类:</div>
      <div class="m-l10">{{ cateName }}</div>
    </div>
    <div class="m-t-b10 f-a-c">
      <div>商品原价:</div>
      <div class="m-l10">￥{{ details.presentPrice }}</div>
    </div>
    <div class="m-t-b10 f-a-c">
      <div>商品现价:</div>
      <div class="m-l10">￥{{ details.originalPrice }}</div>
    </div>
    <div class="m-t-b10 f-a-c">
      <div>商品单位:</div>
      <div class="m-l10">{{ details.company }}</div>
    </div>
    <div class="m-t-b10 f-a-c">
      <div>商品库存:</div>
      <div class="m-l10">{{ details.stock }}</div>
    </div>
    <div class="m-t-b10 f-a-c">
      <div>商品简介:</div>
      <div class="m-l10">{{ details.introduction }}</div>
    </div>
    <div class="m-t-b10 f-a-c">
      <div>推荐介绍:</div>
      <div class="m-l10">{{ details.sellDesc }}</div>
    </div>
    <div class="m-t-b10 f-a-c">
      <div>是否新品:</div>
      <div class="m-l10">{{ details.isNewGood ? "是" : "否" }}</div>
    </div>
    <div class="m-t-b10 f-a-c">
      <div>是否热销:</div>
      <div class="m-l10">{{ details.isHot ? "是" : "否" }}</div>
    </div>
    <div class="m-t-b10 f-a-c">
      <div>是否推荐:</div>
      <div class="m-l10">{{ details.isRecommend ? "是" : "否" }}</div>
    </div>
    <div class="m-t-b10 f-a-c">
      <div>商品规格:</div>
      <div class="m-l10">
        <div v-for="(item, index) in details.spec" :key="index">
          <div v-if="item.checkList.length" class="m-b10">
            {{ item.name }}:{{ item.checkList.join() }}
          </div>
        </div>
      </div>
    </div>
    <div class="m-t-b10 f-a-c">
      <div>商品详情:</div>
      <div v-html="details.detail" style="width:200px"></div>
    </div>
    <div class="m-t-b10 f-a-c">
      <div>封面图:</div>
      <div>
        <el-image
          :src="details.cover"
          :preview-src-list="[details.cover]"
          style="width:100px;height:100px"
        ></el-image>
      </div>
    </div>
    <div class="m-t-b10 f-a-c">
      <div>产品图:</div>
      <div>
        <el-image
          :src="item"
          :preview-src-list="[item]"
          v-for="(item, index) in details.pic"
          :key="index"
          style="width:100px;height:100px;margin-right:10px"
        ></el-image>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import api from "../../http/api";
import { ref, onMounted, defineComponent } from "vue";
import { ElMessage } from "element-plus";
import { useValidate } from "../../hooks/useValidate";
import AddProduct from "../../components/product/index/index.vue";

// 商品详情弹框是否显示
let visible = ref(false);
//添加商品是否显示
let show = ref(false);
//获取商品列表
let list = ref<any>([]);
//搜索内容
let query = ref("");
//当前页码
let current = ref(1);
//每页显示条数
let pageSize = ref(10);
//数据总条数
let total = ref(0);
//商品详情
let details = ref<any>();
//商品所有分类
let category = ref<any>();
//分类名称
let cateName = ref("");
// 点击查看详情
const showDetail = (item: any) => {
  visible.value = true;
  details.value = item;
  category.value.map((i: any) => {
    i.list.map((i1: any) => {
      if (i1._id === item.category) {
        cateName.value = i1.name;
      }
    });
  });
};
//点击编辑
const edit = (item: any) => {};
//点击搜索
const search = () => {
  getData();
};

//删除商品
const del = (item: any, index: number) => {
  api.delGoods(item._id).then((res: any) => {
    if (res.code === 200) {
      ElMessage.success(res.msg);
      getData();
    } else {
      ElMessage.error(res.msg);
    }
  });
};
//添加商品成功 重新获取商品列表
const refresh=()=>{
  show.value=false
  getData()
}
//修改商品是否显示
const change = (item: any) => {
  api
    .showGoods({
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
  // 获取商品数据
  api
    .getGoods({
      current: current.value,
      pageSize: pageSize.value,
      query: query.value
    })
    .then((res: any) => {
      if (res.code === 200) {
        list.value = res.data;
        total.value = res.total;
      }
    });
  // 获取商品分类数据
  api.getCategory("").then((res: any) => {
    if (res.code === 200) {
      category.value = res.data;
      category.value.map((item: any) => {
        item.label = item.name;
        item.value = item._id;
        item.list.map((i: any) => {
          i.label = i.name;
          i.value = i._id;
        });
        item.children = item.list;
      });
    }
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