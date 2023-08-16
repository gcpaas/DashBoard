package com.gccloud.dashboard.config;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.context.annotation.Configuration;

import java.util.Date;

/**
 * 用于填充创建时间和更新时间字段
 * @author hongyang
 * @version 1.0
 * @date 2023/8/16 14:01
 */
@Configuration
public class DashboardMetaObjectHandler implements MetaObjectHandler {

    /**
     * 创建时间字段
     */
    private static final String CREATE_DATE = "createDate";
    /**
     * 更新时间字段
     */
    private static final String UPDATE_DATE = "updateDate";

    @Override
    public void insertFill(MetaObject metaObject) {
        Date date = new Date();
        this.setFieldValByName(CREATE_DATE, date, metaObject);
        this.setFieldValByName(UPDATE_DATE, date, metaObject);
    }

    @Override
    public void updateFill(MetaObject metaObject) {
        this.setFieldValByName(UPDATE_DATE, new Date(), metaObject);
    }
}
