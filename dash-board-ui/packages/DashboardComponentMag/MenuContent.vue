<template>
  <div class="right-screen-list-wrap">
    <ComponentList />
  </div>
</template>
<script>
import ComponentList from 'dashPackages/ComponentList'
export default {
  name: '',
  props: { },
  components: { ComponentList },
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
