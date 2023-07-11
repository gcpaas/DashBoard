package com.gccloud.dashboard.core.permission;


import javax.servlet.http.HttpServletRequest;

/**
 * 仪表盘页面访问权限校验，可通过实现该接口自定义仪表盘页面的访问权限控制
 * @author hongyang
 * @version 1.0
 * @date 2023/5/15 10:38
 */
public interface IDashboardPermissionService {

    /**
     * 校验仪表盘页面访问权限
     * @param request 请求
     * @param pageCode 仪表盘页面编码
     * @return true:有权限，false:无权限
     */
    boolean verifyDataPermission(HttpServletRequest request, String pageCode);


}
