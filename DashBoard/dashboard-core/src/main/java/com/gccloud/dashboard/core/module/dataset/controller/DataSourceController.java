package com.gccloud.dashboard.core.module.dataset.controller;

import com.gccloud.dashboard.core.module.dataset.dto.DataSourceDto;
import com.gccloud.dashboard.core.module.dataset.entity.DatasourceConfig;
import com.gccloud.dashboard.core.module.dataset.vo.DatasourceConfigVo;
import com.gccloud.dashboard.core.module.dataset.service.DatasourceConfigService;
import com.gccloud.dashboard.core.vo.PageVO;
import com.gccloud.dashboard.core.vo.R;
import com.gccloud.dashboard.core.controller.SuperController;
import com.gccloud.dashboard.core.permission.Permission;
import com.gccloud.dashboard.core.permission.DashboardPermission;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

/**
 * @author pan.shun
 * @since 2021/9/6 11:10
 */
@RestController
@RequestMapping("/dashboard/datasource")
@Api(tags = "数据源管理")
public class DataSourceController extends SuperController {

    @Resource
    private DatasourceConfigService datasourceConfigService;

    @DashboardPermission(permissions = {Permission.DataSource.VIEW})
    @ApiOperation("数据源分页查询")
    @GetMapping("/page")
    public R<PageVO<DatasourceConfig>> getPage(@ApiParam(name = "查询", value = "传入查询条件", required = true) DataSourceDto dataSourceDto) {
        return R.success(datasourceConfigService.getPage(dataSourceDto));
    }

    @DashboardPermission(permissions = {Permission.DataSource.VIEW})
    @ApiOperation("数据源列表查询")
    @GetMapping("/list")
    public R<List<DatasourceConfigVo>> getDatasourceConfigList(String moduleCode) {
        return R.success(datasourceConfigService.getDatasourceList(moduleCode));
    }

    @DashboardPermission(permissions = {Permission.DataSource.EDIT})
    @ApiOperation("新增或修改数据源配置")
    @PostMapping("/addOrUpdateDataSource")
    public void addOrUpdateDataSource(@RequestBody DatasourceConfig datasourceConfig) {
        datasourceConfigService.addOrUpdateDataSource(datasourceConfig);
    }

    @DashboardPermission
    @ApiOperation("数据源名称重复判断")
    @PostMapping("/checkRepeat")
    public R<String> checkRepeat(@RequestBody DatasourceConfig datasourceConfig) {
        return R.success(datasourceConfigService.checkRepeat(datasourceConfig));
    }

    @DashboardPermission(permissions = {Permission.DataSource.DELETE})
    @ApiOperation("删除数据源配置")
    @GetMapping("/sourceRemove/{id}")
    public void removeSource(@PathVariable String id) {
        datasourceConfigService.removeSource(id);
    }

    @DashboardPermission(permissions = {Permission.DataSource.TEST})
    @ApiOperation("数据源连接测试")
    @PostMapping("/sourceLinkTest")
    public R<String> sourceLinkTest(@RequestBody DatasourceConfig datasourceConfig) {
        return R.success(datasourceConfigService.sourceLinkTest(datasourceConfig));
    }

    @DashboardPermission(permissions = {Permission.DataSource.VIEW})
    @ApiOperation("查询数据源下的表")
    @GetMapping("/getSourceTable/{sourceId}")
    public R<Object> getSourceTableList(@PathVariable String sourceId) {
        return R.success(datasourceConfigService.getSourceTableList(sourceId));
    }

    @DashboardPermission(permissions = {Permission.DataSource.VIEW})
    @ApiOperation("查询数据源下的视图")
    @GetMapping("/getSourceView/{sourceId}")
    public R<Object> getSourceViewList(@PathVariable String sourceId) {
        return R.success(datasourceConfigService.getSourceViewList(sourceId));
    }


}
