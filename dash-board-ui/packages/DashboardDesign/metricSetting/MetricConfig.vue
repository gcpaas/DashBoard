<template>
  <el-dialog
    title="指标设置"
    :visible.sync="settingVisible"
    :close-on-click-modal="false"
    :before-close="handleClose"
    width="800px"
    append-to-body
  >
    <el-form
      ref="form"
      label-width="100px"
    >
        <el-form-item label="指标描述" label-width="100px">
          <el-input v-model="customizeConfig.descriptionField" placeholder="请输入指标描述" />
        </el-form-item>
        <el-form-item label="指标字体大小" label-width="100px">
          <el-input
            v-model="customizeConfig.metricFontSize"
            placeholder="请输入指标字体大小"
          >
            <template slot="append">
              px
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="指标字体权重" label-width="100px">
          <el-input-number
            v-model="customizeConfig.metricFontWeight"
            placeholder="请输入指标字体权重"
          />
        </el-form-item>
      <el-form-item
        label="指标字体颜色"
        label-width="100px"
      >
        <el-color-picker v-model="customizeConfig.metricColor" />
      </el-form-item>
      <el-form-item label="指标描述字体大小" label-width="100px">
        <el-input
          v-model="customizeConfig.descriptionFontSize"
          placeholder="请输入指标描述字体大小"
        >
          <template slot="append">
            px
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="指标描述字体权重" label-width="100px">
        <el-input-number
          v-model="customizeConfig.descriptionWeight"
          placeholder="请输入指标字体权重"
        />
      </el-form-item>
      <el-form-item
        label="指标描述字体颜色"
        label-width="100px"
      >
        <el-color-picker v-model="customizeConfig.descriptionColor" />
      </el-form-item>
        <el-form-item label="数字格式化" label-width="100px">
          <el-select
            v-model="customizeConfig.numberFormat"
            placeholder="请选择数字格式"
            clearable
          >
            <el-option
              v-for="item in numberFormatList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="handleClose">
        取消
      </el-button>
      <el-button
        type="primary"
        @click="updateConfig"
      >
        确定
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
  export default {
    name: 'MetricConfig',
    components: {
    },
    props: {
      settingVisible: {
        type: Boolean,
        default: false
      },
      customizeConfig: {
        type: Object,
        default: () => ({})
      },
    },
    data() {
      return {
        numberFormatList: [
          { label: "原始数据", value: "value" },
          { label: "千位分隔", value: "kilobit" }
        ],
      }
    },
    computed: {
      customizeMapConfig: {
        get() {
          return this.customizeConfig || {
            metric:'',//指标
            descriptionField:'',//指标名称
            metricFontSize: 30,//指标字体大小
            metricFontWeight: 700,//指标字体权重
            metricColor:'',//指标字体颜色
            descriptionFontSize: 16,//描述字体大小
            descriptionWeight: 400,//描述字体权重
            descriptionColor:'',//描述字体颜色
            numberFormat: "kilobit",//指标格式
          }
        },
        set() {}
      },
    },
    mounted() {},
    methods: {
      /**
       * @description: 关闭弹窗
       */
      handleClose() {
        this.$emit('update:settingVisible')
      },
      /**
       * @description: 更新配置
       */
      updateConfig() {
        this.$emit('updateCustomizeConfig', this.customizeMapConfig)
        this.handleClose()
      },
    }
  }
</script>

<style lang="scss" scoped>
  .config-map-table {
    border-bottom: 1px solid #e6ebf5;
  }
</style>
