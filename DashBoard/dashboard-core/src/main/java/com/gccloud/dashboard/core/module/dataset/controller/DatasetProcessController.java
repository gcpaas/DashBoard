package com.gccloud.dashboard.core.module.dataset.controller;

import com.gccloud.dashboard.core.module.dataset.dto.DatasetProcessTestSearchDto;
import com.gccloud.dashboard.core.module.dataset.entity.DatasetProcessEntity;
import com.gccloud.dashboard.core.module.dataset.service.DatasetProcessService;
import com.gccloud.dashboard.core.module.dataset.vo.DatasetProcessTestVo;
import com.gccloud.dashboard.core.vo.R;
import com.gccloud.dashboard.core.permission.Permission;
import com.gccloud.dashboard.core.permission.DashboardPermission;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;


/**
 * @Description:
 * @Author yang.hw
 * @Date 2021/9/8 15:12
 */
@Api(tags = "自助数据集")
@RestController
@RequestMapping("/dashboard/datasetProcess")
public class DatasetProcessController {

    @Resource
    private DatasetProcessService datasetProcessService;

    @DashboardPermission(permissions = {Permission.DataSet.EDIT})
    @ApiOperation("新增自助数据集")
    @PostMapping("/add")
    public R<String> add(@RequestBody DatasetProcessEntity processEntity) {
        return R.success(datasetProcessService.addDatasetProcess(processEntity));
    }

    @DashboardPermission(permissions = {Permission.DataSet.EDIT})
    @ApiOperation("修改自助数据集")
    @PostMapping("/update")
    public void update(@RequestBody DatasetProcessEntity processEntity) {
        datasetProcessService.updateDatasetProcess(processEntity);
    }

    @DashboardPermission(permissions = {Permission.DataSet.VIEW})
    @ApiOperation("获取自助数据集详情")
    @GetMapping("/getDatasetInfo/{id}")
    public R<DatasetProcessEntity> getDatasetInfo(@PathVariable String id) {
        return R.success(datasetProcessService.getDatasetProcessInfo(id));
    }

    @DashboardPermission(permissions = {Permission.DataSet.EXECUTE})
    @ApiOperation("sql脚本测试")
    @PostMapping("/sqlTest")
    public R<DatasetProcessTestVo> sqlTest(@RequestBody DatasetProcessTestSearchDto searchDto) {
        return R.success(datasetProcessService.getDatasetSqlTest(searchDto));
    }
}
