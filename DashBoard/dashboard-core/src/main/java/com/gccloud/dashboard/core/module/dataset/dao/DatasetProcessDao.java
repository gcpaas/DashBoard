package com.gccloud.dashboard.core.module.dataset.dao;

import com.gccloud.dashboard.core.module.dataset.entity.DatasetProcessEntity;
import com.gccloud.dashboard.core.dao.DashboardBaseDao;
import org.apache.ibatis.annotations.Mapper;

/**
 * 自助数据集处理
 *
 * @Author yang.hw
 * @Date 2021/9/8 14:21
 */
@Mapper
public interface DatasetProcessDao extends DashboardBaseDao<DatasetProcessEntity> {

}
