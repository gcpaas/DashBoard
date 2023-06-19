<template>
  <div class="render-item-wrap">
    <header class="top-title">
      <span>{{ title }}</span>
      <div
        class="img-btn-svg"
        @click="openDialog"
      >
        <icon-svg
          v-if="isDesign"
          :name="icons[5]"
        />
        <van-icon v-if="!isDesign" name="enlarge" />
      </div>
    </header>
    <component
      :is="resolveComponentType(config.type)"
      :id="`${config.code}`"
      :ref="config.code"
      :key="config.key"
      :config="config"
    />
    <div v-if="designVisible">
      <el-dialog
        :visible.sync="designVisible"
        :append-to-body="true"
        :title="config.title"
        class="db-dialog-wrap db-el-dialog"
        width="50%"
      >
        <div
          class="dialog-box"
          style="height: 500px"
        >
          <component
            :is="resolveComponentType(config.type)"
            :id="`${config.code}${config.key}`"
            :ref="config.code"
            :key="config.key + 'dialog'"
            :config="config"
            :is-dialog="isDialog"
          />
        </div>
      </el-dialog>
    </div>

    <van-popup
      v-model="previewVisible"
      closeable
      close-icon-position="top-left"
      position="right"
      style="width: 100%;height: 100%"
    >
      <div
        id="dialogBox"
        class="dialog-box"
      >
        <div
          ref="dialogContent"
          class="dialog-content"
        >
          <component
            :is="resolveComponentType(config.type)"
            :id="`${config.code}${config.key}${randomKey}`"
            :ref="config.code"
            :key="config.key + 'dialog' + randomKey"
            class="component-box"
            :config="config"
            :is-dialog="isDialog"
          />
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { resolveComponentType } from 'packages/js/utils'
import pcComponent from 'packages/js/utils/appComponentImport'
import { dataInit, destroyedEvent } from 'packages/js/utils/eventBus'
import CustomComponent from 'packages/PlotRender/index.vue'
import Svgs from 'packages/Svgs/index.vue'
import RemoteComponent from 'packages/RemoteComponents/index.vue'
import IconSvg from 'packages/SvgIcon'
import Icon from 'packages/assets/images/pageIcon/export'
import VanDialog from 'vant/lib/popup'
import 'vant/lib/popup/style'
import VanIcon from 'vant/lib/icon'
import 'vant/lib/icon/style'
import Vue from 'vue'
Vue.use(VanDialog)
Vue.use(VanIcon)
const components = {}
for (const key in pcComponent) {
  if (Object.hasOwnProperty.call(pcComponent, key)) {
    components[key] = pcComponent[key]
  }
}
export default {
  name: 'RenderCard',
  components: {
    ...components,
    CustomComponent,
    Svgs,
    RemoteComponent,
    IconSvg
  },
  props: {
    // 卡片的属性
    config: {
      type: Object,
      default: () => ({})
    },
    isDesign: {
      type: Boolean,
      default: false

    }
  },
  computed: {
    title () {
      return this.config.title
    }
  },
  data () {
    return {
      isDialog: true,
      randomKey: '',
      isMobile: false,
      isLandscape: true,
      designVisible: false,
      previewVisible: false,
      formVisible: false,
      icons: Icon.getNameList()
    }
  },
  beforeDestroy () {
    destroyedEvent()
  },
  mounted () {
    this.isMobileHandel()
    // 调用初始化方法
    dataInit(this)
  },
  methods: {
    // 添加当前设备判断方法
    isMobileHandel () {
      const flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Windows Phone)/i)
      this.isMobile = flag
    },
    resolveComponentType,
    openDialog () {
      if (this.isDesign) {
        this.designVisible = true
      } else {
        this.previewVisible = true
      }

      this.randomKey = new Date().getTime()
    }
  }
}
</script>

<style lang="scss" scoped>
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
    .dialog-box{
      position: relative!important;

      transform: perspective(400px) !important;
      -ms-transform: perspective(400px) !important;
      -moz-transform: perspective(400px) !important;
      -webkit-transform: perspective(400px) !important;
      -o-transform: perspective(400px) !important;
      .dialog-content{
        position: absolute;
        width: 100vh;
        height: 100vw;
        background-color: #ffffff;
        transform:translate(-29%,58%) rotate(-90deg) !important;
        -webkit-transform:translate(-29%,58%) rotate(-90deg) !important;
        -ms-transform:translate(-29%,58%) rotate(-90deg) !important;
        -moz-transform:translate(-29%,58%) rotate(-90deg) !important;
        -o-transform:translate(-29%,58%) rotate(-90deg) !important;
        .exit-btn{
          position: absolute;
          background-color: #ffffff;
          top: 0;
          right: 0;
          z-index: 100;
          font-size: 14px;
        }
        .component-box{
          width: 80% !important;
          height: 80% !important;
          position: absolute;
          top: 50%;
          left: 50%;
          -webkit-transform:translate(-50%,-45%);
          transform:translate(-50%,-45%);
        }
      }
    }
    /deep/.el-table__body-wrapper{
      overflow: auto!important;
    }
  }
</style>
