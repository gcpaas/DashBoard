<!--
 * @description: 底部导航栏
 * @Date: 2022-10-08 18:01:25
-->
<template>
  <div class="tab-bar-wrap">
    <van-tabbar fixed route v-model="active">
      <van-tabbar-item v-for="(item, index) in data" :to="item.to" :key="index" @click="clickTab(index)">
        <template #icon="props">
          <icon-svg :name="item.icon" class="icon" :style="{ fill: props.active ? '#3E73FD' : '#CCCCCC' }" />
          <span class="name" :style="{ color: props.active ? '#3E73FD' : '#CCCCCC' }">{{ item.title }}</span>
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
export default {
  name: 'TabBar',
  props: {
    defaultActive: {
      type: Number,
      default: 0
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      active: this.defaultActive
    }
  },
  methods: {
    clickTab(value) {
      this.$emit('click', value)
    }
  }
}
</script>

<style lang="less" scoped>
.tab-bar-wrap {
  height: 70px;
  .icon {
    width: 18px;
    height: 18px;
  }
  :deep(.van-tabbar-item) {
    padding-top: 12px !important;
  }
  :deep(.van-tabbar-item__icon) {
    text-align: center;
    svg {
      margin-bottom: 4px;
    }
    .name {
      display: block;
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
    }
  }
}
</style>
