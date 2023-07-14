<template>
  <div class="numbers-wrap">
    <div
      class="value"
      :style="{fontSize:customize.fontSize + 'px',color:customize.color}"
    >
      {{ num }}
    </div>
  </div>
</template>
<script>
export default {
  name: 'Numbers',
  components: {},
  props: {
    // 卡片的属性
    config: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      customClass: {}
    }
  },
  mounted () {
  },
  watch: {},
  computed: {
    num () {
      if (this.config.option.data && this.config.option.data.length) {
        return this.config.option.data[0][this.config?.option?.yField]
      } else {
        return '暂无数据'
      }
    },
    customize () {
      return this.config.option.customize
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.numbers-wrap{
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
