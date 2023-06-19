<!--
 * @description: 数字卡片指标设置组件
 * @Date: 2023-02-14
 * @Author: liu.shiyi
-->
<template>
  <div>
    <!-- <el-collapse-item name="relations"> -->
    <!-- <template slot="title">
      <div class="lc-field-head">
        <div class="lc-field-title">
          数据配置
        </div>
      </div>
    </template> -->
    <div class="lc-field-body">
      <div class="select-item select-item-title">
        <span class="input-wrap">指标</span>
        <span class="input-wrap">操作</span>
      </div>
      <draggable
        :list="config.customize.customizeList"
        :animation="340"
        group="metric"
        handle=".option-drag"
        style="padding: 10px"
        @end="onEnd"
      >
        <template>
          <div
            v-for="(customize, index) in config.customize.customizeList"
            :key="index"
            class="select-item"
          >
            <div class="select-line-icon option-drag">
              <i class="el-icon-rank" />
            </div>
            <div class="input-wrap">
              <el-form-item
                label-width="0px"
                :prop="'customize.customizeList.'+index + '.metric'"
                :rules="rules.metric"
              >
                <el-select
                  v-model="customize.metric"
                  clearable
                  @change="chooseMetric($event,index)"
                >
                  <el-option
                    v-for="(field, i) in dataSourceDataList"
                    :label="field.comment"
                    :value="field.name"
                    :key="i"
                  >
                    <div class="source-key-option">
                      <div>
                        {{ field.comment !== "" ? field.comment : field.name }}
                      </div>
                      <div class="option-txt">
                        {{ field.name }}
                      </div>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="input-wrap">
              <div
                class="select-line-icon option-add"
                @click="setMetric(customize)"
              >
                <el-tooltip effect="dark" content="指标设置" placement="top">
                  <i class="el-icon-setting" />
                </el-tooltip>
              </div>
              <div
                class="select-line-icon option-delete"
                @click="deleteMetric(index)"
              >
                <i class="el-icon-remove-outline" />
              </div>
            </div>
          </div>
        </template>
      </draggable>

      <el-button type="primary" v-block @click="addMetric">新增指标</el-button>
    </div>
    <!-- </el-collapse-item> -->
  <metric-config :setting-visible.sync="settingVisible"  :customizeConfig="currentCustomizeConfig" @updateCustomizeConfig="updateCustomizeConfig"></metric-config>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import MetricConfig from './MetricConfig'
import { mapMutations } from 'vuex'
export default {
  name: 'MetricSetting',
  components: {
    draggable,
    MetricConfig
  },
  directives: {
    block: {
      bind(el, binding) {
        el.style.width = binding.value || '100%'
      }
    }
  },
  props: {
    config: {
      type: Object,
      default: () => {}
    },
    dataSourceDataList: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      settingVisible: false, // 指标设置弹窗
      currentCustomizeConfig:{},
      rules: {
        metric: [
          { required: true, trigger: "change", message: "请选择指标" },]
      }
    }
  },
  computed: {
    // 当前已经关联的组件key
    currentLinkComponentKey() {
      return this.config.linkage.components?.map(item => item.componentKey) || []
    }
  },
  mounted() {},
  beforeDestroy() {
    this.changeActiveCode('')
  },
  methods: {
    ...mapMutations('dashboard', [
      'changeActiveCode'
    ]),
    // 拖拽结束
    onEnd() {
      this.config.dataSource.metricFieldList = this.config.customize.customizeList.map(customize => customize.metric)
    },
    // 选择指标时
    chooseMetric(e,index) {
      const i = this.dataSourceDataList.findIndex((item)=> e === item.name)
      this.config.customize.customizeList[index].descriptionField = this.dataSourceDataList[i]?.comment
      this.config.dataSource.metricFieldList[index]=e
      this.$store.commit('dashboard/changeActiveItemConfig', this.config)
    },
    // 更新指标配置
    updateCustomizeConfig(customize) {
      const index = this.config.customize.customizeList.findIndex(
        item => item.metric === customize.metric
      );
      this.config.customize.customizeList[index] = customize
      this.$store.commit('dashboard/changeActiveItemConfig', this.config)
    },
    /**
     * @description: 添加指标
     */
    addMetric () {
      this.config.customize.customizeList.push({
        metric:'',//指标
        descriptionField:'',//指标名称
        metricFontSize: 30,//指标字体大小
        metricFontWeight: 700,//指标字体权重
        metricColor:'',//指标字体颜色
        descriptionFontSize: 16,//描述字体大小
        descriptionWeight: 400,//描述字体权重
        descriptionColor:'',//描述字体颜色
        numberFormat: "kilobit",//指标格式
      });
      this.config.dataSource.metricFieldList.push('')
    },
    /**
     * @description: 删除指标
     */
    deleteMetric(index) {
      this.config.customize.customizeList.splice(index, 1);
      this.config.dataSource.metricFieldList.splice(index, 1);
    },
    /**
     * @description: 设置指标弹窗打开
     */
    setMetric(customize) {
      this.currentCustomizeConfig = customize
      this.settingVisible = true
    },
  }
}
</script>

<style scoped lang="scss">
  /deep/ .el-tabs__nav-scroll {
    display: flex;
    justify-content: center;
  }

  /deep/ .el-tabs__nav-wrap::after {
    height: 0;
  }

  /deep/ .el-collapse-item__header {
    background: #f2f3f5;
    height: 32px;
    padding: 0 12px;
  }

  /deep/ .el-collapse-item__content {
    padding-bottom: 0;
  }

  .lc-field-body {
    padding: 12px;
  }

  /deep/ .el-tabs__nav-scroll {
    display: flex;
    justify-content: center;
  }

  /deep/ .el-tabs__nav-wrap::after {
    height: 0;
  }

  /deep/ .el-tabs__content {
    /*overflow-y: auto;*/
  }
  .design-tab-warp {
    padding: 10px;
  }
  /deep/.el-tabs--top {
    height: 100%;
  }
  /deep/ .el-tabs__content {
    height: calc(100% - 85px);
    overflow-y: auto;
  }
  .setting-body {
    height: 100%;
  }
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
  .select-item {
    display: flex;
    margin-bottom: 8px;
    cursor: pointer;
    align-items: center;
    border: 1px solid #fff;
    padding: 4px;

    .input-wrap {
      flex: 1;
      display: flex;
      justify-content: center;
      margin-right: 2px;

      /deep/.el-form-item {
        margin-bottom: 0 !important;
      }

      .el-input-number--mini {
        width: 90px !important;
      }
    }
    .input-wrap_left {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: left;
    }

    .select-line-icon {
      width: 30px;
      font-size: 18px;
      cursor: pointer;
      text-align: center;
    }

    .option-delete {
      color: #f56c6c;
    }
  }
  .select-item-active {
    border: 1px solid #007aff;
    background: #007aff30;
  }
  .option-drag {
    cursor: move !important;
    width: 30px;
    font-size: 24px;
  }
</style>
