package com.gccloud.dashboard.core.module.manage.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.gccloud.dashboard.core.module.basic.entity.PageEntity;
import com.gccloud.dashboard.core.module.manage.service.IDashboardPageService;
import com.gccloud.dataset.extend.dataset.IDatasetExtendService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

/**
 * @author hongyang
 * @version 1.0
 * @date 2023/7/20 9:54
 */
@Order(100)
@Service("dashboardDatasetExtendService")
public class DatasetExtendServiceImpl implements IDatasetExtendService {

    @Resource
    private IDashboardPageService pageService;

    @Override
    public String deleteCheck(String id) {
        if (StringUtils.isBlank(id)) {
            return null;
        }
        LambdaQueryWrapper<PageEntity> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.select(PageEntity::getId, PageEntity::getName);
        // "businessKey": "id",
        queryWrapper.like(PageEntity::getConfig, "\"businessKey\":\"" + id + "\"");
        List<PageEntity> list = pageService.list(queryWrapper);
        if (list == null || list.isEmpty()) {
            return null;
        }
        String msg = "数据集已被以下仪表盘页面引用，无法删除：";
        for (PageEntity page : list) {
            msg += page.getName() + "、";
        }
        msg = msg.substring(0, msg.length() - 1);
        return msg;
    }

    @Override
    public String getServiceType() {
        return "仪表盘";
    }
}
