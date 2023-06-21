package com.gccloud.dashboard.core.module.file.service;

import com.gccloud.common.service.ISuperService;
import com.gccloud.common.vo.PageVO;
import com.gccloud.dashboard.core.module.file.dto.FileSearchDTO;
import com.gccloud.dashboard.core.module.file.entity.DashboardFileEntity;

import java.util.List;


/**
 * 文件管理
 *
 * @author liuchengbiao
 */
public interface IDashboardFileService extends ISuperService<DashboardFileEntity> {
    /**
     * 分页查询
     *
     * @param searchDTO
     * @return
     */
    PageVO<DashboardFileEntity> getPage(FileSearchDTO searchDTO);

    /**
     * 更新下载次数
     *
     * @param addCount
     * @param fileId
     */
    void updateDownloadCount(Integer addCount, String fileId);


    /**
     * 获取所有文件后缀(去重)
     *
     * @return
     */
    List<String> getAllExtension();

}
