<template>
  <div
    style="width: 100%; height: 100%"
    class="db-design-wrap"
  >
    <!--    <div class="content">-->
    <van-swipe
      class="my-swipe"
      indicator-color="white"
      :width="option.data.length - 1 ? option.width + option.marginRight : option.width"
      :loop="false"
      :show-indicators="false"
    >
      <van-swipe-item
        v-for="(item, index) in option.data"
        :key="index"
        :style="{'padding-right':option.marginRight + 'px'}"
      >
        <div
          class="content_item"
          :style="{
            'border-color': option.borderColor,
            'border-width': option.borderWidth + 'px',
            'background-color': option.bgColor,
            'font-size': option.fontSize + 'px',
            'min-width': option.width + 'px',
            'height': option.height + 'px',
            color: option.color,
            'border-radius': option.borderRadius + 'px',
            'font-weight': option.fontWeight,
            'box-sizing':'border-box',
          }"
        >
          {{ item }}
        </div>
      </van-swipe-item>
    </van-swipe>
    <!--    </div>-->
  </div>
</template>
<script>
import { refreshComponentMixin } from 'dashPackages/js/mixins/refreshComponent'
import commonMixins from 'dashPackages/js/mixins/commonMixins'
import paramsMixins from 'dashPackages/js/mixins/paramsMixins'
import linkageMixins from 'dashPackages/js/mixins/linkageMixins'
import VanSwipe from 'vant/lib/swipe'
import 'vant/lib/swipe/style'
import VanSwipeItem from 'vant/lib/swipe-item'
import 'vant/lib/swipe-item/style'
import Vue from 'vue'
Vue.use(VanSwipe)
Vue.use(VanSwipeItem)
function formatter (number, format) {
  const numbers = number.toString().split('').reverse()
  const segs = []
  while (numbers.length) {
    segs.push(numbers.splice(0, format).join(''))
  }
  return segs.join(',').split('').reverse().join('')
}

export default {
  name: 'DvDigitalFlop',
  components: {
    // DigitalFlop
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
    return {}
  },
  computed: {
    option () {
      if (!this.config.option.data) return { ...this.config.customize, data: [] }
      if (
        this.config.option.data.toString().split('').length <
        this.config.customize.numberDigits
      ) {
        const len =
          this.config.customize.numberDigits -
          this.config.option.data.toString().split('').length
        for (let i = 0; i < len; i++) {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.config.option.data =
            (this.config.customize.placeHolder
              ? this.config.customize.placeHolder
              : ' ') + this.config.option.data
        }
      }
      const a =
        this.config.customize.formatter === 0
          ? this.config.option.data
          : formatter(this.config.option.data, this.config.customize.formatter)
      const arr = a.toString().split('')

      if (this.config.customize.slotRight !== '') {
        arr.push(this.config.customize.slotRight)
      }
      if (this.config.customize.slotLeft !== '') {
        arr.unshift(this.config.customize.slotLeft)
      }
      return {
        ...this.config.customize,
        data: arr
      }
    }
  },
  watch: {},
  mounted () {
  },
  methods: {
    dataFormatting (config, data) {
      let dataList = ''
      if (data.data instanceof Array) {
        dataList = config.dataSource.dimensionField
          ? data.data[0][config.dataSource.dimensionField]
          : data.data[0].value
      } else {
        dataList = data.data[config.dataSource.dimensionField]
      }
      config.option = {
        ...config.option,
        data: dataList
      }
      return config
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/style/chartStyle.scss';
.db-design-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  ::v-deep  .van-swipe-item{
    box-sizing: border-box;
  }
  .content {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
    height: 100%;
    align-items: center;
    &_item {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid rgba(131, 191, 246, 0);
    }
  }
}
.title-box {
  height: 40px;
  padding: 10px 10px 0 0;
  box-sizing: border-box;
  .title {
    font-size: 14px;
    color: #333;
    font-weight: bold;
    border-left: 3px solid #007aff;
    padding-left: 16px;
  }
  .target-value {
    overflow-y: auto;
    height: 60px;
    font-weight: bold;
    width: 100%;
    font-size: 20px;
    color: #333;
    padding: 16px 0 0 22px;
    box-sizing: border-box;
  }
}
.el-icon-warning {
  color: #ffd600;
}
.title-hover {
  &:hover {
    cursor: move;
  }
}
/*滚动条样式*/
::v-deep ::-webkit-scrollbar {
  width: 4px;
  border-radius: 4px;
  height: 4px;
}
::v-deep ::-webkit-scrollbar-thumb {
  background: #dddddd !important;
  border-radius: 10px;
}

</style>
