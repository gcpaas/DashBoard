package com.gccloud.dashboard.core.module.manage.controller;

import com.gccloud.common.exception.GlobalException;
import com.gccloud.common.utils.BeanConvertUtils;
import com.gccloud.common.validator.ValidatorUtils;
import com.gccloud.common.validator.group.Insert;
import com.gccloud.common.validator.group.Update;
import com.gccloud.common.vo.MixinsResp;
import com.gccloud.common.vo.PageVO;
import com.gccloud.common.vo.R;
import com.gccloud.dashboard.core.config.DashboardConfig;
import com.gccloud.dashboard.core.constant.DashboardConst;
import com.gccloud.dashboard.core.module.basic.entity.PageEntity;
import com.gccloud.dashboard.core.module.manage.dto.DashboardPageDTO;
import com.gccloud.dashboard.core.module.manage.dto.DashboardSearchDTO;
import com.gccloud.dashboard.core.module.manage.service.IDashboardPageService;
import com.gccloud.dashboard.core.module.manage.vo.StaticFileVO;
import com.gccloud.common.permission.ApiPermission;
import com.gccloud.dashboard.core.permission.Permission;
import com.gccloud.dashboard.core.utils.Webjars;
import com.google.common.collect.Lists;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

/**
 * @author hongyang
 * @version 1.0
 * @date 2023/3/13 10:55
 */
@Slf4j
@RestController
@RequestMapping("/dashboard/design")
@Api(tags = "仪表盘页以及仪表盘组件设计")
public class DashboardPageController {

    @Resource
    private IDashboardPageService dashboardPageService;
    @Resource
    private DashboardConfig dashboardConfig;

    @ApiPermission(permissions = {Permission.Dashboard.VIEW})
    @GetMapping("/info/code/{code}")
    @ApiOperation(value = "仪表盘页/组件详情", position = 10, produces = MediaType.APPLICATION_JSON_VALUE)
    public MixinsResp<DashboardPageDTO> info(@PathVariable("code") String code) {
        PageEntity dashboard = dashboardPageService.getByCode(code);
        DashboardPageDTO dashboardConfig = (DashboardPageDTO) dashboard.getConfig();
        BeanConvertUtils.convert(dashboard, dashboardConfig);
        MixinsResp<DashboardPageDTO> resp = new MixinsResp<DashboardPageDTO>().setData(dashboardConfig);
        resp.setCode(DashboardConst.Response.Code.SUCCESS);
        return resp;
    }

    @ApiPermission(permissions = {Permission.Dashboard.VIEW})
    @GetMapping("/page")
    @ApiOperation(value = "仪表盘/组件分页列表", position = 10, produces = MediaType.APPLICATION_JSON_VALUE)
    public MixinsResp<PageVO<PageEntity>> page(DashboardSearchDTO searchDTO) {
        PageVO<PageEntity> page = dashboardPageService.getByCategory(searchDTO);
        MixinsResp<PageVO<PageEntity>> resp = new MixinsResp<PageVO<PageEntity>>().setData(page);
        resp.setCode(DashboardConst.Response.Code.SUCCESS);
        return resp;
    }


    @ApiPermission(permissions = {Permission.Dashboard.ADD})
    @PostMapping("/add")
    @ApiOperation(value = "从空白新增仪表盘/组件", position = 20, produces = MediaType.APPLICATION_JSON_VALUE)
    public R<String> add(@RequestBody DashboardPageDTO dashboardPageDTO) {
        ValidatorUtils.validateEntity(dashboardPageDTO, Insert.class);
        dashboardPageService.add(dashboardPageDTO);
        if (StringUtils.isBlank(dashboardPageDTO.getParentCode())) {
            dashboardPageDTO.setParentCode("0");
        }
        return R.success(dashboardPageDTO.getCode());
    }

    @ApiPermission(permissions = {Permission.Dashboard.UPDATE})
    @PostMapping("/update")
    @ApiOperation(value = "修改仪表盘/组件", position = 30, produces = MediaType.APPLICATION_JSON_VALUE)
    public R<String> update(@RequestBody DashboardPageDTO dashboardPageDTO) {
        ValidatorUtils.validateEntity(dashboardPageDTO, Update.class);
        if (StringUtils.isBlank(dashboardPageDTO.getParentCode())) {
            dashboardPageDTO.setParentCode("0");
        }
        dashboardPageService.update(dashboardPageDTO);
        return R.success(dashboardPageDTO.getCode());
    }

