package com.gccloud.dashboard.core.config;

import com.gccloud.dashboard.core.permission.Permission;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;

/**
 * @author chen.hu
 * @date 2025/5/6 16:36
 */
@Slf4j
@Configuration
@ConfigurationProperties(prefix = "gc.starter.dataroom")
@Data
public class SysUserConfig {
    private List<User> users = new ArrayList<>();

    @Data
    public static class User {
        private String userId;
        private String username;
        private String password;
        private List<String> role;
        private List<String> permissions;
    }

    @PostConstruct
    public void init() {
        for (User user : users) {
            user.setPermissions(mapRoleToPermissions(user.getRole()));
        }
    }

    private List<String> mapRoleToPermissions(List<String> roles) {
        List<String> permissions = new ArrayList<>();
        for (String role : roles){
            switch (role) {
                case "dataRoomRead":
                    // 读权限
                    permissions.add(Permission.Dashboard.VIEW);
                    permissions.add(Permission.Component.VIEW);
                    permissions.add(Permission.File.VIEW);
                    permissions.add(Permission.File.DOWNLOAD);
                    permissions.add(Permission.Datasource.VIEW);
                    permissions.add(Permission.Datasource.TEST);
                    permissions.add(Permission.Dataset.VIEW);
                    permissions.add(Permission.Dataset.EXECUTE);
                    permissions.add(Permission.Dataset.CATEGORY_VIEW);
                    permissions.add(Permission.Dataset.LABEL_VIEW);
                    break;
                case "dataRoomWrite":
                    // 写权限
                    permissions.add(Permission.Dashboard.ADD);
                    permissions.add(Permission.Dashboard.UPDATE);
                    permissions.add(Permission.Dashboard.DELETE);
                    permissions.add(Permission.Component.ADD);
                    permissions.add(Permission.Component.UPDATE);
                    permissions.add(Permission.Component.DELETE);
                    permissions.add(Permission.File.DELETE);
                    permissions.add(Permission.File.UPLOAD);
                    permissions.add(Permission.Datasource.DELETE);
                    permissions.add(Permission.Datasource.ADD);
                    permissions.add(Permission.Datasource.UPDATE);
                    permissions.add(Permission.Dataset.DELETE);
                    permissions.add(Permission.Dataset.ADD);
                    permissions.add(Permission.Dataset.UPDATE);
                    permissions.add(Permission.Dataset.CATEGORY_EDIT);
                    permissions.add(Permission.Dataset.LABEL_EDIT);
                    break;
                default:
                    throw new IllegalArgumentException("未知角色: " + role);
            }
        }
        return permissions;
    }
}
