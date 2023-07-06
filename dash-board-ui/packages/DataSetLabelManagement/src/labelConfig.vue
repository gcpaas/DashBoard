<template>
  <el-dialog
    :append-to-body="true"
    :before-close="handleClose"
    :visible.sync="dialogFormVisible"
    title="选择标签"
    width="1000px"
  >
    <div v-loading="labelCheckLoading">
      <el-form :inline="true" class="filter-container">
        <el-form-item label="标签名称">
          <el-input v-model="searchForm.labelName" clearable placeholder="请输入标签名称"/>
        </el-form-item>

        <el-form-item label="标签类型">
          <el-select v-model="searchForm.labelType" clearable filterable placeholder="请选择标签类型"
                     @change="handleLabelType">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item,K) in labelTypeList" :key="K" :label="item"
                       :value="item"/>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="getDataList">查询</el-button>
        </el-form-item>
      </el-form>

      <el-checkbox-group v-model="labelList" style="padding-bottom: 10px">
        <el-row :gutter="2">
          <el-col v-for="item in tableData" :key="item.id" :span="4" style="padding-top: 10px">
            <el-tooltip
              v-if="item.labelDesc || getByteLength(item.labelName) > 18"
              effect="light"
              placement="top-start"
            >
              <div slot="content">
                <div v-if="getByteLength(item.labelName) > 18">名称: {{ item.labelName }}</div>
                <div v-if="item.labelDesc">描述: {{ item.labelDesc }}</div>
              </div>
              <el-checkbox :label="getByteLength(item.labelName) > 18 ? ellipsis(item.labelName, 18) : item.labelName"
                           :value="item.id" @change="checkBoxChange">
              </el-checkbox>
            </el-tooltip>
            <el-checkbox v-else :label="item.labelName" :value="item.id" @change="checkBoxChange">
            </el-checkbox>
          </el-col>
        </el-row>

      </el-checkbox-group>


      <div class="page-container">
        <el-pagination
          :current-page="current"
          :page-size="sizeLabel"
          :page-sizes="[20, 40, 60, 80]"
          :total="totalCount"
          background
          layout="total, prev, pager, next,sizes,jumper"
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
        >
        </el-pagination>
      </div>

      <div align="center">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="commitLabel">确定</el-button>
      </div>
    </div>
    <!--标签详情-->
    <!--<label-config-details v-if="addOrUpdateDetailVisible" ref="LabelConfigDetails"></label-config-details>-->
  </el-dialog>
</template>

<script>
import {pageMixins} from 'dashPackages/js/mixins/page'

import {getLabelList, getLabelType, labelList} from 'dashPackages/js/utils/LabelConfigService'

export default {
  components: {},
  name: "labelConfig",
  mixins: [pageMixins],
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      searchForm: {
        labelName: '',
        labelType: ''
      },
      multipleSelection: [],
      multipleSelection2: [],
      labelList: [],
      sizeLabel: 20,
      labelTypeList: [],
      labelListAll: [],
      labelCheckLoading: false
    }
  },
  methods: {
    getByteLength(str) {
      return unescape(encodeURIComponent(str)).length
    },
    ellipsis(str, len) {
      if ((!str && typeof (str) != 'undefined')) {
        return ''
      }
      var num = 0
      var str1 = str
      var str = ''
      for (var i = 0, lens = str1.length; i < lens; i++) {
        num += ((str1.charCodeAt(i) > 255) ? 2 : 1)
        if (num > len - 3) {
          break
        } else {
          str = str1.substring(0, i + 1)
        }
      }
      return str + '...'
    },
    init() {
      this.dialogFormVisible = true
      this.getDataList()
      this.getLabelType()
      this.dataBackClick()
    },
    dataBackClick() {
      // this.$nextTick(() => {
      //   this.multipleSelection2.forEach(row => {
      //     this.tableData.forEach(t=>{
      //       if(row.id == t.id){
      //         this.$refs.multipleTable.toggleRowSelection(t);
      //       }
      //     })
      //   });
      // })
      this.labelList = []
      this.multipleSelection2.forEach(m => {
        //防止标签过长 无法选中添加
        if (this.getByteLength(m.labelName) > 18) {
          let newLabelName = this.ellipsis(m.labelName, 18)
          this.labelList.push(newLabelName)
        } else {
          this.labelList.push(m.labelName)
        }
      })

    },
    getDataList() {
      this.labelCheckLoading = true
      let params = {
        current: this.current,
        size: this.sizeLabel,
        labelName: this.searchForm.labelName,
        labelType: this.searchForm.labelType
      };
      labelList(params).then((data) => {
        this.totalCount = data.totalCount;
        this.tableData = data.list
        this.labelCheckLoading = false
      }).catch(() => {
        this.labelCheckLoading = false
      })
    },
    addOrUpdateLabel(row) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs['LabelConfigAddOrUpdate'].init(row);
      })
    },
    handleClose() {
      this.dialogFormVisible = false
    },
    checkBoxChange() {
      // this.multipleSelection =[]
      // console.log(this.labelList)
      // this.labelList.forEach(l=>{
      //   this.tableData.forEach(t=>{
      //     if(l == t.labelName){
      //       this.multipleSelection.push(t)
      //     }
      //   })
      // })
    },
    getLabelType() {
      getLabelType().then((data) => {
        this.labelTypeList = data
      })
    },
    handleLabelType() {
      this.getDataList()
    },
    commitLabel() {
      this.multipleSelection = []
      this.labelCheckLoading = true
      getLabelList().then((data) => {
        this.labelListAll = data;
        if (this.labelList.length === 0) {
          this.labelCheckLoading = false
          this.$emit('func', this.multipleSelection)
          this.dialogFormVisible = false
        }
        this.labelList.forEach(l => {
            this.labelListAll.forEach(t => {
              //防止标签过长 无法选中添加
              if (this.getByteLength(t.labelName) > 18) {
                let newLabelName = this.ellipsis(t.labelName, 18)
                if (l == newLabelName) {
                  this.multipleSelection.push(t)
                }
              } else {
                if (l == t.labelName) {
                  this.multipleSelection.push(t)
                }
              }

            })
            this.labelCheckLoading = false
            this.$emit('func', this.multipleSelection)
            this.dialogFormVisible = false
          }
        )
      });
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
