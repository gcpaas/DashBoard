<template>
  <el-dialog
    :append-to-body="true"
    :before-close="handleClose"
    :title="dataForm.id!==''?'编辑标签':'新增标签'"
    :visible.sync="dialogFormVisible"
    :width="relVisible?'1100px':'450px'"
  >
    <el-row>

      <el-col :span="relVisible?8:24">
        <el-divider content-position="left">属性信息</el-divider>

        <el-form ref="ruleForm" :model="dataForm" :rules="rules" label-position="right" label-width="90px">

          <el-form-item label="标签名称" prop="labelName">
            <el-input v-model="dataForm.labelName" clearable maxlength="200"/>
          </el-form-item>

          <el-form-item label="标签类型" prop="labelType">
            <el-select ref="searchSelect"
                       v-model="dataForm.labelType"
                       allow-create
                       clearable
                       filterable
                       placeholder="请选择或输入标签类型"
                       @blur="selectBlur"
                       @input.native="filterData">
              <el-option v-for="(item,K) in labelTypeList" :key="K" :label="item"
                         :value="item"/>
            </el-select>
          </el-form-item>

          <el-form-item label="标签说明" prop="labelDesc">
            <el-input v-model="dataForm.labelDesc" clearable type="text"/>
          </el-form-item>

        </el-form>

        <el-divider content-position="left">关联数据集信息</el-divider>
        <el-form>
          <el-form-item align="center">
            <el-tag effect="plain">标签</el-tag>
            <span>—————</span>
            <el-button round size="mini" type="primary" @click="buildRel">添加关联</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <el-col v-if="relVisible" :span="8">
        <div>
          <el-divider content-position="left">添加关联</el-divider>
          <div class="tree-box full-box--position" style="padding: 0 8px 24px 0">
            <Tree
              ref="tree"
              :treeData="categoryData"
              style="height: 300px;overflow: auto"
              @handleNodeClick="handleNodeClick"
            >
            </Tree>
          </div>
        </div>
      </el-col>

      <el-col v-if="relVisible" :span="8">
        <el-divider content-position="left">数据集列表:</el-divider>
        <div>
          <el-table
            ref="mytable"
            v-loading="loading"
            :data="datasetProcessData"
            height="300"
            @select="curSelect"
            @selection-change="handleSelectionChange"
            @select-all="handleSelectionAll"
          >
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>

            <el-table-column
              label="数据集名称"
              prop="name"
              show-overflow-tooltip
            ></el-table-column>
          </el-table>
        </div>
      </el-col>

    </el-row>

    <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
      </span>
  </el-dialog>
</template>

<script>
import {pageMixins} from 'dashPackages/js/mixins/page'
import Tree from './Tree'
import {addOrUpdateLabel, checkRepeatLabel} from 'dashPackages/js/utils/LabelConfigService'
import {datasetList, getCategoryTree} from 'dashPackages/js/utils/datasetConfigService'

