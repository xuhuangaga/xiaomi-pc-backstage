<template>
  <div class="bc-w p-10">
    <el-input v-model="query" placeholder="请输入" style="width:300px">
      <template #append>
        <el-button icon="el-icon-search" @click="search"></el-button>
      </template>
    </el-input>
    <div class="m-t20 class-con">
      <div>
        <el-tree :data="list" node-key="id" :expand-on-click-node="false">
          <template #default="{ node, data }">
            <div class="custom-tree-node f-j-b" @click="active(node)">
              <div>{{ node.label }}</div>
              <div
                v-if="data.list"
                class="operation"
                :class="{ show: id === node.data._id }"
              >
                <a @click="append(data)" class="f-s14"> 新增 </a>
                <el-popconfirm title="确定删除该分类吗？" @confirm="del">
                  <template #reference>
                    <a @click="remove(node)" class="f-s14"> 删除 </a>
                  </template>
                </el-popconfirm>
              </div>
            </div>
          </template>
        </el-tree>
      </div>
      <div>
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>新增分类</span>
              <el-button class="button" type="text" @click="submit"
                >确认</el-button
              >
            </div>
          </template>
          <div>
            <el-form
              :model="form"
              ref="ruleForm"
              label-width="120px"
              :rules="rules"
            >
              <el-form-item label="分类名称" prop="name">
                <el-input
                  v-model.trim="form.name"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="上级分类">
                <el-select v-model="form.id" placeholder="请选择上级分类">
                  <el-option
                    v-for="item in list"
                    :key="item._id"
                    :label="item.name"
                    :value="item._id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="分类别名">
                <el-input
                  v-model.trim="form.short_name"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineComponent, onMounted } from "vue";
import api from "../../http/api";
import { ElMessage } from "element-plus";
import { useValidate } from "../../hooks/useValidate";

let form = ref<any>({
  name: "",
  short_name: "",
  id: ""
});
let ruleForm = ref<any>(null);
//搜索的内容
let query = ref("");
//分类数据
let list = ref<any>();
//选中的分类id
let id = ref("");

const rules = ref({
  name: [
    {
      required: true,
      message: "请输入分类名称",
      trigger: "blur"
    }
  ]
});
//点击确认
const submit = () => {
  useValidate(ruleForm.value, () => {
    //添加一级分类
    if (!form.value.id) {
      api
        .addCategory({
          name: form.value.name,
          short_name: form.value.short_name,
          isShow: true
        })
        .then((res: any) => {
          if (res.code === 200) {
            ElMessage.success("新增成功");
            form.value.name = "";
            form.value.id = "";
            form.value.short_name = "";
            getData();
          } else ElMessage.error(res.msg);
        });
    } else {
      // 添加二级分类
      api
        .addSecondCategory({
          name: form.value.name,
          parentId: form.value.id,
          isShow: true
        })
        .then((res: any) => {
          if (res.code === 200) {
            ElMessage.success("新增成功");
            form.value.name = "";
            form.value.id = "";
            form.value.short_name = "";
            getData();
          } else ElMessage.error(res.msg);
        });
    }
  });
};
//点击一级分类
const active = (data: any) => {
  if (data.data.list) id.value = data.data._id;
  else id.value = "";
};
//删除一级分类
const del = () => {
  api.delCategory(id.value).then((res: any) => {
    if (res.code === 200) {
      ElMessage.success("删除成功");
      getData();
    } else ElMessage.error(res.msg);
  });
};
//点击新增
const append = (data: any) => {
  form.value.id = data._id;
};
//点击删除
const remove = (data: any) => {
  if (data.data.list) id.value = data.data._id;
  else id.value = "";
};
onMounted(() => {
  getData();
});
//获取所有分类
const getData = () => {
  api.getCategory(query.value).then((res: any) => {
    if (res.code === 200) {
      list.value = res.data;
      list.value.map((item: any) => {
        item.label = item.name;
        item.list.map((item1: any) => {
          item1.label = item1.name;
        });
        item.children = item.list;
      });
    }
  });
};
//点击搜索
const search = () => {
  getData();
};
</script>

<style lang="scss" scoped>
.class-con {
  display: flex;
  justify-content: space-between;
  .custom-tree-node {
    width: 400px;
    &:hover {
      .operation {
        display: block;
      }
    }
  }
  .operation {
    display: none;
  }
  .show {
    display: block;
  }
  .box-card {
    width: 480px;
  }
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>