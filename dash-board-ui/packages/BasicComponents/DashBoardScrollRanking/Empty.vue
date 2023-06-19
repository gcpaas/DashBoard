<template>
  <div class="el-empty" :style="{ height: height}">
      <div class="img-box">
        <icon-svg
          name="empty"
          class="empty-svg"
        />
      </div>
    <div class="empty-text">{{ text }}</div>
  </div>
</template>

<script>
import IconSvg from 'packages/SvgIcon'
export default {
  name: 'Empty',
  components: {
    IconSvg
  },
  props: {
    text: {
      type: String,
      default: '暂无数据'
    },
    height: {
      type: String,
      default: 'calc(100% - 60px)'
    }
  },
  computed: {
  },
  data(){
    return {
    }
  }
};
</script>
<style lang="scss" scoped>
  .el-empty{
    position: absolute;
    top: 30px;
    width: 100%;
    height: calc(100% - 60px);
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    padding: 0;
    .img-box{
     width: 100%;
      height: calc(100% - 20px);
      .empty-svg{
        display: block;
        width: 40%;
        height: 100%;
        margin: 0 auto;
      }
    }
    .empty-text{
      width: 100%;
      text-align: center;
      height: 20px;
      color: #D3DCEE;
      font-size: 14px;
    }
  }
</style>