    @ApiPermission(permissions = {Permission.Dashboard.DELETE})
    @PostMapping("/delete/{code}")
    @ApiOperation(value = "删除仪表盘/组件", position = 40, produces = MediaType.APPLICATION_JSON_VALUE)
    public R<Void> delete(@PathVariable String code) {
        PageEntity dashboardEntity = dashboardPageService.getByCode(code);
        if (dashboardEntity == null) {
            return R.success();
        }
        dashboardPageService.deleteByCode(code);
        return R.success();
    }

    @ApiPermission(permissions = {Permission.Dashboard.ADD})
    @PostMapping("/copy/{code}")
    @ApiOperation(value = "复制仪表盘/组件", position = 50, produces = MediaType.APPLICATION_JSON_VALUE)
    public R<String> copy(@PathVariable String code) {
        PageEntity dashboardPage = dashboardPageService.getByCode(code);
        if (dashboardPage == null) {
            throw new GlobalException("仪表盘页不存在");
        }
        String newCode = dashboardPageService.copy(dashboardPage);
        return R.success(newCode);
    }

    @ApiPermission(permissions = {Permission.Dashboard.ADD})
    @PostMapping("/add/template")
    @ApiOperation(value = "从模板新增仪表盘页", position = 20, produces = MediaType.APPLICATION_JSON_VALUE)
    public R<String> addByTemplate(@RequestBody DashboardPageDTO dashboardPageDTO) {
        String code = dashboardPageService.addByTemplate(dashboardPageDTO);
        if (StringUtils.isBlank(dashboardPageDTO.getParentCode())) {
            dashboardPageDTO.setParentCode("0");
        }
        return R.success(code);
    }


    @PostMapping("/get/template")
    @ApiOperation(value = "根据模板获取配置", position = 20, produces = MediaType.APPLICATION_JSON_VALUE)
    public MixinsResp<DashboardPageDTO> getByTemplate(@RequestBody DashboardPageDTO dashboardPageDTO) {
        DashboardPageDTO config = dashboardPageService.getConfigByTemplate(dashboardPageDTO);
        MixinsResp<DashboardPageDTO> resp = new MixinsResp<DashboardPageDTO>().setData(config);
        resp.setCode(DashboardConst.Response.Code.SUCCESS);
        return resp;
    }


    @ApiPermission
    @GetMapping("/bg/list")
    @ApiOperation(value = "背景图片列表", position = 60, produces = MediaType.APPLICATION_JSON_VALUE)
    public R<List<StaticFileVO>> getBgList() {
        List<String> staticFileList = Webjars.DASHBOARD_BG;
        List<StaticFileVO> bgList = Lists.newArrayList();
        String urlPrefix = dashboardConfig.getFile().getUrlPrefix() + "dashboardBg/";
        for (String fileName : staticFileList) {
            StaticFileVO fileVO = new StaticFileVO();
            fileVO.setUrl(urlPrefix + fileName);
            fileVO.setName(fileName);
            bgList.add(fileVO);
        }
        return R.success(bgList);
    }

    @ApiPermission
    @GetMapping("/map/list/{level}")
    @ApiOperation(value = "地图数据列表", position = 60, produces = MediaType.APPLICATION_JSON_VALUE)
    public R<List<StaticFileVO>> getMapJsonList(@PathVariable("level") String level) {
        List<String> staticFileList = Lists.newArrayList();
        if ("country".equals(level)) {
            staticFileList = Webjars.COUNTRY_MAP_DATA;
        }
        if ("province".equals(level)) {
            staticFileList = Webjars.PROVINCE_MAP_DATA;
        }
        List<StaticFileVO> bgList = Lists.newArrayList();
        String urlPrefix = "static/chinaMap/" + level + "/";
        for (String fileName : staticFileList) {
            StaticFileVO fileVO = new StaticFileVO();
            fileVO.setUrl(fileName);
            fileVO.setName(fileName.replace(".json", ""));
            bgList.add(fileVO);
        }
        return R.success(bgList);
    }
}
