<template>
  <div class="db-manage-main-wrap">
    <side-menu />
    <menu-content />
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
      catalogInfo: ''
    }
  },
  mounted () {},
  methods: { }
}
</script>

<style lang="scss" scoped>
.db-manage-main-wrap {
  display: flex;
  flex-direction: row;
  // margin:16px 16px 16px 0
}
</style>
