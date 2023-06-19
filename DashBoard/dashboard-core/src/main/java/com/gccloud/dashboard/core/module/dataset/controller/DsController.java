package com.gccloud.dashboard.core.module.dataset.controller;

import com.gccloud.dashboard.core.module.dataset.dto.DatasetParamDto;
import com.gccloud.dashboard.core.module.dataset.dto.ExecuteDto;
import com.gccloud.dashboard.core.module.dataset.service.DsService;
import com.gccloud.dashboard.core.module.dataset.vo.DataSetInfoVo;
import com.gccloud.dashboard.core.utils.JSON;
import com.gccloud.dashboard.core.vo.R;
import com.gccloud.dashboard.core.controller.SuperController;
import com.gccloud.dashboard.core.permission.Permission;
import com.gccloud.dashboard.core.permission.DashboardPermission;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.json.JSONArray;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;


/**
 * 数据管理公共API
 *
 * @author pan.shun
 * @since 2022/9/7 09:57
 */
@RestController
@Api(tags = "数据管理公共接口")
@RequestMapping("/dashboard/ds")
public class DsController extends SuperController {

    @Resource
    private DsService dsService;

    @DashboardPermission(permissions = {Permission.DataSet.VIEW})
    @ApiOperation("数据集详情")
    @GetMapping("/getDataSetDetails")
    public R<DataSetInfoVo> getDataSetDetails(String id) {
        DataSetInfoVo dataSetDetails = dsService.getDataSetDetails(id);
        return R.success(dataSetDetails);
    }

    @DashboardPermission(permissions = {Permission.DataSet.EXECUTE})
    @ApiOperation("数据集执行")
    @PostMapping("/getDataByDataSetId")
    public R<Object> getDataByDataSetId(@RequestBody ExecuteDto executeDto) {
        if (executeDto.getParams() == null || executeDto.getParams().size() == 0) {
            // 当未传入参数时，从数据集中获取默认参数配置
            DataSetInfoVo dataSetDetails = dsService.getDataSetDetails(executeDto.getDataSetId());
            JSONArray params = dataSetDetails.getParams();
            if (params != null && params.length() > 0) {
                List<DatasetParamDto> datasetParams = JSON.parseArray(JSON.toJSONString(params), DatasetParamDto.class);
                executeDto.setParams(datasetParams);
            }
        }
        return R.success(dsService.getData(executeDto.getDataSetId(), executeDto.getParams()));
    }

}
