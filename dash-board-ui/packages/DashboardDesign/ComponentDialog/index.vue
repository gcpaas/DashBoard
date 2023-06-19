<template>
  <el-dialog
    title="组件库"
    :visible.sync="dialogVisible"
    width="80%"
    :modal="true"
    :modal-append-to-body="false"
    :appen-to-body="true"
    class="db-dialog-wrap db-el-dialog"
    @closed="close"
  >
    <div class="content">
      <el-tabs v-model="activeName">
        <el-tab-pane
          label="自定义组件"
          name="combination"
        >
          <div class="dashboard-list-wrap">
            <div class="top-search-wrap">
              <el-input
                v-model="searchKey"
                class="db-el-input"
                placeholder="请输入组件名称"
                prefix-icon="el-icon-search"
                clearable
                @clear="reSearch"
                @keyup.enter.native="reSearch"
              />
              <el-select
                v-model="code"
                class="db-el-select"
                popper-class="db-el-select"
                placeholder="请选择分组"
                clearable
                @change="reSearch"
              >
                <el-option
                  v-for="item in options"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
              <el-button
                size="small"
                style="margin-right: 20px"
                type="primary"
                @click="reSearch"
              >
                搜索
              </el-button>
            </div>
            <div
              v-if="list.length !== 0"
              v-loading="loading"
              class="list-wrap db-scrollbar"
              element-loading-text="加载中"
              :style="{
                display: gridComputed ? 'grid' : 'flex',
                justifyContent: gridComputed ? 'space-around' : 'flex-start'
              }"
            >
              <!-- <div v-if="list.length !== 0"> -->
              <div
                v-for="screen in list"
                :key="screen.id"
                class="dashboard-card-wrap"
                :style="{
                  width: gridComputed ? 'auto' : '290px'
                }"
                @click="chooseComponent(screen)"
              >
                <div
                  :class="focus.id == screen.id ? 'focus' : ''"
                  class="dashboard-card-inner"
                >
                  <div class="dashboard-card-img">
                    <el-image
                      :src="screen.coverPicture"
                      fit="contain"
                      style="width: 100%; height: 100%"
                    >
                      <div
                        slot="placeholder"
                        class="image-slot"
                      >
                        加载中···
                      </div>
                      <div slot="error" class="image-slot" style="font-size: 20px">
                        <div class="error-img-text"> {{ screen.name }}</div>
                      </div>
                    </el-image>
                  </div>
                  <div class="dashboard-bottom">
                    <div
                      class="left-bigscreen-title"
                      :title="screen.name"
                    >
                      {{ screen.name }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-else
              class="empty"
            >
              暂无数据
            </div>
            <div class="footer-pagination-wrap">
              <div class="db-pagination">
                <el-pagination
                  class="db-el-pagination"
                  popper-class="db-el-pagination"
                  background
                  layout="total, prev, pager, next, sizes"
                  :page-size="size"
                  prev-text="上一页"
                  next-text="下一页"
                  :total="totalCount"
                  :page-sizes="[10, 20, 50, 100]"
                  :current-page="current"
                  @current-change="currentChangeHandle"
                  @size-change="sizeChangeHandle"
                />
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="业务组件"
          name="bizComponent"
        >
          <div class="dashboard-list-wrap">
            <div class="top-search-wrap">
              <el-input
                v-model="name"
                class="db-el-input"
                placeholder="请输入组件名称"
                prefix-icon="el-icon-search"
                clearable
                @clear="reSearch"
                @keyup.enter.native="reSearch"
              />
              <el-select
                v-model="code"
                class="db-el-select"
                popper-class="db-el-select"
                placeholder="请选择分组"
                clearable
                @change="reSearch"
              >
                <el-option
                  v-for="item in options"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
              <el-button
                size="small"
                style="margin-right: 20px"
                type="primary"
                @click="reSearch"
              >
                搜索
              </el-button>
            </div>
            <div
              v-if="bizComponentList.length !== 0"
              v-loading="loading"
              class="list-wrap db-scrollbar"
              element-loading-text="加载中"
              :style="{
                display: bizFridComputed ? 'grid' : 'flex',
                justifyContent: bizFridComputed ? 'space-around' : 'flex-start'
              }"
            >
              <!-- <div v-if="list.length !== 0"> -->
              <div
                v-for="screen in bizComponentList"
                :key="screen.id"
                class="dashboard-card-wrap"
                :style="{
                  width: bizFridComputed ? 'auto' : '290px'
                }"
                @click="chooseComponent(screen)"
              >
                <div
                  :class="focus.id == screen.id ? 'focus' : ''"
                  class="dashboard-card-inner"
                >
                  <div class="dashboard-card-img">
                    <el-image
                      :src="screen.coverPicture"
                      fit="contain"
                      style="width: 100%; height: 100%"
                    >
                      <div
                        slot="placeholder"
                        class="image-slot"
                      >
                        加载中···
                      </div>
                    </el-image>
                  </div>
                  <div class="dashboard-bottom">
                    <div
                      class="left-bigscreen-title"
                      :title="screen.name"
                    >
                      {{ screen.name }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-else
              class="empty"
            >
              暂无数据
            </div>
            <div class="footer-pagination-wrap">
              <div class="db-pagination">
                <el-pagination
                  class="db-el-pagination"
                  popper-class="db-el-pagination"
                  background
                  layout="total, prev, pager, next, sizes"
                  :page-size="size"
                  prev-text="上一页"
                  next-text="下一页"
                  :total="totalCount"
                  :page-sizes="[10, 20, 50, 100]"
                  :current-page="current"
                  @current-change="currentChangeHandle"
                  @size-change="sizeChangeHandle"
                />
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="系统组件"
          name="remote"
        >
          <div class="dashboard-list-wrap">
            <div
              v-if="remoteComponentlist.length !== 0"
              v-loading="loading"
              class="list-wrap db-scrollbar"
              element-loading-text="加载中"
              :style="{
                display: remoteComponentsGridComputed ? 'grid' : 'flex',
                justifyContent: remoteComponentsGridComputed ? 'space-around' : 'flex-start'
              }"
            >
              <div
                v-for="component in remoteComponentlist"
                :key="component.title"
                class="dashboard-card-wrap"
                :style="{
                  width: remoteComponentsGridComputed ? 'auto' : '290px'
                }"
                @click="chooseComponent(component)"
              >
                <div
                  :class="component.title == focus.title ? 'focus' : ''"
                  class="dashboard-card-inner"
                >
                  <div class="dashboard-card-img">
                    <el-image
                      :src="component.img"
                      fit="contain"
                      style="width: 100%; height: 100%"
                    >
                      <div
                        slot="placeholder"
                        class="image-slot"
                      >
                        加载中···
                      </div>
                    </el-image>
                  </div>
                  <div class="dashboard-bottom">
                    <div
                      class="left-bigscreen-title"
                      :title="component.title"
                    >
                      {{ component.title }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-else
              class="empty"
            >
              暂无数据
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        class="db-el-button-default"
        @click="dialogVisible = false"
      >
        取消
      </el-button>
      <el-button
        type="primary"
        @click="confirm"
      >
        确定
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { get } from 'packages/js/utils/http'
import { pageMixins } from 'packages/js/mixins/page'
import _ from 'lodash'
import innerRemoteComponents, { getRemoteComponents, getRemoteComponentConfig } from 'packages/RemoteComponents/remoteComponentsList'
import { getBizComponentPage } from 'packages/js/api/bigScreenApi'
export default {
  name: 'ComponentDialog',
  mixins: [pageMixins],
  props: {},
  data () {
    return {
      dialogVisible: false,
      loading: false,
      options: [], // 分组列表
      code: '',
      focus: -1,
      list: [],
      searchKey: '',
      name: '', // 业务组件搜索关键字
      activeName: 'combination',
      remoteComponentlist: [],
      // 业务组件列表
      bizComponentList: []
    }
  },
  computed: {
    gridComputed () {
      return this.list.length > 3
    },
    remoteComponentsGridComputed () {
      return this.remoteComponentlist.length > 3
    },
    bizFridComputed () {
      return this.bizComponentList.length > 3
    }
  },
  watch: {
    activeName () {
      this.getCatalogList()
    }
  },
  mounted () {
    this.remoteComponentlist = [...innerRemoteComponents, ...getRemoteComponents()]
  },
  methods: {
    chooseComponent (component) {
      this.focus = _.cloneDeep(component)
    },
    close () {},
    init () {
      this.dialogVisible = true
      this.current = 1
      this.searchKey = ''
      this.code = ''
      this.focus = -1
      this.getDataList()
      this.getCatalogList()
    },
    // 点击确定
    confirm () {
      this.dialogVisible = false
      if (this.activeName === 'combination') {
        if (Object.keys(this.focus).length) {
          this.$emit('setComponent', this.focus)
        }
      } else if (['remote'].includes(this.activeName)) {
        if (_.isEmpty(this.focus)) {
          return
        }
        this.$emit('setRemoteComponent', this.focus)
      } if (['bizComponent'].includes(this.activeName)) {
        let config = {}
        if (_.isEmpty(this.focus)) {
          return
        }
        config.code = this.focus.code
        config.name = this.focus.name
        config = getRemoteComponentConfig(this.focus.code, this.focus.name)
        this.$emit('setRemoteComponent', config)
      }
    },
    getDataList () {
      this.loading = true
      get('/dashboard/design/page', {
        parentCode: this.code || null,
        current: this.current,
        size: this.size,
        searchKey: this.searchKey,
        type: 'component'
      })
        .then((data) => {
          this.list = data.list
          this.totalCount = data.totalCount
        })
        .finally(() => {
          this.loading = false
        })

      getBizComponentPage({
        parentCode: this.code || null,
        current: this.current,
        size: this.size,
        searchKey: this.searchKey,
        name: this.name
      }).then((data) => {
        this.bizComponentList = data.list
        this.totalCount = data.totalCount
        this.loading = false
      })
    },
    // 获取目录的列表
    getCatalogList () {
      const url = this.activeName === 'combination' ? '/dashboard/type/list/componentCatalog' : '/dashboard/type/list/bizComponentCatalog'
      get(url)
        .then((data) => {
          this.options = data
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~packages/assets/style/bsTheme.scss';
  .dashboard-list-wrap {
    position: relative;
    height: 100%;
    padding: 16px;
    color: #9ea9b2;
    border: 1px solid #e8e8e8;
    background-color: var(--db-background-1) !important;

    .top-search-wrap {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-bottom: 12px;

      .el-input {
        width: 200px;
        margin-right: 20px;
        /deep/.el-input__inner {
          // background-color: #232832 !important;
        }
      }

      .el-select {
        margin-right: 20px;
        /deep/.el-input__inner {
          // background-color: #232832 !important;
        }
      }
    }

    .list-wrap {
      /* display: grid; */
      overflow: auto;
      // 间隙自适应
      justify-content: space-around;
      // max-height: calc(100vh - 270px);
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      grid-gap: 15px;

      /deep/ .el-loading-mask {
        display: flex;
        align-items: center;
        justify-content: center;
        height: calc(100vh - 260px) !important;
        z-index: 999;
        top: 50px;
      }
      .dashboard-card-wrap {
        position: relative;
        height: 230px;
        cursor: pointer;

        &:hover {
          .screen-card__hover {
            height: 180px;
          }
        }

        .screen-card__hover {
          position: absolute;
          z-index: 999;
          top: 0;
          right: 0;
          left: 0;
          display: flex;
          overflow: hidden;
          align-items: center;
          justify-content: center;
          height: 0;
          transition: height 0.4s;
          background: #00000099;
        }

        .focus {
          color: var(--db-el-text) !important;
          border: 1px solid var(--db-el-color-primary) !important;
        }

        .dashboard-card-inner {
          overflow: hidden;
          width: 100%;
          height: 100%;
          cursor: pointer;
          background-color: var(--db-background-2);
          box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
          color: var(--db-el-title);
          border: 1px solid var(--db-background-2);
          &:hover {
            color: var(--db-el-text);
            border: 1px solid var(--db-el-color-primary);
          }

          .add-dashboard-card-text {
            font-size: 24px;
          }

          .dashboard-card-img {
            width: 100%;
            height: 180px;

            img {
              width: 100%;
              height: 100%;

              object-fit: cover;
            }

            /deep/.image-slot {
              height: 100%;
              background-color: var(--db-background-2);
              display: flex;
              align-items: center;
              justify-content: center;
            }
            /deep/.el-image__error {
              // background-color: #1d1d1d;
            }
          }

          .dashboard-bottom {
            display: flex;
            align-items: center;
            flex-direction: row;
            justify-content: space-between;
            box-sizing: border-box;
            width: 100%;
            /*height: 26px;*/
            padding: 0 10px;
            height: calc(100% - 180px);
            color: var(--db-el-title);
            background-color: var(--db-background-2);

            .left-bigscreen-title {
              font-size: 14px;
              overflow: hidden;
              width: 120px;
              white-space: nowrap;
              text-overflow: ellipsis;
            }

            .right-bigscreen-time-title {
              font-size: 14px;
              overflow: hidden;
              width: 140px;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }

          .dashboard-card-text {
            font-size: 14px;
            padding: 10px;
            text-align: center;
            color: #333;
          }
        }

        .dashboard-card-inner-add {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }

    .el-loading-parent--relative {
      position: unset !important;
    }

    .footer-pagination-wrap {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      width: 100%;
      margin-top: 20px;
      padding: 0 20px;
    }
  }
  // .db-pagination {
  //   ::v-deep .el-input__inner {
  //     width: 110px !important;
  //     border: none;
  //     background: var(--db-el-background-2);
  //   }
  // }
  .empty {
    width: 100%;
    height: 70%;
    min-height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  /deep/ .el-tabs__item {
    color: var(--db-el-text);
  }
  .error-img-text{
    overflow:hidden;
    padding:0 10px;
    white-space: nowrap;
    text-overflow: ellipsis;
    -o-text-overflow:ellipsis;
  }
</style>
