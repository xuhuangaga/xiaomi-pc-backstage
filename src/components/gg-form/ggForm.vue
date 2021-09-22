<template>
  <el-form
    :model="model"
    :rules="rules"
    :validate-on-rule-change="false"
    ref="ruleForm"
    label-width="120px"
  >
    <template v-for="(item, index) in options" :key="index">
      <el-form-item
        v-if="item.children && item.children.length > 0"
        :label="item.label"
        :prop="item.prop"
      >
        <component
          :is="`el-${item.type}`"
          v-model="model[item.prop]"
          @change="change"
        >
          <component
            v-for="(child, i) in item.children"
            :key="i"
            :is="`el-${child.type}`"
            :label="child.label"
            :value="child.value"
          >
          </component>
        </component>
      </el-form-item>
      <el-form-item
        v-else-if="item.options"
        :label="item.label"
        :prop="item.prop"
      >
        <component
          :is="`el-${item.type}`"
          :options="item.options"
          v-model="model[item.prop]"
        ></component>
      </el-form-item>
      <el-form-item v-else :label="item.label" :prop="item.prop">
        <component
          v-if="item.type === 'upload'"
          :is="`el-${item.type}`"
          v-model="model[item.prop]"
          v-bind="item.attrs"
          :on-success="success"
          :on-remove="remove"
          :show-file-list="item.attrs.showFileList"
          list-type="picture"
        >
          <slot :name="item.slot" v-if="item.slot"></slot>
        </component>
        <component
          v-else
          :is="`el-${item.type}`"
          v-model="model[item.prop]"
          v-bind="item.attrs"
        >
          <slot :name="item.slot" v-if="item.slot"> </slot>
        </component>
      </el-form-item>
    </template>
    <el-form-item>
      <slot :form="ruleForm" :model="model"></slot>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { defineComponent, PropType, ref, onMounted } from "vue";
import { FormInstance, FormOptionItem } from "../../types/form";
import cloneDeep from "lodash/cloneDeep";

let props = defineProps({
  options: {
    type: Array as PropType<FormOptionItem[]>,
    required: true
  },
  media: {
    type: Number,
    default: 0
  }
});
let ruleForm = ref<FormInstance>();
let model = ref<any>({});
let rules = ref<any>({});
let emits = defineEmits(["update:cover", "update:pic", "change"]);
let pic = ref<any>([]);
//图片上传成功触发
const success = (response: any) => {
  if (props.media) {
    pic.value.push(response.data);
    emits("update:pic", pic.value);
  } else {
    emits("update:cover", response.data);
  }
};
//移除图片触发
const remove = (e: any) => {
  pic.value = pic.value.filter((item: string) => {
    return item !== e.response.data;
  });
  emits("update:pic", pic.value);
};
//选择下拉列表触发
const change = (id: string) => {
  emits("change", id);
};
onMounted(() => {
  let m: any = {};
  let r: any = {};
  props.options.map((item: FormOptionItem) => {
    m[item.prop!] = item.value;
    r[item.prop!] = item.rules;
  });
  model.value = cloneDeep(m);
  rules.value = cloneDeep(r);
});
</script>

<style scoped>
</style>