<template>
  <div
    v-if="rightVisiable"
    class="db-right-panel-wrap"
  >
    <div>
      <SettingTitle>
        {{ chartSettingShow ? `${title}设置` : '仪表盘设置' }}
      </SettingTitle>
      <div :class="!rightVisiable ? 'db-page-right db-page-right-fold' : 'db-page-right'">
        <RightSetting
          v-if="chartSettingShow"
          @closeRightPanel="close"
          @updateSetting="updateSetting"
          @updateDataSetting="updateDataSetting"
        />
        <OverallSetting
          v-if="!chartSettingShow"
          ref="OverallSetting"
          @close="close"
        />
      </div>
    </div>
    <div v-if="!chartSettingShow">
      <SettingTitle>定时器</SettingTitle>
      <el-empty
        v-if="pageInfo.chartList.length === 0"
        description="请添加图表，并绑定数据集"
      />
      <div
        v-else
        class="db-overall-setting-wrap"
      >
        <div class="title">
          <span>时间（秒）</span>
          <span>图表</span>
        </div>
        <div
          v-for="(timer, index) in pageInfo.pageConfig.refreshConfig"
          :key="index"
          class="db-timer-item"
        >
          <el-input-number
            v-model="timer.time"
            class="db-el-input-number"
            :min="0"
            :max="999999"
            :step="1"
            placeholder="请输入定时器时间"
            style="margin-right: 8px;"
          />
          <el-select
            v-model="timer.code"
            popper-class="db-el-select"
            class="db-el-select"
            placeholder="请选择需要刷新的图表"
            @change="chartChange"
          >
            <el-option
              v-for="chart in chartOptions"
              :key="chart.code"
              :label="chart.title"
              :value="chart.code"
              :disabled="chart.disabled"
            />
          </el-select>
          <el-button
            style="margin-left: 8px;"
            @click="deleteTimer(index)"
          >
            删除
          </el-button>
        </div>
        <el-button
          v-if="pageInfo.chartList.filter(chart => chart.dataSource.businessKey).length !== pageInfo.pageConfig.refreshConfig.length"
          type="primary"
          style="width: 100%;"
          @click="createTimer"
        >
          新建
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
import SettingTitle from 'packages/SettingTitle/index.vue'
import RightSetting from 'packages/DashboardDesign/RightSetting/index.vue'
import OverallSetting from 'packages/DashboardDesign/OverallSetting/index.vue'
import { mapState } from 'vuex'
export default {
  name: '',
  components: {
    RightSetting,
    OverallSetting,
    SettingTitle
  },
  props: {
    rightVisiable: {
      type: Boolean,
      default: false
    },
    pageInfoVisiable: {
      type: Boolean,
      default: false
    },
    headerShow: {
      type: Boolean,
      default: true
    },
    height: {
      type: String,
      default: '100vh'
    }
  },
  data () {
    return {
      chartOptions: []
    }
  },
  computed: {
    ...mapState('dashboard', {
      activeItem: state => state.activeItemConfig,
      activeCode: state => state.activeCode,
      pageInfo: (state) => state.pageInfo
    }),
    chartSettingShow () {
      return this.rightVisiable && this.activeCode
    },
    title () {
      return this.activeItem?.title || ''
    }
  },
  watch: {
    'pageInfo.pageConfig.refreshConfig': {
      handler (val) {
        if (Array.isArray(val) && val.length) {
          this.chartOptions.forEach(chart => {
            chart.disabled = val?.findIndex(item => item.code === chart.code) !== -1
          })
        }
      },
      deep: true
    },
    'pageInfo.chartList': {
      handler (val) {
        this.chartOptions = []
        if (Array.isArray(val) && val.length) {
          this.init()
        }
      },
      deep: true
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      if (this.pageInfo.chartList.length === 0) {
        this.pageInfo.pageConfig.refreshConfig = []
      } else {
        this.pageInfo.chartList.forEach(chart => {
          if (chart.dataSource.businessKey) {
            this.chartOptions.push({
              code: chart.code,
              title: chart.title,
              disabled: false
            })
          } else {
            this.pageInfo.pageConfig.refreshConfig = this.pageInfo.pageConfig.refreshConfig.filter(item => item.code !== chart.code)
          }
        })
      }
    },
    toggleShow () {
      this.$emit('update:rightVisiable', !this.rightVisiable)
    },
    close () {
      this.$emit('update:rightVisiable', false)
    },
    updateSetting (config) {
      this.$emit('updateSetting', config)
    },
    updateDataSetting (config) {
      this.$emit('updateDataSetting', config)
    },
    // 创建定时器
    createTimer () {
      const timer = {
        code: '',
        time: 0
      }
      if (!this.pageInfo.pageConfig.refreshConfig) {
        this.pageInfo.pageConfig.refreshConfig = []
      }
      this.pageInfo.pageConfig.refreshConfig.push(timer)
    },
    // 删除定时器
    deleteTimer (timerIndex) {
      this.pageInfo.pageConfig.refreshConfig.splice(timerIndex, 1)
    },
    chartChange (val) {
      this.chartOptions.find(item => item.code === val).disabled = true
    }
  }
}
</script>

<style lang="scss" scoped>
.db-right-panel-wrap {
  display: flex;
  flex-direction: column;
  background-color: var(--db-background-1);

  .db-set-title {
    background-color: var(--db-background-2);
    color: var(--db-el-title);
    height: 40px;
    font-size: 14px;
    border-bottom: 2px solid var(--db-el-background-3);
    display: flex;
    align-items: center;

    .db-set-title-text {
      position: relative;
      padding-left: 12px;
      display: inline-block;

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
  }

  .db-folder-wrap {
    width: 20px;
    position: relative;

    i {
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      font-size: 20px;
      color: #fff;
      cursor: pointer;
      z-index: 1;
    }

    &:hover {
      background: rgba(143, 225, 255, .1)
    }
  }

  .db-page-right {
    // height: calc(100vh - 80px);
    width: 320px;
    box-sizing: border-box;
    background-color: var(--db-background-2);

    .config-title {
      display: flex;
      height: 40px;
      line-height: 40px;
      padding: 0 10px;
      color: #fff;
      font-size: 14px;
      /* border-bottom: 1px solid #ebeef5; */

      .config-title-text {
        display: inline-block;
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    >* {
      color: #fff;
    }

    // 左侧居中伸缩图标
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: -10px;
      width: 10px;
      height: 100%;
      background: #fff;
      cursor: pointer;
      z-index: 1;
    }
  }

  .db-page-right-fold {
    width: 0;
    overflow: hidden;
  }

  .slider-zoom {
    position: absolute;
    bottom: 10px;
    right: -10px;
  }
}

.slide-fade-enter-active {
  transition: all .3s ease;
}

.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter,
.slide-fade-leave-to

/* .slide-fade-leave-active for below version 2.1.8 */
  {
  transform: translateX(10px);
  opacity: 0;
}

/deep/ .el-scrollbar__view {
  height: calc(100vh - 80px);
  overflow-x: unset;
}

.db-overall-setting-wrap {
  padding: 16px;

  .title {
    display: flex;
    justify-content: space-around;
    margin-bottom: 18px;
  }

  .db-timer-item {
    display: flex;
    margin-bottom: 18px;
  }

  ::v-deep .el-select {
    width: 110px;
  }

  ::v-deep .el-input-number {
    width: 100px;
  }
}
</style>
