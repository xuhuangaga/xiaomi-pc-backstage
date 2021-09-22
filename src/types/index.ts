
// 首页左侧导航栏
export const NavArray = [
  {
    name: '首页',
    icon: 'el-icon-house',
    path: '/',
    t: 'home'
  },
  {
    name: '轮播图管理',
    icon: 'el-icon-files',
    path: '/carousel',
    t: 'banner'
  },
  {
    name: '导航管理',
    icon: 'el-icon-notebook',
    path: '/nav',
    t: 'nav'
  },
  {
    name: '推荐导航',
    icon: 'el-icon-pointer',
    path: '/recommend',
    t: 'recomment'
  },
  {
    name: '用户管理',
    icon: 'el-icon-user',
    path: '/user',
    t: 'user'
  },
  {
    name: '商品管理',
    icon: 'el-icon-shop',
    path: '/list',
    t: 'productman',
    children: [
      {
        name: '添加商品',
        icon: 'el-icon-plus',
        path: '/product',
        t: 'product'
      },
      {
        name: '商品分类',
        icon: 'el-icon-operation',
        path: '/class',
        t: 'category'
      },
      {
        name: '商品参数',
        icon: 'el-icon-orange',
        path: '/parameter',
        t: 'proparams'
      },
      {
        name: '商品规格',
        icon: 'el-icon-paperclip',
        path: '/spec',
        t: 'prospec'
      },
      {
        name: '商品模型',
        icon: 'el-icon-notification',
        path: '/model',
        t: 'promodel'
      },
      {
        name: '规格参数',
        icon: 'el-icon-paperclip',
        path: '/specparams',
        t: 'specparams'
      }
    ]
  },
  {
    name: '秒杀管理',
    icon: 'el-icon-switch',
    path: '/seckill',
    t: 'seckill'
  },
  {
    name: '优惠券管理',
    icon: 'el-icon-reading',
    path: '/coupon',
    t: 'coupon'
  },
  {
    name: '订单管理',
    icon: 'el-icon-picture',
    path: '/orders',
    t: 'order'
  },
  {
    name: '通知管理',
    icon: 'el-icon-mute-notification',
    path: '/notice',
    t: 'notice'
  },
  {
    name: '客服消息',
    icon: 'el-icon-service',
    path: '/customer',
    t: 'service'
  }
]

// 商品基本信息
export const formOptions = (category: any) => {
  return [
    {
      type: "input",
      label: "商品名称",
      prop: "name",
      value: "",
      attrs: {
        clearable: true
      },
      rules: [
        {
          required: true,
          message: "商品名称不能为空",
          trigger: "blur"
        }
      ]
    },
    {
      type: "cascader",
      label: "商品分类",
      value: "",
      prop: "category",
      options: category,
      rules: [
        {
          required: true,
          message: "商品分类不能为空",
          trigger: "blur"
        }
      ]
    },
    {
      type: "input",
      label: "商品原价",
      prop: "originalPrice",
      value: "",
      attrs: {
        clearable: true,
        type: "number"
      },
      rules: [
        {
          required: true,
          message: "商品原价不能为空",
          trigger: "blur"
        }
      ]
    },
    {
      type: "input",
      label: "商品现价",
      prop: "presentPrice",
      value: "",
      attrs: {
        clearable: true,
        type: "number"
      },
      rules: [
        {
          required: true,
          message: "商品现价不能为空",
          trigger: "blur"
        }
      ]
    },
    {
      type: "upload",
      label: "封面图",
      prop: "cover",
      value: "",
      slot: "upload",
      attrs: {
        action: "http://localhost:5000/admin/upload",
        headers: {
          authorization: localStorage.getItem("token")!
        },
        showFileList:true,
        limit:1
      },
      rules: [
        {
          required: true,
          message: "封面图不能为空",
          trigger: "blur"
        }
      ]
    },
    {
      type: "input",
      label: "商品单位",
      prop: "company",
      value: "件",
      attrs: {
        clearable: true
      },
      rules: [
        {
          required: true,
          message: "商品单位不能为空",
          trigger: "blur"
        }
      ]
    },
    {
      type: "input",
      label: "商品库存",
      prop: "stock",
      value: "999",
      attrs: {
        clearable: true
      },
      rules: [
        {
          required: true,
          message: "商品库存不能为空",
          trigger: "blur"
        }
      ]
    },
    {
      type: "input",
      label: "商品简介",
      prop: "introduction",
      value: "",
      attrs: {
        clearable: true,
        type: "textarea"
      },
      rules: [
        {
          required: true,
          message: "商品简介不能为空",
          trigger: "blur"
        }
      ]
    },
    {
      type: "input",
      label: "推荐介绍",
      prop: "sellDesc",
      value: "",
      attrs: {
        clearable: true,
        type: "textarea"
      },
      rules: [
        {
          required: true,
          message: "推荐介绍不能为空",
          trigger: "blur"
        }
      ]
    },
    {
      type: "switch",
      label: "是否新品",
      prop: "isNewGood",
      value: true
    },
    {
      type: "switch",
      label: "是否热销",
      prop: "isHot",
      value: true
    },
    {
      type: "switch",
      label: "是否推荐",
      prop: "isRecommend",
      value: true
    }
  ]
}

