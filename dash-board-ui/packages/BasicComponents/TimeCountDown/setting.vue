<!--
 * @description: 指标组件案例设计面板
 * @Date: 2022-08-17 16:53:28
 * @Author: xingheng
-->
<template>
  <div class="setting-wrap">
    <el-form
      ref="form"
      label-width="100px"
      label-position="left"
      :model="config"
    >
      <SettingTitle>标题</SettingTitle>
      <el-form-item
        class="lc-field-body"
        label="标题"
        label-width="100px"
      >
        <el-input
          v-model="config.title"
          placeholder="请输入标题"
        />
      </el-form-item>
      <SettingTitle>基础</SettingTitle>
      <div class="lc-field-body">
        <el-form-item
          label="字体大小"
          label-width="100px"
        >
          <el-input-number
            v-model="config.customize.fontSize"
            class="db-el-input-number"
            placeholder="请输入字体大小"
            :min="0"
          />
        </el-form-item>
        <el-form-item
          label="字体权重"
          label-width="100px"
        >
          <el-input-number
            v-model="config.customize.fontWeight"
            class="db-el-input-number"
            placeholder="请输入字体权重"
          />
        </el-form-item>
        <el-form-item
          label="字体颜色"
          label-width="100px"
        >
          <el-color-picker v-model="config.customize.color" />
        </el-form-item>
        <el-form-item
          label="结束日期"
          label-width="100px"
        >
          <el-date-picker
            v-model="config.endTime"
            popper-class="dateClass"
            :append-to-body="true"
            type="datetime"
            placeholder="请选择结束日期"
            :picker-options="pickerOptions"
            value-format="timestamp"
          />
        </el-form-item>

      </div>
    </el-form>
  </div>
</template>
<script>
import SettingTitle from 'dashPackages/SettingTitle/index.vue'
import PosWhSetting from 'dashPackages/DashboardDesign/RightSetting/PosWhSetting.vue'
export default {
  name: 'TimeCountDownSetting',
  components: {
    PosWhSetting,
    SettingTitle
  },
  data () {
    return {
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      HeaderFontSizeList: [
        { label: '正常', value: 16 },
        { label: '较小', value: 14 },
        { label: '较大', value: 30 }
      ],
      numberFormatList: [
        { label: '原始数据', value: 'value' },
        { label: '千位分隔', value: 'kilobit' }
      ]
    }
  },
  computed: {
    config: {
      get () {
        return this.$store.state.dashboard.activeItemConfig
      },
      set (val) {
        this.$store.state.dashboard.activeItemConfig = val
      }
    }
  },
  watch: {},
  mounted () {
    this.initEndTime()
  },
  methods: {
    initEndTime () {
      if (this.config.endTime) {
        this.config.endTime = new Date(this.config.endTime).getTime()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/style/settingWrap.scss";
.setting-wrap {
  padding-top: 16px;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
.lc-field-body {
  padding: 12px 16px;
}
</style>
