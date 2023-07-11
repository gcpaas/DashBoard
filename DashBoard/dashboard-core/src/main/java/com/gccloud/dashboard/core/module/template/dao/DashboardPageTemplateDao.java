package com.gccloud.dashboard.core.module.template.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gccloud.dashboard.core.module.template.entity.PageTemplateEntity;
import org.apache.ibatis.annotations.Mapper;

/**
 * @author hongyang
 * @version 1.0
 * @date 2023/3/20 16:41
 */
@Mapper
public interface DashboardPageTemplateDao extends BaseMapper<PageTemplateEntity> {
}
