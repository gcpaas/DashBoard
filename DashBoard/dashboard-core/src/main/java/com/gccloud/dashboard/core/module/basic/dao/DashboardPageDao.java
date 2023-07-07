package com.gccloud.dashboard.core.module.basic.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gccloud.dashboard.core.module.basic.entity.PageEntity;
import org.apache.ibatis.annotations.Mapper;

/**
 * @Author qianxing
 * @Date 2022/06/07
 * @Version 1.0.0
 */
@Mapper
public interface DashboardPageDao extends BaseMapper<PageEntity> {

}