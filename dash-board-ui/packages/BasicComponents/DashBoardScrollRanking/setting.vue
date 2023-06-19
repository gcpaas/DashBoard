<template>
  <div class="db-setting-wrap">
    <el-form
      ref="form"
      :model="config"
      class="setting-body"
      label-position="left"
      label-width="90px"
    >
      <el-form
        :model="config.customize"
        class="setting-body"
        label-position="left"
        label-width="90px"
      >
        <SettingTitle>标题</SettingTitle>
        <el-form-item
          label-width="100px"
          class="lc-field-body"
          label="排名表名称"
        >
          <el-input
            v-model="config.title"
            clearable
          />
        </el-form-item>
        <SettingTitle>基础</SettingTitle>
        <div class="lc-field-body">
          <el-form-item
            label="高亮显示数量"
            label-width="100px"
          >
            <el-input-number
              v-model="config.customize.highlightNum"
              :min="1"
              @change="highlightNumChange"
            />
          </el-form-item>
          <el-form-item
            v-for="(highlightItem, index) in config.customize
              .highlightStyle"
            :key="index"
            :label="'排名' + (index + 1) + '高亮样式'"
            label-width="100px"
          >
            <ColorPicker
              v-model="highlightItem.highlightColor"
              :predefine="predefineThemeColors"
            />
          </el-form-item>
        </div>
      </el-form>
    </el-form>
  </div>
</template>
<script>
import SettingTitle from 'packages/SettingTitle/index.vue'
import ColorPicker from 'packages/ColorPicker/index.vue'
export default {
  name: 'BarSetting',
  components: {
    ColorPicker,
    SettingTitle
  },
  data () {
    return {
      // 预设主题色
      predefineThemeColors: [
        '#007aff',
        '#1aa97b',
        '#ff4d53',
        '#1890FF',
        '#DF0E1B',
        '#0086CC',
        '#2B74CF',
        '#00BC9D',
        '#ED7D32'
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
  },
  methods: {
    highlightNumChange (len) {
      if (len - this.config.customize.highlightStyle.length >= 0) {
        for (
          let i = 0;
          i <= len - this.config.customize.highlightStyle.length;
          i++
        ) {
          this.config.customize.highlightStyle.push({
            highlightColor: '#314659',
            mark: this.config.customize.highlightStyle.length
          })
        }
      } else {
        this.config.customize.highlightStyle = this.config.customize.highlightStyle.splice(
          0,
          len
        )
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.lc-field-body {
  padding: 12px 16px;
}
</style>
