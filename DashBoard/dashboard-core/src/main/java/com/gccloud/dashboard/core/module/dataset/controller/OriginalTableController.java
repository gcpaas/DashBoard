package com.gccloud.dashboard.core.module.dataset.controller;

import com.gccloud.dashboard.core.module.dataset.dto.OriginalTableDto;
import com.gccloud.dashboard.core.module.dataset.entity.OriginalTable;
import com.gccloud.dashboard.core.module.dataset.service.OriginalTableService;
import com.gccloud.dashboard.core.vo.R;
import com.gccloud.dashboard.core.controller.SuperController;
import com.gccloud.dashboard.core.permission.Permission;
import com.gccloud.dashboard.core.permission.DashboardPermission;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;


/**
 * @author pan.shun
 * @since 2021/9/7 15:05
 */
@Api(tags = "原始表")
@RestController
@RequestMapping("/dashboard/original")
public class OriginalTableController extends SuperController {
    @Resource
    private OriginalTableService originalTableService;

    @DashboardPermission(permissions = {Permission.DataSet.EDIT})
    @ApiOperation("原始表新增或修改")
    @PostMapping("/addOrUpdate")
    public void addOrUpdate(@RequestBody OriginalTable originalTable) {
        originalTableService.addOrUpdate(originalTable);
    }

    @DashboardPermission(permissions = {Permission.DataSet.VIEW})
    @ApiOperation("获取原始表详情")
    @GetMapping("/getOriginalTableDetailsById/{id}")
    public R<OriginalTable> getOriginalTableDetails(@PathVariable String id) {
        return R.success(originalTableService.getOriginalTableDetails(id));
    }

    @DashboardPermission(permissions = {Permission.DataSet.VIEW})
    @ApiOperation("查询原始表详情")
    @PostMapping("/getOriginalTableDetail")
    public R<Map<String, Object>> getOriginalTableDetail(@RequestBody OriginalTableDto originalTableDto) {
        return R.success(originalTableService.getOriginalTableDetail(originalTableDto));
    }

    @DashboardPermission(permissions = {Permission.DataSet.VIEW})
    @ApiOperation("查询原始表字段(仅查询全部字段)")
    @PostMapping("/getOriginalTableFieldInfo")
    public R<List<Map<String, Object>>> getOriginalTableField(@RequestBody OriginalTable originalTable) {
        return R.success(originalTableService.getOriginalTableFieldInfo(originalTable));
    }

}
