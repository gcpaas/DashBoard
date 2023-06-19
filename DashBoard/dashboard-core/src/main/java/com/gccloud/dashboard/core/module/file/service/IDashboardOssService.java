package com.gccloud.dashboard.core.module.file.service;


import com.gccloud.dashboard.core.module.file.entity.DashboardFileEntity;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 文件管理
 *
 * @author liuchengbiao
 */
public interface IDashboardOssService {
    /**
     * 上传文件
     *
     * @param file
     * @param entity
     * @param response
     * @param request
     * @return
     */
    DashboardFileEntity upload(MultipartFile file, DashboardFileEntity entity, HttpServletResponse response, HttpServletRequest request);

    /**
     * 下载文件
     *
     * @param fileId
     * @param response
     * @param request
     */
    void download(String fileId, HttpServletResponse response, HttpServletRequest request);


    /**
     * 删除文件
     * @param fileId
     */
    void delete(String fileId);
}
