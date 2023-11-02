<!--
 * @Descripttion:
 * @Author: liu.shiyi
 * @Date: 2023-06-08 09:57:56
 * @LastEditors: xing.heng
 * @LastEditTime: 2023-06-14 14:25:36
-->
<template>
  <div class="db-design-wrap db-picture">
    <div class="content-box">
      <van-image
        :src="getCoverPicture(config.customize.url) || noImageUrl"
        fit="fill"
        :radius="config.customize.radius"
        :style="{
          width: '100%',
          height: '100%',
          opacity: config.customize.opacity
        }"
        draggable="false"
      >
        <div
          slot="placeholder"
          class="image-slot"
        >
          加载中···
        </div>
      </van-image>
    </div>
  </div>
</template>
<script>
import VanImage from 'vant/lib/image'
import 'vant/lib/image/style'
import Vue from 'vue'
import { getFileUrl } from 'dashPackages/js/utils/file'


Vue.use(VanImage)
export default {
  name: 'PictureChart',
  props: {
    config: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      noImageUrl: require('dashPackages/BasicComponents/Picture/images/noImage.png')
    }
  },
  computed: {},
  watch: {},
  mounted () {},
  methods: {
    // 由于静态组件没有混入公共函数，所以需要定义一个changeStyle方法，以免报错
    changeStyle () {
    },
    /**
     * 获取图片访问地址,如果是相对路径则拼接上文件访问前缀地址
     * @param url
     * @returns {*}
     */
    getCoverPicture (url) {
      return getFileUrl(url)
    }
  }
}
</script>

<style lang="scss" scoped>
.db-design-wrap {
  width: 100%;
  background-color: rgba(0, 0, 0, 0);
  .content-box {
    width: 100%;
    height: 100%;
  }
}
</style>
