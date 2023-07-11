package com.gccloud.dashboard.core.permission;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;

/**
 * @author hongyang
 * @version 1.0
 * @date 2023/5/15 10:43
 */
@Component
public class DashboardPermissionClient {

    @Autowired(required = false)
    private IDashboardPermissionService permissionService;


    public boolean verifyDataPermission(HttpServletRequest request, String pageCode) {
        boolean verify = true;
        if (permissionService != null) {
            verify = permissionService.verifyDataPermission(request, pageCode);
        }
        return verify;
    }




}
