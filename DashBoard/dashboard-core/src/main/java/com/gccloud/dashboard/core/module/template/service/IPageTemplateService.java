package com.gccloud.dashboard.core.module.template.service;

import com.gccloud.common.service.ISuperService;
import com.gccloud.common.vo.PageVO;
import com.gccloud.dashboard.core.module.template.dto.PageTemplateSearchDTO;
import com.gccloud.dashboard.core.module.template.entity.PageTemplateEntity;

import java.util.List;

/**
 * @author hongyang
 * @version 1.0
 * @date 2023/3/20 16:38
 */
public interface IPageTemplateService extends ISuperService<PageTemplateEntity> {

    /**
     * 分页查询
     *
     * @param searchDTO
     * @return
     */
    PageVO<PageTemplateEntity> getPage(PageTemplateSearchDTO searchDTO);

    /**
     * 列表查询
     *
     * @param searchDTO
     * @return
     */
    List<PageTemplateEntity> getList(PageTemplateSearchDTO searchDTO);

    /**
     * 新增
     *
     * @param pageTemplate
     * @return
     */
    String add(PageTemplateEntity pageTemplate);

    /**
     * 删除
     *
     * @param ids
     */
    void deleteByIds(List<String> ids);

    /**
     * 修改
     *
     * @param pageTemplate
     */
    void update(PageTemplateEntity pageTemplate);
}