//商品媒体信息
export const mediaOptions = [
  {
    type: "upload",
    label: "商品图片",
    prop: "pic",
    value: "",
    slot: "upload",
    attrs: {
      action: "http://localhost:5000/admin/upload",
      headers: {
        authorization: localStorage.getItem("token")!
      },
      showFileList:true
    },
    rules: [
      {
        required: true,
        message: "封面图不能为空",
        trigger: "blur"
      }
    ]
  }
]

//商品规格
export const specOptions=(model:any)=>{
  return [
    {
      type: "select",
      label: "商品模型",
      prop: "model",
      value: "",
      children:model,
      rules: [
        {
          required: true,
          message: "商品模型不能为空",
          trigger: "blur"
        }
      ]
    }
  ]
}

//轮播对象
export interface CarouselObj {
  url: string,
  title: string,
  link: string,
  isShow: boolean,
  key: number,
  _id: string
}

//商品参数对象
export interface ProParamsObj {
  parentId: string,
  url: string,
  name: string,
  desc: string,
  key: number,
  _id: string
}

//导航对象
export interface NavObj {
  url: string,
  title: string,
  isShow: boolean,
  _id: string
}

//通知对象
export interface NoticeObj {
  content: string,
  key: number,
  _id: string,
  isShow: boolean
}

//优惠券对象
export interface CouponObj {
  // 优惠券名称
  name: string,
  // 优惠券金额
  amount: number,
  // 使用门槛
  threshold: number,
  // 开始时间
  start_time: string,
  // 结束时间
  end_time: string,
  // 优惠券数量
  number: number,
  // 是否显示
  isShow: boolean,
  _id: string
}

//用户对象
export interface UserObj {
  // 用户名
  username: string,
  // 用户头像
  avatar: string,
  // 用户邮箱
  email: string,
  // 用户电话
  mobile: string,
  // 是否禁用
  status: boolean,
  // 用户密码
  password: string,
  _id: string
}

//订单对象
export interface OrderObj {
  // 用户id
  user_id: string,
  // 订单总价
  price: number,
  // 用户地址
  address: string,
  // 订单商品数量
  count: number,
  // 支付时间
  pay_time: string,
  // 商品列表
  goods_list: any,
  // 用户电话
  mobile: string,
}

//秒杀对象
export interface SeckillObj {
  start_time: string,
  end_time: string,
  goods_number: number,
  goods: ProductObj[],
  isShow: boolean,
  price: number,
  _id: string
}

//规格参数对象
export interface SpecParamsObj {
  id: string,
  specParams: string
}


//推荐导航对象
export interface RecommentObj {
  name: string,
  desc: string,
  goods: ProductObj,
  _id: string
}

//商品模型对象
export interface ProModelObj {
  name: string,
  _id: string,
  key: number
}

//商品规格对象
export interface ProSpecObj {
  name: string,
  model: string,
  spec_item: string,
  mode: string,
  parentId: string,
  _id: string,
  key: number,
  checkList: string[]
}

//商品对象
export interface ProductObj {
  name: string,
  category: string,
  pic: string,
  video: string,
  cover: string,
  originalPrice: number,
  presentPrice: number,
  discount: number,
  detail: string,
  spec: string,
  introduction: string,
  company: string,
  stock: number,
  isNewGood: boolean,
  isHot: boolean,
  isRecommend: boolean,
  comment: string,
  isShow: boolean,
  sellDesc: string,
  productionDesc: string,
  _id: string,
  key: number
}

// 商品分类对象
export interface ClassifyObj {
  name: string,
  short_name: string,
  isShow: boolean,
  parentId: string,
  title: string,
  key: string,
  children: ClassifyObj[],
  _id: string,
  list: ClassifyObj[],
  isLeaf: boolean,
  label: string,
  value: string,
  disabled: boolean
}