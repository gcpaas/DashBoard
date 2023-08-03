<template>
<div></div>
</template>
<script>
export default {
  name: 'Redirect',
  components: {
  },
  data () {
    return {
    }
  },
  created () {
    if(this.$route.query.edit=='source'){
      this.$router.push(window.DS_CONFIG.routers?.SourceUrl)
    }else{
      this.$router.push(window.DS_CONFIG.routers?.componentUrl)
    }

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
</style>
