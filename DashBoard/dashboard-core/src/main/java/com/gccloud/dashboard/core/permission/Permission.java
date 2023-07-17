package com.gccloud.dashboard.core.permission;

import com.gccloud.dataset.constant.DatasetConstant;

/**
 * 仪表盘页面的权限常量类
 * @author hongyang
 * @version 1.0
 * @date 2023/5/15 17:08
 */
public interface Permission extends DatasetConstant.Permission {

    /**
     * 仪表盘页面的权限
     */
    interface Dashboard {

        /**
         * 仪表盘页面/组件的查询接口权限
         */
        String VIEW = "dashboard:view";

        /**
         * 仪表盘页面/组件的编辑接口权限
         */
        String ADD = "dashboard:add";

        /**
         * 仪表盘页面/组件的编辑接口权限
         */
        String UPDATE = "dashboard:update";

        /**
         * 仪表盘页面/组件的删除接口权限
         */
        String DELETE = "dashboard:delete";

    }

}
