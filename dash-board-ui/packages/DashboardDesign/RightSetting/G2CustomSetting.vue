<template>
  <div class="db-setting-wrap">
    <el-form
      ref="form"
      :model="config"
      :rules="customRules"
      label-width="120px"
      label-position="left"
      class="setting-body"
    >
      <SettingTitle>基础</SettingTitle>
      <div class="lc-field-body">
        <el-form-item
          label="标题"
          label-width="120px"
        >
          <el-input
            v-model="config.title"
            placeholder="请输入标题"
            clearable
          />
        </el-form-item>
      </div>
      <template v-for="group in groupList">
        <div :key="group.groupName">
          <SettingTitle>   {{ group.groupName | filterGroupName }}</SettingTitle>
          <div class="lc-field-body">
            <div
              v-for="(setting, settingIndex) in group.list"
              :key="settingIndex+1"
            >
              <el-form-item
                :label="setting.type=== 'padding' ? '' : setting.label"
                :label-width="setting.type=== 'padding' ? '0px' :'120px'"
              >
                <el-input
                  v-if="setting.type === 'input'"
                  v-model="setting.value"
                  :placeholder="`请输入${setting.label}`"
                  clearable
                />
                <el-select
                  v-else-if="setting.type === 'select'"
                  v-model="setting.value"
                  popper-class="db-el-select"
                  class="db-el-select"
                  :placeholder="`请选择${setting.label}`"
                  clearable
                >
                  <el-option
                    v-for="(opt, optIndex) in setting.options"
                    :key="optIndex"
                    :label="opt.label"
                    :value="opt.value"
                  />
                </el-select>
                <template v-else-if="setting.type === 'colorSelect'">
                  <color-select
                    v-model="colorScheme"
                    @update="updateColorScheme"
                  />
                  <div
                    style="
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                  "
                    class="color-picker-box"
                  >
                    <el-color-picker
                      v-for="(colorItem, colorItemIndex) in colors"
                      :key="colorItemIndex"
                      v-model="setting.value[colorItemIndex]"
                      popper-class="db-el-color-picker"
                      show-alpha
                      class="start-color"
                    />
                    <span
                      class="el-icon-circle-plus-outline"
                      style="color: #007aff; font-size: 20px"
                      @click="addColor"
                    />
                    <span
                      v-if="colors.length"
                      class="el-icon-remove-outline"
                      style="color: #ea0b30; font-size: 20px"
                      @click="delColor()"
                    />
                  </div>
                </template>
                <el-color-picker
                  v-else-if="setting.type === 'colorPicker'"
                  v-model="setting.value"
                  popper-class="db-el-color-picker"
                  show-alpha
                />
                <!-- 渐变色设置 -->
                <GradualSetting
                  v-else-if="setting.type === 'gradual'"
                  v-model="setting.value"
                />
                <el-input-number
                  v-else-if="setting.type === 'inputNumber'"
                  v-model="setting.value"
                  class="db-el-input-number"
                  :max="setting.max || 100"
                  :min="setting.min || 0"
                  :step="Number(setting.step) || 1"
                />
                <el-radio-group
                  v-else-if="setting.type === 'radio'"
                  v-model="setting.value"
                >
                  <template v-for="(opt, optIndex) in setting.options">
                    <el-radio-button
                      :key="optIndex"
                      :label="opt.value"
                    >
                      {{ opt.label }}
                    </el-radio-button>
                  </template>
                </el-radio-group>
                <el-switch
                  v-else-if="setting.type === 'switch'"
                  v-model="setting.value"
                />
                <el-switch
                  v-else-if="setting.type === 'switchNumber'"
                  v-model="setting.value"
                  :active-value="1"
                  :inactive-value="0"
                />
                <el-slider
                  v-else-if="setting.type === 'slider'"
                  v-model="setting.value"
                  :min="0"
                  :max="1"
                  :step="0.01"
                />
                <PaddingSetting
                  v-else-if="setting.type === 'padding'"
                  v-model="setting.value"
                />
              </el-form-item>
            </div>
          </div>
        </div>
      </template>
      <!-- </div> -->
    </el-form>
  </div>
</template>
<script>
import SettingTitle from 'packages/SettingTitle/index.vue'
import { chartSettingMixins } from 'packages/js/mixins/chartSettingMixins'
import ColorSelect from 'packages/ColorMultipleSelect/index.vue'
// import ColorPicker from 'packages/ColorPicker/index.vue'
import PaddingSetting from 'packages/DashboardDesign/RightSetting/PaddingSetting/index.vue'
import GradualSetting from 'packages/DashboardDesign/RightSetting/GradualSetting/index.vue'
import PosWhSetting from 'packages/DashboardDesign/RightSetting/PosWhSetting.vue'
export default {
  name: 'CustomComponentSetting',
  components: {
    ColorSelect,
    // ColorPicker,
    PaddingSetting,
    GradualSetting,
    PosWhSetting,
    SettingTitle
  },
  mixins: [chartSettingMixins],
  data () {
    return {
      groupList: []
    }
  },
  filters: {
    filterGroupName (val) {
      const settingGroup = {
        basic: '基础',
        graph: '图表',
        grid: '网格线',
        legend: '图例',
        xAxis: 'X轴',
        yAxis: 'Y轴',
        padding: '边距',
        other: '其他'

      }
      return settingGroup[val]
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
    },
    appCode: {
      get () {
        return this.$store.state.dashboard.pageInfo.appCode
      }
    },
    pageCode () {
      return this.$route.query.code
    }
  },
  watch: {},
  mounted () {
    const groupNameList = []
    this.config.setting.filter(
      (item) => item.tabName === 'custom'
    ).forEach(item => {
      if (item.tabName === 'custom' && item.groupName) {
        if (!groupNameList.includes(item.groupName)) {
          groupNameList.push(item.groupName)
          this.groupList.push({
            groupName: item.groupName,
            list: [item]
          })
        } else {
          this.groupList.find(group => group.groupName === item.groupName).list.push(item)
        }
      } else {
        if (this.groupList.find(group => group.groupName === 'other')) {
          this.groupList.find(group => group.groupName === 'other').list.push(item)
        } else {
          this.groupList.push({
            groupName: 'other',
            list: [item]
          })
        }
      }
    })
    for (let i = 0; i < this.groupList.length; i++) {
      if (this.groupList[i].groupName === 'other') {
        const otherObject = this.groupList.splice(i, 1)[0]
        this.groupList.push(otherObject)
        break
      }
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
@import '~packages/assets/style/settingWrap.scss';

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
  padding:12px 16px;
}
.el-form-item{
  margin-bottom: 6px !important;
}
.lc-field-title {
  position: relative;
  padding-left: 12px;
  line-height: 30px;
  height: 30px;
  margin-bottom: 12px;
  &:after {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    content: '';
    width: 4px;
    height: 14px;
    background-color: var(--db-el-color-primary);
  }
}

::v-deep .el-color-picker__trigger {
  border-color: var(--db-el-border);
}
.color-picker-box{
  ::v-deep .el-color-picker__trigger {
    width: 27px!important;
  }
}
</style>
