package com.gccloud.dashboard.core.module.manage.extend;

/**
 * 仪表盘扩展接口
 * 仪表盘扩展接口，用于扩展仪表盘的功能
 * @author hongyang
 * @version 1.0
 * @date 2023/8/1 15:00
 */
public interface IDashboardExtendService {

    /**
     * 仪表盘删除拓展
     * 会在仪表盘删除后调用
     * @param code
     */
    void deleteByCode(String code);

}
