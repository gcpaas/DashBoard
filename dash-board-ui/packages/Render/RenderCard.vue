<!--
 * @description: 渲染组件
 * @Date: 2022-08-18 09:42:45
 * @Author: xingheng
-->

<template>
  <div class="render-item-wrap">
    <header class="top-title">
      <span>{{ title }}</span>
      <div
        class="img-btn-svg"
        @click="openDialog"
      >
        <icon-svg
          :name="icons[5]"
        />
      </div>
    </header>
    <div class="render-item-wrap-inner">
      <component
        :is="resolveComponentType(config.type)"
        :id="`${config.code}`"
        :ref="config.code"
        :key="config.key"
        :config="config"
      />
    </div>
    <el-dialog
      v-if="formVisible"
      :visible.sync="formVisible"
      :append-to-body="true"
      :title="config.title"
      class="db-dialog-wrap db-el-dialog"
      width="50%"
      destroy-on-close
    >
      <div
        class="dialog-box"
        style="height: 500px"
      >
        <component
          :is="resolveComponentType(config.type)"
          :id="`${config.code}${config.key}`"
          :ref="config.code"
          :key="keyCodes"
          :config="config"
          :is-dialog="isDialog"
        />
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import { resolveComponentType } from 'dashPackages/js/utils'
import pcComponent from 'dashPackages/js/utils/componentImport'
import { dataInit, destroyedEvent } from 'dashPackages/js/utils/eventBus'
import CustomComponent from '../PlotRender/index.vue'
import Svgs from '../Svgs/index.vue'
import RemoteComponent from 'dashPackages/RemoteComponents/index.vue'
import IconSvg from 'dashPackages/SvgIcon'
import Icon from 'dashPackages/assets/images/pageIcon/export'
const components = {}
for (const key in pcComponent) {
  if (Object.hasOwnProperty.call(pcComponent, key)) {
    components[key] = pcComponent[key]
  }
}
console.log(pcComponent)
export default {
  name: 'RenderCard',
  components: {
    IconSvg,
    ...components,
    CustomComponent,
    Svgs,
    RemoteComponent
  },
  props: {
    // 卡片的属性
    config: {
      type: Object,
      default: () => ({})
    },
    ruleKey: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      keyCodes: new Date().getTime(),
      isDialog: true,
      formVisible: false,
      icons: Icon.getNameList()
    }
  },
  computed: {
    title () {
      return this.config.title
    }
  },
  mounted () {
    // 调用初始化方法
    dataInit(this)
  },
  beforeDestroy () {
    destroyedEvent()
  },
  methods: {
    ...mapMutations('dashboard', [
      'changeChartConfig'
    ]),
    openDialog () {
      this.keyCodes = new Date().getTime()
      this.formVisible = true
    },
    resolveComponentType
  }
}
</script>

<style lang="scss" scoped>
.db-el-dialog{
  ::v-deep .el-dialog__body{
    overflow-y: hidden !important;
  }

}
.render-item-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
  background-color: var(--db-background-1);

  .top-title {
    color: var(--db-el-title);
    padding: 8px 8px 8px 0;
    line-height: 20px;
    border-bottom: 1px solid #f5f5f5;
    font-size: 14px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    span {
      display: inline-block;
      border-left: 3px solid var(--db-el-color-primary);
      padding-left: 16px;
    }
  }
  .render-item-wrap-inner {
    flex: 1;
    height: calc(100% - 40px);
    position: relative;
  }
  .img-btn-svg{
    &:hover{
      cursor: pointer;
    }
  }
}
</style>
