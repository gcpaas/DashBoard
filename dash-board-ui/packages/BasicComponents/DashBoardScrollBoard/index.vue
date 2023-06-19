<template>
  <div
    style="width: 100%;height: 100%"
    class="db-design-wrap"
  >
    <dv-scroll-board
      :key="updateKey"
      :class="{'light-theme':customTheme === 'light','auto-theme':customTheme =='auto','dark-theme':customTheme =='dark'}"
      :config="option"
    />
  </div>
</template>
<script>
import DvScrollBoard from '@jiaminghi/data-view/lib/components/scrollBoard/src/main.vue'
import '@jiaminghi/data-view/lib/components/scrollBoard/src/main.css'
import { refreshComponentMixin } from 'packages/js/mixins/refreshComponent'
import commonMixins from 'packages/js/mixins/commonMixins'
import paramsMixins from 'packages/js/mixins/paramsMixins'
import linkageMixins from 'packages/js/mixins/linkageMixins'
export default {
  name: 'ScrollBoard',
  components: {
    DvScrollBoard
  },
  mixins: [refreshComponentMixin, paramsMixins, commonMixins, linkageMixins],
  props: {
    // 卡片的属性
    config: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
    }
  },
  computed: {
    option () {
      return { ...this.config.customize, data: this.config.option?.data, header: this.config.option?.header, columnWidth: this.config.option?.columnWidth, align: this.config.option?.align }
    }
  },
  watch: {
  },
  mounted () {
    this.chartInit()
  },
  methods: {
    buildOption (config, data) {
      const header = []
      const dataList = []
      const alignList = []
      const widthList = []
      if (config.customize.columnConfig.length === 0) {
        const key = []
        for (const i in data.columnData) {
          header.push(data.columnData[i].remark)
          key.push(i)
        }
        data.data.forEach((item) => {
          const arr = []
          header.forEach((x, index) => {
            arr.push(item[key[index]])
          })
          dataList.push(arr)
        })
      } else {
        const key = []
        config.customize.columnConfig.forEach(item => {
          header.push(item.name)
          key.push(item.code)
          alignList.push(item.align)
          widthList.push(item.width)
        })
        data.data.forEach((item) => {
          const arr = []
          header.forEach((x, index) => {
            arr.push(item[key[index]])
          })
          dataList.push(arr)
        })
        if (config.customize.index) {
          if (alignList.length === header.length) {
            alignList.unshift('center')
          }
          if (widthList.length === header.length) {
            widthList.unshift('100')
          }
        } else {
          if (alignList.length !== header.length) {
            alignList.shift()
          }
          if (widthList.length !== header.length) {
            widthList.shift()
          }
        }
      }
      config.option = {
        ...config.option,
        data: dataList,
        header: header,
        columnWidth: [...widthList],
        align: [...alignList]
      }

      return config
    }

  }
}
</script>

<style lang="scss" scoped>
  @import '~packages/assets/style/chartStyle.scss';
</style>
