<template>
  <div class="nav-main">
    <span
      v-for="nav in navs"
      :key="nav.id"
      class="nav-span"
      :class="{ 'nav-active': activeNav === nav.id }"
    >
      <a
        class="nav-link"
        @click="toggleNav(nav)"
      >
        <!-- <span class="nav-icon">
          <i :class="['iconfont-dashboard', nav.icon]" />
        </span> -->
        {{ nav.name }}
      </a>
    </span>
    <span class="nav-span nav-span-last" />
  </div>
</template>

<script lang='ts'>
export default {
  name: 'NavMain',
  components: {},
  data () {
    return {
      nc: null,
      activeNav: 0
    }
  },
  props: {
    navs: {
      type: Array,
      required: true
    }
  },
  watch: {
    $route () {
      const nav = this.navs.find(m => m.path === this.$route.path)
      if (nav) {
        this.activeNav = nav.id
      }
    }
  },
  mounted () {
    const nav = this.navs.find(m => m.path === this.$route.path)
    this.activeNav = nav ? nav.id : 0
  },
  beforeDestroy () {
  },
  methods: {
    toggleNav (nav) {
      this.activeNav = nav.id
      this.$emit('change', nav)
    }
  }

}
</script>

<style lang="scss" scoped>
.nav-main {
  z-index: 10;
  display: flex;
  top: 30px;
  position: sticky;
  width: 100%;
  margin-top: 109px;
  min-width: 1024px;
  user-select: none;
  .nav-span {
    position: relative;
    top: 1px;
    // border-bottom: 1px solid #007aff;
    background-repeat: repeat-x;
    background-position: 0 34px;

    .nav-link {
      display: flex;
      align-items: center;
      justify-content: center;
      // transition: color 0.2s;
      text-decoration: none !important;
      color: var(--db-el-text);
      width: 190px;
      box-sizing: border-box;
      // min-width: 140px;
      line-height: 40px;
      font-size: 14px;
      text-align: left;
      cursor: pointer;

      &.nav-active,
      &:hover {
        // color:var(--db-el-title);
      }
    }

    .nav-icon {
      margin-right: 5px;
    }

    &.nav-active {
      // border-top: 2px solid var(--db-el-color-primary);
      // border-radius: 10px 10px 0px 0;
      // border: 1px solid #007aff;
      background-color: var(--db-el-background-2);
      &:after{
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: var(--db-el-color-primary);
      }
      // .nav-link{
      //   color: #fff !important;
      // }
      // .iconfont-dashboard {
      //   color: #fff !important;
      // }
    }

  }

  .nav-span-last {
    flex: 1;
  }
}
</style>
