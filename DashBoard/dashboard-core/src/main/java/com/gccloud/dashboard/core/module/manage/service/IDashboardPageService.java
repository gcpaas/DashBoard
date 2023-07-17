package com.gccloud.dashboard.core.module.manage.service;

import com.gccloud.common.vo.PageVO;
import com.gccloud.dashboard.core.module.basic.entity.PageEntity;
import com.gccloud.dashboard.core.module.basic.service.IBasePageService;
import com.gccloud.dashboard.core.module.manage.dto.DashboardPageDTO;
import com.gccloud.dashboard.core.module.manage.dto.DashboardSearchDTO;

/**
 * @author hongyang
 * @version 1.0
 * @date 2023/3/13 10:59
 */
public interface IDashboardPageService extends IBasePageService {

    /**
     * 从空白新增仪表盘页
     *
     * @param dashboardPageDTO
     * @return
     */
    String add(DashboardPageDTO dashboardPageDTO);


    /**
     * 从模板新增仪表盘页
     *
     * @param dashboardPageDTO
     * @return
     */
    String addByTemplate(DashboardPageDTO dashboardPageDTO);

    /**
     * 根据编码获取仪表盘页配置
     *
     * @param dashboardPageDTO
     * @return
     */
    DashboardPageDTO getConfigByTemplate(DashboardPageDTO dashboardPageDTO);

    /**
     * 分页查询
     *
     * @param searchDTO
     * @return
     */
    PageVO<PageEntity> getByCategory(DashboardSearchDTO searchDTO);

    /**
     * 更新仪表盘页
     *
     * @param dashboardPageDTO
     */
    void update(DashboardPageDTO dashboardPageDTO);

    /**
     * 复制仪表盘页
     * @param dashboardEntity
     * @return
     */
    String copy(PageEntity dashboardEntity);

    /**
     * 根据编码删除
     *
     * @param code
     */
    void deleteByCode(String code);

}
