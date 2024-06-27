<template>
  <div class="db-setting-wrap">
    <el-form
      ref="form"
      :model="config"
      label-width="90px"
      label-position="left"
      class="setting-body db-el-form"
    >
      <SettingTitle>标题</SettingTitle>
      <div class="lc-field-body">
        <el-form-item
          label="标题"
          label-width="100px"
        >
          <el-input
            v-model="config.title"
            placeholder="请输入标题"
            clearable
          />
        </el-form-item>
      </div>
      <SettingTitle>图表</SettingTitle>
      <div class="lc-field-body">
        <el-form-item
          label="上升色"
          label-width="100px"
        >
          <ColorPicker
            v-model="config.customize.highColor"
            :predefine-colors="predefineThemeColors"
          />
        </el-form-item>
        <el-form-item
          label="下降色"
          label-width="100px"
        >
          <ColorPicker
            v-model="config.customize.lowColor"
            :predefine-colors="predefineThemeColors"
          />
        </el-form-item>
      </div>
      <SettingTitle>
        网格线
      </SettingTitle>
      <div class="lc-field-body">
        <el-form-item

          label="网格线"
          label-width="100px"
        >
          <el-switch
            v-model="config.customize.gridShow"
            class="db-el-switch"
          />
        </el-form-item>
        <el-form-item
          label="宽度"
          label-width="100px"
        >
          <el-input-number
            v-model="config.customize.gridWidth"
            class="db-el-input-number"
          />
        </el-form-item>
        <el-form-item
          label="颜色"
          label-width="100px"
        >
          <ColorPicker
            v-model="config.customize.gridColor"
            :predefine-colors="predefineThemeColors"
          />
        </el-form-item>
      </div>
      <SettingTitle>
        x轴
      </SettingTitle>
      <div class="lc-field-body">
        <el-form-item

          label="标题"
          label-width="100px"
        >
          <el-input
            v-model="config.customize.xAxis.name"
          />
        </el-form-item>
        <el-form-item

          label="标题位置"
          label-width="100px"
        >
          <el-select
            v-model="config.customize.xAxis.position"
            popper-class="db-el-select"
            class="db-el-select"
            placeholder="请选择位置"
          >
            <el-option
              v-for="item in axisPositionList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="标题间距"
          label-width="100px"
        >
          <el-input-number
            v-model="config.customize.xAxis.nameGap"
            class="db-el-input-number"
            placeholder="请输入标题间距"
            :min="0"
            clearable
          />
        </el-form-item>

        <el-form-item
          label="标题字体大小"
          label-width="100px"
        >
          <el-input-number
            v-model="config.customize.xAxis.nameSize"
            class="db-el-input-number"
            placeholder="请输入标题字体大小"
            clearable
          />
        </el-form-item>
        <el-form-item

          label="标题颜色"
          label-width="100px"
        >
          <ColorPicker
            v-model="config.customize.xAxis.nameColor"
            :predefine-colors="predefineThemeColors"
          />
        </el-form-item>

        <el-form-item
          label="标签字体大小"
          label-width="100px"
        >
          <el-input-number
            v-model="config.customize.xAxis.labelSize"
            class="db-el-input-number"
            placeholder="请输入标题字体大小"
            clearable
          />
        </el-form-item>
        <el-form-item

          label="标签颜色"
          label-width="100px"
        >
          <ColorPicker
            v-model="config.customize.xAxis.labelColor"
            :predefine-colors="predefineThemeColors"
          />
        </el-form-item>
        <el-form-item
          label="轴线宽度"
          label-width="100px"
        >
          <el-input-number
            v-model="config.customize.xAxis.lineWidth"
            class="db-el-input-number"
            placeholder="请输入标题字体大小"
            clearable
          />
        </el-form-item>
        <el-form-item

          label="轴线颜色"
          label-width="100px"
        >
          <ColorPicker
            v-model="config.customize.xAxis.lineColor"
            :predefine-colors="predefineThemeColors"
          />
        </el-form-item>

        <el-form-item
          label="刻度线宽度"
          label-width="100px"
        >
          <el-input-number
            v-model="config.customize.xAxis.tickWidth"
            class="db-el-input-number"
            placeholder="请输入标题字体大小"
            clearable
          />
        </el-form-item>
        <el-form-item

          label="刻度线颜色"
          label-width="100px"
        >
          <ColorPicker
            v-model="config.customize.xAxis.tickColor"
            :predefine-colors="predefineThemeColors"
          />
        </el-form-item>
      </div>
      <SettingTitle>
        y轴
      </SettingTitle>
      <div class="lc-field-body">
        <el-form-item

          label="标题"
          label-width="100px"
        >
          <el-input
            v-model="config.customize.yAxis.name"
          />
        </el-form-item>
        <el-form-item

          label="标题位置"
          label-width="100px"
        >
          <el-select
            v-model="config.customize.yAxis.position"
            popper-class="db-el-select"
            class="db-el-select"
            placeholder="请选择位置"
          >
            <el-option
              v-for="item in axisPositionList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="标题间距"
          label-width="100px"
        >
          <el-input-number
            v-model="config.customize.yAxis.nameGap"
            class="db-el-input-number"
            placeholder="请输入标题间距"
            :min="0"
            clearable
          />
        </el-form-item>

        <el-form-item
          label="标题字体大小"
          label-width="100px"
        >
          <el-input-number
            v-model="config.customize.yAxis.nameSize"
            class="db-el-input-number"
            placeholder="请输入标题字体大小"
            clearable
          />
        </el-form-item>
        <el-form-item

          label="标题颜色"
          label-width="100px"
        >
          <ColorPicker
            v-model="config.customize.yAxis.nameColor"
            :predefine-colors="predefineThemeColors"
          />
        </el-form-item>

        <el-form-item
          label="标签字体大小"
          label-width="100px"
        >
          <el-input-number
            v-model="config.customize.yAxis.labelSize"
            class="db-el-input-number"
            placeholder="请输入标题字体大小"
            clearable
          />
        </el-form-item>
        <el-form-item

          label="标签颜色"
          label-width="100px"
        >
          <ColorPicker
            v-model="config.customize.yAxis.labelColor"
            :predefine-colors="predefineThemeColors"
          />
        </el-form-item>
        <el-form-item
          label="轴线宽度"
          label-width="100px"
        >
          <el-input-number
            v-model="config.customize.yAxis.lineWidth"
            class="db-el-input-number"
            placeholder="请输入标题字体大小"
            clearable
          />
        </el-form-item>
        <el-form-item

          label="轴线颜色"
          label-width="100px"
        >
          <ColorPicker
            v-model="config.customize.yAxis.lineColor"
            :predefine-colors="predefineThemeColors"
          />
        </el-form-item>

        <el-form-item
          label="刻度线宽度"
          label-width="100px"
        >
          <el-input-number
            v-model="config.customize.yAxis.tickWidth"
            class="db-el-input-number"
            placeholder="请输入标题字体大小"
            clearable
          />
        </el-form-item>
        <el-form-item

          label="刻度线颜色"
          label-width="100px"
        >
          <el-color-picker
            v-model="config.customize.yAxis.tickColor"
          />
        </el-form-item>
      </div>
      <SettingTitle>
        边距
      </SettingTitle>
      <div class="lc-field-body">
        <el-form-item label="上边距">
          <el-input-number
            v-model="config.customize.top"
            class="db-el-input-number"
          />
        </el-form-item>
        <el-form-item label="下边距">
          <el-input-number
            v-model="config.customize.bottom"
            class="db-el-input-number"
          />
        </el-form-item>
        <el-form-item label="左边距">
          <el-input-number
            v-model="config.customize.left"
            class="db-el-input-number"
          />
        </el-form-item>
        <el-form-item label="右边距">
          <el-input-number
            v-model="config.customize.right"
            class="db-el-input-number"
          />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
