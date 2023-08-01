package com.gccloud.dashboard.core.module.manage.extend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * @author hongyang
 * @version 1.0
 * @date 2023/8/1 15:00
 */
@Component
public class DashboardExtendClient {

    @Autowired(required = false)
    private IDashboardExtendService extendService;


    /**
     * 删除仪表盘后的扩展方法
     * @param code
     */
    public void deleteByCode(String code) {
        if (extendService != null) {
            extendService.deleteByCode(code);
        }
    }

}
