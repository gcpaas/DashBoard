<template>
  <div class="db-setting-wrap">
    <el-form
      ref="form"
      :model="config"
      label-width="90px"
      label-position="left"
      class="setting-body"
    >
      <div class="setting-inner-wrap">
        <el-form
          :model="config.customize"
          label-position="left"
          class="setting-body"
          label-width="90px"
        >
          <SettingTitle>标题</SettingTitle>
          <div class="lc-field-body">
            <el-form-item label="链接名称">
              <el-input
                v-model="config.title"
                clearable
              />
            </el-form-item>
          </div>
          <SettingTitle>基础</SettingTitle>
          <div class="lc-field-body">
            <div
              v-for="(link, index) in config.customize.linkList"
              :key="index"
              class="link-set-item"
            >
              <el-form-item
                label="名称"
                :rules="rules.name"
                :prop="'linkList.' + index + '.name'"
              >
                <el-input
                  v-model="link.name"
                  type="text"
                />
              </el-form-item>
              <el-form-item
                label="链接地址"
                :rules="rules.url"
                :prop="'linkList.' + index + '.url'"
              >
                <el-input
                  v-model="link.url"
                  type="text"
                />
              </el-form-item>
              <el-form-item
                label="打开方式"
              >
                <el-select
                  v-model="link.target"
                  placeholder="请选择打开方式"
                  clearable
                >
                  <el-option
                    v-for="item in [
                      { label: '当前窗口', value: '_self' },
                      { label: '新窗口', value: '_blank' },
                      { label: '本工程', value: 'push' }
                    ]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                label="图标选择"
                label-width="100px"
              >
                <IconSelect
                  ref="IconSelect"
                  :link="{
                    icon: link.icon,
                    iconColor: link.iconColor
                  }"
                  @showChooseIcon="showChooseIcon(...arguments, link, index)"
                  @chooseIcon="chooseIcon"
                />
              </el-form-item>
              <div class="opt-wrap">
                <el-button
                  type="default"
                  :disabled="config.customize.linkList.length === 1"
                  @click="delLink(index)"
                >
                  删除
                </el-button>
                <el-button
                  type="default"
                  @click="addLinkIcon(index)"
                >
                  新增
                </el-button>
                <el-button
                  type="default"
                  icon="el-icon-bottom"
                  @click="down(index)"
                />
                <el-button
                  type="default"
                  icon="el-icon-top"
                  @click="up(index)"
                />
              </div>
            </div>
          </div>
        </el-form>
      </div>
    </el-form>
  </div>
</template>
<script>
import IconSelect from './IconSelect/index.vue'
import SettingTitle from 'packages/SettingTitle/index.vue'
export default {
  name: 'BarSetting',
  components: {
    SettingTitle,
    IconSelect
  },
  data () {
    return {
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入链接地址', trigger: 'blur' },
          { type: 'url', message: '请输入正确的链接地址', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    config: {
      get () {
        return this.$store.state.dashboard.activeItemConfig
      },
      set (val) {
        this.$store.state.dashboard.activeItemConfig = val
      }
    }
  },
  watch: {},
  mounted () {},
  methods: {
    addLinkIcon (index) {
      this.config.customize.linkList.splice(index + 1, 0, {
        name: '',
        url: '',
        target: '_blank',
        icon: '17A发送',
        iconColor: '#007aff'
      })
    },
    delLink (index) {
      this.config.customize.linkList.splice(index, 1)
      this.$forceUpdate()
    },
    down (index) {
      if (index === this.config.customize.linkList.length - 1) {
        return
      }
      const temp = this.config.customize.linkList[index]
      this.config.customize.linkList[index] = this.config.customize.linkList[index + 1]
      this.config.customize.linkList[index + 1] = temp
      this.$forceUpdate()
    },
    up (index) {
      if (index === 0) {
        return
      }
      const temp = this.config.customize.linkList[index]
      this.config.customize.linkList[index] = this.config.customize.linkList[index - 1]
      this.config.customize.linkList[index - 1] = temp
      this.$forceUpdate()
    },
    handleClick (val) {
      this.$set(this, 'activeName', val.name)
    },
    // 取消
    close () {
      this.$emit('closeRightPanel')
    },
    showChooseIcon (link, index) {
      this.$refs.IconSelect[index].init({
        ...link,
        index
      })
    },
    chooseIcon (icon) {
      this.config.customize.linkList[icon.index].icon = icon.icon
      this.config.customize.linkList[icon.index].iconColor = icon.iconColor
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../~packages/assets/style/settingWrap.scss';
.db-setting-wrap {
  /deep/ .el-form-item{
    margin-bottom: 14px!important
  }
  .setting-inner-wrap {
    overflow: auto;
    padding: 0 8px;
  }
  .link-set-item {
    // position: relative;
    border: 1px solid #f5f7fa;
    padding: 30px 16px 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;

    .del-icon {
      cursor: pointer;
      position: absolute;
      right: 10px;
      top: 5px;
      font-size: 20px;
      color: #f00;
    }

    .opt-wrap {
      display: flex;
      justify-content: center;
    }
  }

  .add-link-btn {
    width: 100%;
  }

  /deep/.el-button--primary  {
    span {
      margin: 0 auto;
    }
  }
}

</style>
