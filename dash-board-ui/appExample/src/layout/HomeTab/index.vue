<!--
 * @description: 布局，首页的布局，头部头title，底部有导航栏
 * @Date: 2022-10-08 18:01:25
-->

<template>
  <div class="app-container">
    <div ref="content" class="layout-content">
      <router-view />
    </div>
    <div class="layout-footer">
      <TabBar :data="tabbars" @click="jumpToMenu" />
    </div>
  </div>
</template>

<script>
import TabBar from '@/components/TabBar'
export default {
  name: 'AppLayout',
  components: {
    TabBar
  },
  data() {
    return {
      tabbars: [
        {
          title: 'dashboard',
          to: {
            name: 'DashBoard'
          },
          icon: 'task_center'
        }
      ]
    }
  },
  computed: {
    pageName() {
      return this.$route.name
    }
  },
  methods: {
    jumpToMenu(index) {
      this.$router.push({
        name: this.tabbars[index].to.name
      })
      // content滚动到顶部
      this.$refs.content['scrollTop'] = 0
    }
  }
}
</script>
<style lang="less" scoped>
.app-container {
  height: 100vh;
  overflow: hidden;

  .layout-content {
    height: calc(100vh - 50px);
    overflow: auto;
    background: #f6f7fb;
    position: relative;
    box-sizing: border-box;
  }
  .layout-footer {
    height: 50px;
  }
}
</style>
