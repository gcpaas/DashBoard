<template>
  <div class="right-screen-list-wrap">
    <BigScreenList
      :catalog-info="catalogInfo"
      :type="type"
    />
  </div>
</template>
<script>
import BigScreenList from 'dashPackages/DashboardList'
export default {
  name: '',
  props: {
    catalogInfo: {
      type: Object,
      default: () => ({
        isAll: false,
        page: {}
      })
    },
    type: {
      type: String,
      default: 'dashboardCatalog'
    }
  },
  components: { BigScreenList },
  data () {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
.right-screen-list-wrap {
  width: 100%;
}
</style>
