<!--
 * @description: 跳转
 * @Date: 2022-09-02 09:32:00
 * @Author: xingheng
-->

<template>
  <div class="design-wrap">
    <div class="icons-box-wrap">
      <div
        v-for="(link, index) in config.customize.linkList"
        :key="index"
        class="link-chart-item"
        @click="goToLink(link)"
      >
        <div
          class="icon-wrap"
          :style="{ 'background-color': link.iconColor }"
        >
          <icon-svg
            class="img-btn-svg"
            :style="{
              fill: (link.iconColor) === '#FFFFFF' ? '#0000000' : '#FFFFFF',
            }"
            :name="link.icon"
          />
        </div>
        <div class="link-name">
          {{ link.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IconSvg from 'packages/SvgIcon'
export default {
  name: 'Link',
  components: { IconSvg },
  props: {
    config: {
      type: Object,
      default: () => {
      }
    }
  },
  data () {
    return {}
  },
  computed: {
    pageInfo () {
      return this.$store.state.page.pageInfo
    }
  },
  watch: {},
  mounted () {
  },
  methods: {
    goToLink (link) {
      if (link.target !== 'push' || link.url.indexOf('http://') > -1 || link.url.indexOf('https://') > -1) {
        window.open(link.url, link.target)
      } else {
        const { href } = this.$router.resolve({
          path: '/'
        })
        window.open(href + link.url, '_self')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.design-wrap {
  background: #fff;
  width: 100%;
  height: 100%;
  padding: 10px 0;

  .title {
    font-size: 14px;
    color: #333;
    font-weight: bold;
    border-left: 3px solid #007aff;
    padding-left: 10px;
    &:hover{
      cursor: move;
    }
  }
  .icons-box-wrap {
    height: calc(100% - 20px);
    padding: 16px 16px 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    align-items: center;
    justify-items: center;

    .link-chart-item {
      display: flex;
      flex-direction: column;
      align-items: center;

      .icon-wrap {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        cursor: pointer;

        .icon-svg {
          width: 38px;
          height: 38px;
        }
      }

      .link-name {
        display: inline-block;
        padding: 10px 0;
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 120px;
      }
    }
  }
}

</style>
