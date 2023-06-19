<template>
  <div
    style="width: 100%; height: 100%"
    class="db-design-wrap"
  >
    <div
      :key="updateKey"
      class="custom-border-box"
      :style="{
        height: lineHeight + 'px',
        opacity: opacity / 100,
        'background-image': `linear-gradient(to right, ${
          gradientColor0 ? gradientColor0 : gradientColor1
        } , ${gradientColor1 ? gradientColor1 : gradientColor0})`
      }"
    />
  </div>
</template>
<script>
import { refreshComponentMixin } from 'packages/js/mixins/refreshComponent'
export default {
  name: 'HorizontalLine',
  components: {},
  mixins: [refreshComponentMixin],
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
    lineHeight () {
      return this.config.customize.height || 40
    },
    gradientColor0 () {
      return this.config.customize.gradientColor0 || ''
    },
    gradientColor1 () {
      return this.config.customize.gradientColor1 || ''
    },
    opacity () {
      return this.config.customize.opacity || 100
    }
  },
  watch: {},
  mounted () {},
  methods: {}
}
</script>

<style lang="scss" scoped>
  @import '~packages/assets/style/chartStyle.scss';
.db-design-wrap {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: transparent;

  .custom-border-box {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

/*滚动条样式*/
/deep/::-webkit-scrollbar {
  width: 4px;
  border-radius: 4px;
  height: 4px;
}

/deep/::-webkit-scrollbar-thumb {
  background: #dddddd !important;
  border-radius: 10px;
}
</style>
