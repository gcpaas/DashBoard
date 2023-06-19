<template>
  <div class="db-custom-components">
    <div class="db-custom-component-header">
      <div class="left-title">
        <div class="logo-wrap item-wrap">
          <img
            class="menu-img"
            src="~packages/DashboardDesign/images/app.png"
            alt="返回"
            @click="backManagement"
          >
          <span class="logo-text name-span">{{ form.name }}</span>
        </div>
      </div>
      <div class="right-btn-wrap">
        <CusBtn>
          生成图片
        </CusBtn>
        <CusBtn
          :loading="loading"
          @click="save"
        >
          保存
        </CusBtn>
      </div>
    </div>
    <div class="db-custom-component-content">
      <div class="db-custom-component-content-code">
        <div class="left-vue-code component-code">
          <div class="code-tab-header">
            <div class="code-tab">
              VUE组件
            </div>
            <div class="upload-btn">
              <CusBtn @click="upload('vueContent')">
                上传
              </CusBtn>
            </div>
          </div>
          <div class="code-tab-content">
            <!-- <MonacoEditor
              ref="vueContent"
              v-model="form.vueContent"
              class="editor"
              language="html"
            /> -->
            <codemirror
              v-model="form.vueContent"
              :options="vueOptions"
            />
          </div>
        </div>
        <div class="right-setting-code component-code">
          <div class="code-tab-header">
            <div class="code-tab">
              组件配置
            </div>
            <div class="upload-btn">
              <CusBtn @click="upload('settingContent')">
                上传
              </CusBtn>
            </div>
          </div>
          <div class="code-tab-content">
            <codemirror
              v-model="form.settingContent"
              :options="settingOptions"
            />
          </div>
        </div>
      </div>
      <div class="db-custom-component-content-preview">
        <div class="db-preview-inner">
          <BizComponentPreview
            :vue-content="form.vueContent"
            :setting-content="form.settingContent"
          />
        </div>
      </div>
      <!-- 通过计算属性发现accept有问题 -->
      <input
        ref="vueContentFile"
        style="display: none"
        type="file"
        name="file"
        accept=".vue"
        @change="handleBatchUpload"
      >
      <input
        ref="settingContentFile"
        style="display: none"
        type="file"
        name="file"
        accept=".js"
        @change="handleBatchUpload"
      >
    </div>
  </div>
</template>
<script>
import CusBtn from 'packages/DashboardDesign/BtnLoading'
import BizComponentPreview from './Preview'
import { getBizComponentInfo, updateBizComponent } from 'packages/js/api/bigScreenApi'
import { defaultSettingContent, defaultVueContent } from './config/defaultBizConfig'
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/eclipse.css'

import 'codemirror/addon/selection/active-line.js'
import 'codemirror/addon/fold/foldgutter.css' // 代码折叠
import 'codemirror/addon/lint/lint.css'
import 'codemirror/mode/vue/vue.js'

export default {
  name: 'BizComponentDesign',
  components: {
    CusBtn,
    codemirror,
    BizComponentPreview
  },
  props: {},
  data () {
    return {
      form: {
        name: '',
        coverPicture: '',
        settingContent: '',
        vueContent: ''
      },
      currentContentType: 'vueContent',
      loading: false,
      vueOptions: {
        foldGutter: true,
        lineWrapping: true,
        gutters: [
          'CodeMirror-linenumbers',
          'CodeMirror-foldgutter',
          'CodeMirror-lint-markers'
        ],
        theme: 'eclipse',
        tabSize: 4,
        lineNumbers: true,
        line: true,
        indentWithTabs: true,
        smartIndent: true,
        autofocus: false,
        matchBrackets: true,
        mode: 'text/x-vue',
        hintOptions: {
          completeSingle: false
        },
        lint: true
      },
      settingOptions: {
        foldGutter: true,
        lineWrapping: true,
        gutters: [
          'CodeMirror-linenumbers',
          'CodeMirror-foldgutter',
          'CodeMirror-lint-markers'
        ],
        theme: 'eclipse',
        tabSize: 4,
        lineNumbers: true,
        line: true,
        indentWithTabs: true,
        smartIndent: true,
        autofocus: false,
        matchBrackets: true,
        mode: 'text/javascript',
        hintOptions: {
          completeSingle: false
        },
        lint: true
      }
    }
  },
  computed: {
  },
  mounted () {
    this.getBizComponentInfo()
  },
  methods: {
    getBizComponentInfo () {
      const code = this.$route.query.code
      if (code) {
        getBizComponentInfo(code).then(data => {
          this.form = {
            ...data,
            name: data.name,
            coverPicture: data.coverPicture,
            settingContent: data.settingContent || defaultSettingContent,
            vueContent: data.vueContent || defaultVueContent
          }
        })
      }
    },
    upload (type) {
      this.currentContentType = type
      this.$refs[`${this.currentContentType}File`].click()
    },
    handleBatchUpload (source) {
      const file = source.target.files
      const reader = new FileReader() // 新建一个FileReader
      reader.readAsText(file[0], 'UTF-8') // 读取文件

      reader.onload = (event) => {
        const sileString = event.target.result // 读取文件内容
        this.form[this.currentContentType] = sileString
        // input通过onchange事件来触发js代码的，由于两次文件是重复的，所以这个时候onchange事件是没有触发到的，所以需要手动清空input的值
        source.target.value = ''
      }
    },
    backManagement () {
      this.$router.push({
        path: window.DS_CONFIG?.routers?.componentUrl
      })
    },
    save () {
      this.loading = true
      updateBizComponent(this.form).then(() => {
        this.$message.success('保存成功')
      }).catch(() => {
        this.$message.error('保存失败')
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.db-custom-components {
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  color: var(--db-el-text);
  background: var(--db-background-1);
  overflow: hidden;

  > * {
    box-sizing: border-box;
  }

  .db-custom-component-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    padding: 0 16px;
    background: var(--db-background-header);

    .left-title {
      font-size: 16px;
      color: var(--db-background-1);

      .logo-wrap {
        display: flex;
        align-items: center;
      }

      .menu-img {
        width: 18px;
        height: 18px;
        margin-right: 15px;
        margin-left: 9px;
        cursor: pointer;
      }
    }

    .right-btn-wrap {
      display: flex;
      align-items: center;
      height: 100%;

      /deep/.head-btn {
        color: var(--db-background-1);
      }
    }
  }

  .db-custom-component-content {
    flex: 1;
    background: var(--db-background-1);
    display: flex;
    flex-direction: column;

    .db-custom-component-content-code {
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: 400px;
      padding: 16px;

      .left-vue-code {
        width: 60%;
        height: 100%;
        background: var(--db-el-background-1)
      }

      .right-setting-code {
        width: calc(40% - 16px);
        height: 100%;
        background: var(--db-el-background-1)
      }

      .component-code {
        .code-tab-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 40px;

          .code-tab {
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 120px;
            height: 100%;
            color:  var(--db-el-text);
            background: var(--db-el-background-2)
          }

          .upload-btn {
            background: var(--db-el-background-2);
          }
        }

        .code-tab-content {
          height: calc(100% - 40px);
          background: var(--db-el-background-2);
        }
      }
    }

    .db-custom-component-content-preview {
      flex: 1;
      width: 100%;
      padding: 0 16px 16px;

      .db-preview-inner {
        width: 100%;
        height: 100%;
        background: var(--db-el-background-2);
        position: relative;
      }
    }
  }
}
</style>
<style>
  .cm-s-eclipse.CodeMirror,
  .cm-s-eclipse .CodeMirror-gutters
  {
    background: var(--db-el-background-2) !important;
  }
</style>
