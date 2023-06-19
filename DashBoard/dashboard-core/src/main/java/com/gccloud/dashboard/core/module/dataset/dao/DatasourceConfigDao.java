package com.gccloud.dashboard.core.module.dataset.dao;

import com.gccloud.dashboard.core.module.dataset.entity.DatasourceConfig;
import com.gccloud.dashboard.core.dao.DashboardBaseDao;
import org.apache.ibatis.annotations.Mapper;

/**
 * @author pan.shun
 * @since 2021/9/6 14:58
 */
@Mapper
public interface DatasourceConfigDao extends DashboardBaseDao<DatasourceConfig> {

}
