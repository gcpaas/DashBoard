<template>
  <div class="dashboard-home-wrap">
    <header class="dashboard-home-wrap-top">
      <div class="logo-title">
        <img
          class="logo"
          :src="logo"
        >
        <span>{{ title || 'GCPAAS仪表盘设计器' }}</span>
      </div>

      <div class="dashboard-nav-container">
        <Nav
          :navs="tabList"
          @change="changeTab"
        />
      </div>
      <a
        class="fork-me-on-gitee"
        href="https://gitee.com/gcpaas/DashBoard"
        target="_blank"
      >
        <img
          src="https://gitee.com/gcpaas/DashBoard/widgets/widget_1.svg?color=007bff"
          alt="Fork me on Gitee"
        >
      </a>
    </header>
    <div class="dashboard-router-view-wrap">
      <keep-alive>
        <router-view />
      </keep-alive>
    </div>
  </div>
</template>
<script>
import Nav from './NavTop.vue'
// import Nav from './Nav.vue'
export default {
  name: 'BigScreenHome',
  components: {
    Nav
  },
  props: [],
  data () {
    return {
      // 和此处路由保持一致，将会激活tab，请按需更改
    }
  },
  computed: {
    title () {
      if (this.$route.query.edit) return '仪表盘设计器'
      return window?.DS_CONFIG?.starter?.title
    },
    logo () {
      return window?.DS_CONFIG?.starter?.logo || require('./images/logo.png')
    },
    tabList () {
      if (this.$route.query.edit) {
        return [
          {
            id: 1,
            name: '资源库',
            path: window?.DS_CONFIG?.routers?.sourceUrl || '/dashboard-source',
            icon: 'icon-tupian'
          },
          {
            id: 2,
            name: '组件库',
            path: window?.DS_CONFIG?.routers?.componentUrl || '/dashboard-components',
            icon: 'icon-zujian1'
          }
        ]
      }
      return [
        {
          id: 0,
          name: '仪表盘管理',
          path: window?.DS_CONFIG?.routers?.pageListUrl || '/dashboard-list',
          icon: 'icon-icon-shujudaping'
        },
        // {
        //   id: 1,
        //   name: '模版管理',
        //   path: window?.DS_CONFIG?.routers?.templateListUrl || '/dashboard-template',
        //   icon: 'icon-xiangmuwenjianmobanku_mobanku'
        // },
        {
          id: 1,
          name: '资源库',
          path: window?.DS_CONFIG?.routers?.sourceUrl || '/dashboard-source',
          icon: 'icon-tupian'
        },
        {
          id: 2,
          name: '组件库',
          path: window?.DS_CONFIG?.routers?.componentUrl || '/dashboard-components',
          icon: 'icon-zujian1'
        },
        {
          id: 3,
          name: '数据源管理',
          path:
            window?.DS_CONFIG?.routers?.dataSourceUrl ||
            '/dashboard-dataSource',
          icon: 'icon-datafull'
        },
        {
          id: 4,
          name: '数据集管理',
          path: window?.DS_CONFIG?.routers?.dataSetUrl || '/dashboard-dataSet',
          icon: 'icon-data'
        }
      ]
    }
  },
  mounted () {
    if (this.$route.query.edit) {
      document.title = '智能报表平台-仪表盘设计器'
    }
  },
  methods: {

    changeTab (tab) {
      if (this.$route.query.edit) {
        this.$router.push({
          path: tab.path,
          query: { edit: 1 }
        })
      } else {
        this.$router.push({
          path: tab.path
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-home-wrap > * {
  box-sizing: border-box;
}
.dashboard-home-wrap {
  position: relative;
  overflow: hidden;
  height: 100vh;

  .dashboard-home-wrap-top {
    position: absolute;
    top: 0;
    width: 100%;
    height: 150px;
    background-image: url('../../Layout/BigScreenHomeLayout/images/nav_img.png');
    background-size: 100% 150px;
    background-color: #ffffff;
    background-position: center right;

    .logo-title {
      font-size: 30px;
      position: absolute;
      z-index: 23;
      top: 40px;
      left: 40px;
      display: flex;
      align-items: center;
      color: var(--db-el-color-primary);

      .logo {
        height: 30px;
      }

      span {
        font-family: Source Han Sans CN;
        font-size: 30px;
        font-weight: 700;
        padding-left: 8px;
        -webkit-background-clip: text;
        background-size: 400% 400%;
      }
    }
  }

  .dashboard-router-view-wrap {
    position: absolute;
    top: 150px;
    overflow: hidden;
    width: 100%;
    height: calc(100vh - 150px);
    background-color: var(--db-el-background-2);
    box-sizing: border-box;
    padding:16px 16px 16px 0
  }
}

@keyframes text-animate {
  0% {
    background-position: 0 0;
    -webkit-background-clip: text;
  }

  50% {
    background-position: 0 0;
    -webkit-background-clip: text;
  }

  100% {
    background-position: 0 0;
    -webkit-background-clip: text;
  }
}
.fork-me-on-gitee{
  position: absolute;
  top: 0;
  right: 0;
  z-index: 999;
  img{
    width: 120px;
    height: 120px;
  }
}
</style>
