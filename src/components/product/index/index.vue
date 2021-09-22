<template>
  <div class="bc-w p-10">
    <div class="f-j-b">
      <div>添加商品</div>
      <div @click="close" class="c-p">X</div>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick" class="m-t20">
      <el-tab-pane label="基本设置" name="first">
        <ggForm :options="options" v-model:cover="cover">
          <template #default="scope">
            <el-button @click="cancel" size="mini">取消</el-button>
            <el-button type="primary" @click="submit(scope)" size="mini"
              >确认</el-button
            >
          </template>
          <template #upload>
            <el-button type="primary" size="mini">点击上传</el-button>
          </template>
        </ggForm>
      </el-tab-pane>
      <el-tab-pane label="媒体信息" name="second" :disabled="count >= 3">
        <ggForm :options="media" v-model:pic="pic" :media="1">
          <template #default="scope">
            <el-button @click="cancel" size="mini">取消</el-button>
            <el-button type="primary" @click="submit(scope)" size="mini"
              >确认</el-button
            >
          </template>
          <template #upload>
            <el-button type="primary" size="mini">点击上传</el-button>
          </template>
        </ggForm>
      </el-tab-pane>
      <el-tab-pane label="商品规格" name="third" :disabled="count >= 2">
        <ggForm
          :options="modelOptions"
          v-if="modelOptions && models"
          @change="change"
        >
          <template #default="scope">
            <div
              v-for="(item, index) in specArr"
              :key="index"
              class="b-b p-b10"
            >
              <el-checkbox
                @change="checkAll($event, item)"
                v-model="item.checked"
                >{{ item.name }}</el-checkbox
              >
              <div>
                <el-checkbox
                  border
                  v-for="(item1, index1) in item.spec"
                  :label="item1"
                  :key="index1"
                  @change="check($event, item1, item)"
                  v-model="item1.checked"
                  >{{ item1.name }}</el-checkbox
                >
              </div>
            </div>

            <el-button @click="cancel" size="mini">取消</el-button>
            <el-button type="primary" @click="submit(scope)" size="mini"
              >确认</el-button
            >
          </template>
        </ggForm>
      </el-tab-pane>
      <el-tab-pane label="商品详情" name="fourth" :disabled="count >= 1">
        <el-form>
          <el-form-item label="商品详情" required>
            <div id="div" class="m-t20"></div>
            <div>
              <el-button @click="cancel" size="mini">取消</el-button>
              <el-button type="primary" @click="submit" size="mini"
                >确认</el-button
              >
            </div>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, defineComponent, onMounted } from "vue";
import { FormInstance, FormOptionItem } from "../../../types/form";
import { useValidate } from "../../../hooks/useValidate/index";
import {
  formOptions,
  mediaOptions,
  specOptions,
  productInfo
} from "../../../types/index";
import ggForm from "../../gg-form/ggForm.vue";
import api from "../../../http/api";
import E from "wangeditor";
import { ElMessage } from "element-plus";

//编辑器内容
let details = ref("");
let editor1 = ref<any>(null);
//表单未验证通过的数量
let count = ref(4);
//模型数据
let models = ref<any>();
//所有表单数据
let dataSource = ref<any>();
let emits = defineEmits(["update:show", "refresh"]);
let props = defineProps({
  category: {
    type: Array
  },
  show: {
    type: Boolean
  }
});
//基本信息
let options = formOptions(props.category);
//规格
let specArr = ref<any>();
//媒体信息
let media = mediaOptions;
//模型 规格
let modelOptions = ref<any>();
//主图
let cover = ref("");
//产品图
let pic = ref("");
interface Scope {
  form: FormInstance;
  model: any;
}
// 选中的规格;
let checkSpec = ref<any>();
let activeName = ref("first");
//点击全选
const checkAll = (e: any, item: any) => {
  if (e) item.checkedList = item.spec;
  else item.checkedList = [];
  item.spec.map((item: any) => {
    item.checked = e;
  });
  item.checked = item.checkedList.length === item.spec.length;
};
const handleClick = (tab: any, event: any) => {
  activeName.value = tab.props.name;
};
// 点击取消
const cancel = () => {
  emits("update:show", false);
};
//点击单选
const check = (e: any, item1: any, item: any) => {
  if (e) {
    item.checkedList.push(item1.name);
  } else {
    item.checkedList = item.checkedList.filter((i: any) => {
      return i.checked;
    });
  }
  item1.checked = item.checkedList.includes(item1.name);
  item.checked = item.checkedList.length === item.spec.length;
};
//获取模型
const getModel = () => {
  api
    .getModel({
      current: 1,
      pageSize: 100000,
      query: ""
    })
    .then((res: any) => {
      if (res.code === 200) {
        models.value = res.data;
        if (models.value) {
          models.value.map((item: any) => {
            item.label = item.name;
            item.value = item._id;
            item.type = "option";
          });
          modelOptions.value = specOptions(models.value);
        }
      }
    });
};
//选择模型
const change = (id: string) => {
  models.value.map((item: any) => {
    if (item._id === id) {
      specArr.value = item.specifications;
      specArr.value.map((item1: any) => {
        item1.checkedList = [];
        item1.checked = false;
        let arr: any = [];
        item1.spec_item.split("\n").map((item2: any) => {
          arr.push({
            name: item2,
            checked: false
          });
        });
        item1.spec = arr;
      });
    }
  });
};
onMounted(() => {
  const editor = new E("#div");
  editor.config.onchange = (newHtml: any) => {
    details.value = newHtml;
  };
  editor1.value = editor;
  editor.create();
  getModel();
});
// 点击关闭
const close = () => {
  emits("update:show", false);
};
//点击确定
const submit = (scope: Scope) => {
  if (activeName.value === "first") scope.model.cover = cover.value;
  if (activeName.value === "second") scope.model.pic = pic.value;
  if (activeName.value === "third") {
    let spec = specArr.value.filter((item: any) => {
      return item.checkedList.length > 0;
    });
    if (spec.length) {
      spec.map((item: any) => {
        let arr: any = [];
        item.checkedList.map((item1: any) => {
          if (item1.checked) {
            arr.push(item1.name);
          }
        });
        item.checkList = arr;
      });
      checkSpec.value = spec;
    } else {
      ElMessage.error("请至少选择一种规格");
      return;
    }
  }
  if (activeName.value !== "fourth") {
    useValidate(scope.form, () => {
      dataSource.value={...dataSource.value,...scope.model};
      
      if (activeName.value === "first") {
        count.value = 2;
        activeName.value = "second";
      } else if (activeName.value === "second") {
        count.value = 1;
        activeName.value = "third";
      } else if (activeName.value === "third") {
        count.value = 0;
        activeName.value = "fourth";
      }
    });
  } else {
    if (details.value) {
      dataSource.value.detail=details.value
      dataSource.value.video=[]
      dataSource.value.comment=[]
      dataSource.value.spec=checkSpec.value
      dataSource.value.category=dataSource.value.category[1]
      api
        .addGoods(dataSource.value)
        .then((res: any) => {
          if (res.code === 200) {
            ElMessage.success("新增成功");
            emits("refresh");
          } else ElMessage.error(res.msg);
        });
    } else ElMessage.error("请输入商品详情");
  }
};
</script>
<style scoped>

</style>