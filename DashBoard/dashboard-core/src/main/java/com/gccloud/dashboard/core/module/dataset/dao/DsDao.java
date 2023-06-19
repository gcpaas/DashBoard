package com.gccloud.dashboard.core.module.dataset.dao;

import com.gccloud.dashboard.core.module.dataset.vo.DataSetInfoVo;
import com.gccloud.dashboard.core.dao.DashboardBaseDao;
import org.apache.ibatis.annotations.Mapper;

/**
 * @author zhang.zeJun
 * @date 2022-11-17-11:03
 */
@Mapper
public interface DsDao extends DashboardBaseDao<DataSetInfoVo> {
}
