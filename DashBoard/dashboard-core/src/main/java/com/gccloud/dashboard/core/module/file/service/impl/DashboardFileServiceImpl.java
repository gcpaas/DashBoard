package com.gccloud.dashboard.core.module.file.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gccloud.common.exception.GlobalException;
import com.gccloud.common.utils.QueryWrapperUtils;
import com.gccloud.common.vo.PageVO;
import com.gccloud.dashboard.core.module.file.dao.DashboardFileDao;
import com.gccloud.dashboard.core.module.file.dto.FileSearchDTO;
import com.gccloud.dashboard.core.module.file.entity.DashboardFileEntity;
import com.gccloud.dashboard.core.module.file.service.IDashboardFileService;
import com.google.common.collect.Maps;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * 文件管理
 */
@Service
@Slf4j
@ConditionalOnProperty(prefix = "gc.starter.component", name = "ISysFileService", havingValue = "DashboardFileServiceImpl", matchIfMissing = true)
public class DashboardFileServiceImpl extends ServiceImpl<DashboardFileDao, DashboardFileEntity> implements IDashboardFileService {

    @Override
    public PageVO<DashboardFileEntity> getPage(FileSearchDTO searchDTO) {
        LambdaQueryWrapper<DashboardFileEntity> queryWrapper = QueryWrapperUtils.wrapperLike(new LambdaQueryWrapper(), searchDTO.getSearchKey(), DashboardFileEntity::getOriginalName);
        queryWrapper.eq(StringUtils.isNotBlank(searchDTO.getModule()), DashboardFileEntity::getModule, searchDTO.getModule());
        queryWrapper.eq(StringUtils.isNotBlank(searchDTO.getExtension()), DashboardFileEntity::getExtension, searchDTO.getExtension());
        Map<String, String> aliasMap = Maps.newHashMap();
        aliasMap.put("space", "size");
        QueryWrapperUtils.wrapperSort(null, DashboardFileEntity.class, queryWrapper, searchDTO, aliasMap, DashboardFileEntity::getOriginalName, DashboardFileEntity::getCreateDate, DashboardFileEntity::getSize, DashboardFileEntity::getDownloadCount);
        return page(searchDTO, queryWrapper);
    }

    @Override
    public void updateDownloadCount(Integer addCount, String fileId) {
        if (addCount <= 0) {
            throw new GlobalException("下载次数不允许为负数或0");
        }
        baseMapper.updateDownloadCount(addCount, fileId);
    }

    @Override
    public List<String> getAllExtension() {
        // 去重获取所有文件后缀名
        return baseMapper.getAllExtension();
    }
}
