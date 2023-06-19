package com.gccloud.dashboard.core.module.dataset.controller;

import com.gccloud.dashboard.core.module.dataset.entity.CategoryTree;
import com.gccloud.dashboard.core.module.dataset.service.CategoryTreeService;
import com.gccloud.dashboard.core.vo.R;
import com.gccloud.dashboard.core.controller.SuperController;
import com.gccloud.dashboard.core.permission.Permission;
import com.gccloud.dashboard.core.permission.DashboardPermission;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;


/**
 * @author pan.shun
 * @since 2021/9/7 11:05
 */
@DashboardPermission(permissions = {Permission.DataSet.CATEGORY})
@Api(tags = "种类树")
@RestController
@RequestMapping("/dashboard/category")
public class CategoryTreeController extends SuperController {

    @Resource
    private CategoryTreeService categoryTreeService;

    @ApiOperation("依据类型查询对应的种类树")
    @GetMapping("/queryTreeList")
    public R<List<CategoryTree>> queryTreeList(String tableName, String moduleCode, Integer ifFilter) {
        return R.success(categoryTreeService.queryCategoryTree(tableName, moduleCode, ifFilter));
    }

    @ApiOperation("种类树新增或修改")
    @PostMapping("/addOrUpdateTree")
    public void addOrUpdateTree(@RequestBody CategoryTree categoryTree) {
        categoryTreeService.addOrUpdateTree(categoryTree);
    }

    @ApiOperation("根据ID删除种类树")
    @GetMapping("/remove/{id}")
    public void removeNode(@PathVariable String id) {
        categoryTreeService.removeNodeById(id);
    }


}
