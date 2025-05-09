package com.gccloud.dashboard.core.permission;

import com.gccloud.common.exception.GlobalException;
import com.gccloud.common.permission.IApiPermissionService;
import com.gccloud.dashboard.core.config.SysUserConfig;
import com.gccloud.dashboard.core.constant.DashboardConst;
import com.gccloud.dashboard.core.module.login.service.ISysLoginService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.HashSet;
import java.util.Set;

/**
 * 接口权限控制
 *
 * @author chen.hu
 * @date 2025/5/6 13:55
 */
@Service
public class PermissionServiceImpl implements IApiPermissionService {
    @Resource
    private ISysLoginService sysLoginService;
    @Override
    public boolean verifyApiPermission(HttpServletRequest httpServletRequest, String... permission) {
        Set<String> userPermissions = getUserPermissions(httpServletRequest);
        if (permission.length == 0) {
            return true;
        }
        if (userPermissions.isEmpty()) {
            throw new GlobalException("无接口访问权限");
        }
        for (String p : permission) {
            if (!userPermissions.contains(p)) {
                return false;
            }
        }
        return true;
    }

    private Set<String> getUserPermissions(HttpServletRequest httpServletRequest) {
        String token = httpServletRequest.getHeader("token");
        if ("null".equals(token) || StringUtils.isBlank(token)) {
            throw new GlobalException(DashboardConst.Response.Msg.NO_LOGIN, DashboardConst.Response.Code.NO_LOGIN);
        }
        SysUserConfig.User currentUser = sysLoginService.getUserFromToken(token);
        if (currentUser == null) {
            throw new GlobalException("TOKEN无效", DashboardConst.Response.Code.NO_FOUND);
        }
        return new HashSet<>(currentUser.getPermissions());
    }
}