export default {
  name: "labelConfigAddOrUpdate",
  mixins: [pageMixins],
  data() {
    return {
      loading: false,
      datasetProcessData: [],
      typeId: '',
      dataForm: {
        id: '',
        labelName: '',
        labelType: '',
        labelDesc: '',
        relList: []
      },
      dialogFormVisible: false,
      rules: {
        labelName: [
          {required: true, message: '标签名称不能为空', trigger: 'blur'},
          {validator: this.validateLabelName, trigger: 'blur'}
        ],
        labelType: [
          {required: true, message: '标签类型不能为空', trigger: 'change'},
        ],
      },
      categoryData: [],
      relVisible: false,
      multipleSelection: [],
      labelTypeList: [],
      flag: true,
      idstr: '',
      idsArr: [],
    }
  },
  components: {
    Tree
  },
  watch: {
    "dataForm.labelType": function (val) {
      if (val.length > 20) {
        this.dataForm.labelType = val.substring(0, 20);
      }
    }
  },
  methods: {
    getDataList() {
      this.loading = true;
      this.multipleSelection = [];
      let params = {
        current: this.current,
        size: 1000,
        typeId: this.typeId,
        labelIdRel: this.dataForm.id
      };
      datasetList(params).then((data) => {
        this.totalCount = data.totalCount;
        this.datasetProcessData = data.list;

        if (this.relVisible) {
          this.$nextTick(() => {
            if (this.dataForm.id) {
              for (let i = 0; i < this.datasetProcessData.length; i++) {
                if (this.datasetProcessData[i].dataSetStatus === 1) {
                  this.$refs.mytable.toggleRowSelection(this.datasetProcessData[i]);
                }
              }
            } else {
              this.datasetProcessData.filter(ds => this.idstr.split(',').includes(ds.id)).forEach(r => {
                this.$refs.mytable.toggleRowSelection(r);
              })
            }
          })
        }
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      })
    },
    validateLabelName(rule, value, callback) {
      checkRepeatLabel({'id': this.dataForm.id, 'labelName': this.dataForm.labelName}).then(repeat => {
        if (repeat) {
          callback(new Error('标签名称已存在'))
        } else {
          callback();
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getTreeList() {
      getCategoryTree({type: 'dataset'}).then((categoryTree) => {
        this.categoryData = categoryTree;
      })
    },
    //节点点击
    handleNodeClick(row, value) {
      if (this.dataForm.id) {
        this.saveForm(false);
      }
      this.$nextTick(() => {
        this.typeId = row.id;
        this.getDataList();
      })
    },
    curSelect(selection, row) {
      if (this.idsArr.length > 0) {
        // 判断是否存在 若存在，删除  若未存在，则添加
        const flag = this.idsArr.some((it) => row.id === it)
        if (flag) { // 存在，再次点击则是取消选中
          this.idsArr.map((it, index) => {
            if (row.id === it) {
              this.idsArr.splice(index, 1)
            }
          })
        } else { // 不存在，添加至选中数组
          this.idsArr.push(row.id)
        }
      } else { // 当选中数组为空时，直接添加
        this.idsArr.push(row.id)
      }
      this.idstr = this.idsArr.join(",")
      // this.$parent.idstr = this.idstr
    },
    handleSelectionAll(selection) {
      let idsArrParent = this.idstr ? this.idstr.split(',') : []; // 已选择过的数组
      // idsArrParent = this.$parent.idstr.split(',')
      if (selection.length === 0) {
        // 若是全不选
        this.datasetProcessData.forEach((item, index) => {
          let i = idsArrParent.indexOf(item.id);
          if (i > -1) {
            idsArrParent.splice(i, 1)
          }
        });
        this.idsArr = idsArrParent
        this.idstr = idsArrParent.join(',')
      } else {
        // 全选，将本次全选的数组与已选择过的数组合并去重
        let selectedIdsArr = [] // 全选的数组
        this.datasetProcessData.forEach(ds => {
          selectedIdsArr.push(ds.id)
        });
        let idsArrCombined = [...new Set(selectedIdsArr.concat(idsArrParent))];
        this.idsArr = idsArrCombined.filter(id => id);
        this.idstr = this.idsArr.join(',')
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1
    },
    ellipsis(value, len) {
      if (!value) return '';
      if (value.length > len) {
        return value.slice(0, len) + '...'
      }
      return value
    },
    init(row) {
      this.dataForm.id = row ? row.id : '';
      this.dialogFormVisible = true;
      if (row) {
        this.dataForm.id = row.id;
        this.dataForm.labelName = row.labelName;
        this.dataForm.labelType = row.labelType;
        this.dataForm.labelDesc = row.labelDesc;
        this.buildRel();
      }
      this.$nextTick(() => {
        this.getDataList();
      })
    },
    handleClose() {
      this.$parent.addOrUpdateVisible = false
    },
    cancel() {
      this.dialogFormVisible = false;
      this.$nextTick(() => {
        this.handleClose();
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveForm(true);
        } else {
          return false;
        }
      });
    },
    saveForm(flag) {
      this.dataForm.relList = [];

      if (this.dataForm.id) {
        this.multipleSelection.forEach(dataset => {
          let datasetLabelRel = {
            'datasetId': dataset.id,
            'labelId': this.dataForm.id
          }
          this.dataForm.relList.push(datasetLabelRel);
        })
      } else {
        this.idsArr.forEach(id => {
          let param = {
            'datasetId': id,
            'labelId': this.dataForm.id
          };
          this.dataForm.relList.push(param);
        });
      }
      addOrUpdateLabel(this.dataForm).then((r) => {
        if (flag) {
          this.$message.success('保存成功');
          this.cancel();
          this.$parent.getDataList();
          //更新一下类型
          this.$parent.getLabelType();
        }
      })
    },
    //建立关联
    buildRel() {
      this.relVisible = !this.relVisible;
      this.getTreeList();
      this.$nextTick(() => {
        this.getDataList();
      })
    },
    selectBlur(e) {
      this.dataForm.labelType = e.target.value
    },
    // 对输入字符串控制
    filterData() {
      // 此属性得到输入的文字
      var str = this.$refs.searchSelect.$data.selectedLabel;
      // 控制的js
      if (str.length > 20) {
        this.$refs.searchSelect.$data.selectedLabel = str.substr(0, 20)
      }
    }
  }
}
</script>

<style scoped>
.el-col {
  height: 358px;
}

.tree-box {
  overflow-x: auto;
}
</style>
