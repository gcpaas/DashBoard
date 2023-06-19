package com.gccloud.dashboard.core.module.template.dao;

import com.gccloud.dashboard.core.dao.DashboardBaseDao;
import com.gccloud.dashboard.core.module.template.entity.PageTemplateEntity;
import org.apache.ibatis.annotations.Mapper;

/**
 * @author hongyang
 * @version 1.0
 * @date 2023/3/20 16:41
 */
@Mapper
public interface PageTemplateDao extends DashboardBaseDao<PageTemplateEntity> {
}
