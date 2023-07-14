// 配置版本号
const version = '2023071101'
const title = '指标'
// 右侧配置项
const setting = [{
  label: '指标',
  // 设置组件类型
  type: 'select',
  // 字段
  field: 'yField',
  // 对应options中的字段
  optionField: 'yField',
  // 是否多选
  multiple: false,
  value: '',
  tabName: 'data'
},
{
  label: '字体颜色',
  type: 'colorPicker',
  field: 'customize_color',
  optionField: 'customize.color',
  value: '#000',
  tabName: 'custom'
},
{
  label: '字体大小',
  // 设置组件类型
  type: 'inputNumber',
  // 字段
  field: 'customize_fontSize',
  // 对应options中的字段
  optionField: 'customize.fontSize',
  value: '14',
  tabName: 'custom'
}]

// 模拟数据
const data = []

const option = {
  // 数据
  data: data,
  // 数据的字段相关属性
  yField: '',
  // 自定义组件其他属性
  customize: {
    color: '#000',
    fontSize: 14
  }
}

export default {
  version,
  title,
  setting,
  option
}