import SettingTitle from 'dashPackages/SettingTitle/index.vue'
import { chartSettingMixins } from 'dashPackages/js/mixins/chartSettingMixins'
import ColorSelect from 'dashPackages/ColorMultipleSelect/index.vue'
import ColorPicker from 'dashPackages/ColorPicker/index.vue'
import { predefineColors } from 'dashPackages/js/utils/colorList'
export default {
  name: 'BarSetting',
  components: {
    ColorSelect,
    ColorPicker,
    SettingTitle
  },
  mixins: [chartSettingMixins],
  props: {},
  data () {
    return {
      colors: [],
      mapList: [],
      predefineThemeColors: predefineColors,
      mapTree: [],
      currentMap: {},
      axisPositionList: [
        {
          label: '左',
          value: 'start'
        },
        {
          label: '中',
          value: 'center'
        },
        {
          label: '右',
          value: 'end'
        }]
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
    this.colors = this.config.customize.rangeColor
  },
  methods: {
    delColor () {
      if (this.colors.length <= 2) return
      this.colors.pop()
      this.config.customize.rangeColor.pop()
    },
    addColor () {
      this.colors.push('#fff')
    },
    updateColorScheme (colors) {
      this.colors = [...colors]
      this.config.customize.rangeColor = [...colors]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/style/settingWrap.scss';
@import '../../assets/style/bsTheme.scss';
// 筛选条件的按钮样式
.add-filter-box {
  position: relative;
  .add-filter {
    margin-left: 90px;
    margin-bottom: 10px;
  }
  .add-filter-btn {
    position: absolute;
    top: 0;
  }
}
.lc-field-body {
  padding: 12px 16px;
}
</style>
