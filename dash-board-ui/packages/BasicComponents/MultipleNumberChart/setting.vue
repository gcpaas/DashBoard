<template>
  <div class="db-setting-wrap">
    <el-form
      ref="form"
      :model="config"
      label-width="90px"
      label-position="left"
      class="setting-body"
    >
      <div>
        <el-form
          :model="config.customize"
          label-position="left"
          class="setting-body"
          label-width="90px"
        >
          <SettingTitle>标题</SettingTitle>
          <div class="lc-field-body">
            <el-form-item label="数字卡片名称">
              <el-input
                v-model="config.title"
                clearable
              />
            </el-form-item>
          </div>
          <!-- <SettingTitle>基础</SettingTitle>
          <div class="lc-field-body">
            <el-form-item label="指标字体大小" label-width="100px">
              <el-input
                v-model="config.customize.fontSize"
                placeholder="请输入指标字体大小"
              >
                <template slot="append">
                  px
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="指标字体权重" label-width="100px">
              <el-input-number
                v-model="config.customize.fontWeight"
                placeholder="请输入指标字体权重"
              />
            </el-form-item>
            <el-form-item label="数字格式化" label-width="100px">
              <el-select
                v-model="config.customize.numberFormat"
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
          </div> -->
        </el-form>
      </div>
    </el-form>
  </div>
</template>
<script>
import SettingTitle from 'packages/SettingTitle/index.vue'
export default {
  name: 'BarSetting',
  components: {
    SettingTitle
  },
  data () {
    return {
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
  mounted () {},
  methods: {}
}
</script>

<style lang="scss" scoped>
@import '../~packages/assets/style/settingWrap.scss';
.lc-field-body {
  padding: 12px 16px;
}
</style>
