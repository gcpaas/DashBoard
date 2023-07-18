<template>
  <div class="db-manage-main-wrap">
    <side-menu @getPageInfo="getPageInfo" />
    <menu-content :catalog-info="catalogInfo" />
  </div>
</template>
<script>
import SideMenu from './SideMenu'
import MenuContent from './MenuContent'
export default {
  name: '',
  props: {
  },
  components: { SideMenu, MenuContent },
  data () {
    return {
      catalogInfo: 'component'
    }
  },
  mounted () {},
  methods: {
    getPageInfo (type) {
      this.catalogInfo = type
    }
  }
}
</script>

<style lang="scss" scoped>
.db-manage-main-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  background:var(--db-el-background-2) ;
}
</style>
