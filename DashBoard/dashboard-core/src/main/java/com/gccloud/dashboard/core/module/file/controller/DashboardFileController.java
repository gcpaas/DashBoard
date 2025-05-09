package com.gccloud.dashboard.core.module.file.controller;

import com.gccloud.common.controller.SuperController;
import com.gccloud.common.permission.ApiPermission;
import com.gccloud.common.utils.BeanConvertUtils;
import com.gccloud.common.vo.PageVO;
import com.gccloud.common.vo.R;
import com.gccloud.dashboard.core.module.file.dto.FileSearchDTO;
import com.gccloud.dashboard.core.module.file.entity.DashboardFileEntity;
import com.gccloud.dashboard.core.module.file.service.IDashboardFileService;
import com.gccloud.dashboard.core.module.file.service.IDashboardOssService;
import com.gccloud.dashboard.core.module.file.vo.SysFileVO;
import com.gccloud.dashboard.core.permission.Permission;
import io.swagger.annotations.*;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

/**
 * 文件管理
 */
@Slf4j
@RestController
@RequestMapping("/dashboard/file")
@Api(tags = "文件管理")
@ApiSort(value = 100)
public class DashboardFileController extends SuperController {

    @Resource
    private IDashboardOssService sysOssService;
    @Resource
    private IDashboardFileService fileService;

    @ApiPermission(permissions = {Permission.File.VIEW})
    @GetMapping(value = {"", "/"})
    @ApiOperation(value = "列表", position = 10, notes = "分页查询文件", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
            @ApiImplicitParam(name = "current", value = "页码", paramType = "query", required = true, dataType = "int"),
            @ApiImplicitParam(name = "size", value = "每页条数", paramType = "query", required = true, dataType = "int"),
            @ApiImplicitParam(name = "searchKey", value = "查询条件", paramType = "query", dataType = "string")
    })
    public R<PageVO<SysFileVO>> getPage(@ApiParam(name = "查询", value = "传入查询的业务条件", required = true) FileSearchDTO searchDTO) {
        PageVO<DashboardFileEntity> page = fileService.getPage(searchDTO);
        PageVO<SysFileVO> pageVO = BeanConvertUtils.convertPage(page, SysFileVO.class);
        return R.success(pageVO);
    }
    @ApiPermission(permissions = {Permission.File.UPLOAD})
    @PostMapping("/upload")
    @ApiOperation(value = "上传", notes = "上传", produces = MediaType.APPLICATION_JSON_VALUE)
    public R<DashboardFileEntity> upload(@RequestParam("file") MultipartFile file, @RequestParam(value = "module", required = false) String module, HttpServletResponse response, HttpServletRequest request) {
        DashboardFileEntity entity = new DashboardFileEntity();
        // 不同业务自己控制
        if (StringUtils.isBlank(module)) {
            module = "other";
        }
        entity.setModule(module);
        sysOssService.upload(file, entity, response, request);
        fileService.save(entity);
        return R.success(entity);
    }

    @ApiPermission(permissions = {Permission.File.DOWNLOAD})
    @PostMapping("/download/{id}")
    @ApiOperation(value = "下载", notes = "下载资源", produces = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public void download(@PathVariable("id") String id, HttpServletResponse response, HttpServletRequest request) {
        sysOssService.download(id, response, request);
    }

    @ApiPermission(permissions = {Permission.File.VIEW})
    @GetMapping("/getAllFileSuffix")
    @ApiOperation(value = "获取所有文件后缀名", notes = "获取所有文件后缀名", produces = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public R<List<String>> getAllFileSuffix() {
    	List<String> extensions = fileService.getAllExtension();
        // 移除空后缀
        extensions.remove("");
    	return R.success(extensions);
    }

    @ApiPermission(permissions = {Permission.File.DELETE})
    @PostMapping("/delete/{id}")
    @ApiOperation(value = "删除", notes = "删除", produces = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public R<Boolean> delete(@PathVariable("id") String id) {
        sysOssService.delete(id);
        return R.success(true);
    }
}
