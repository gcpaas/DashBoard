package com.gccloud.dashboard.core.module.manage.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gccloud.common.exception.GlobalException;
import com.gccloud.common.utils.AssertUtils;
import com.gccloud.common.utils.BeanConvertUtils;
import com.gccloud.common.utils.QueryWrapperUtils;
import com.gccloud.common.vo.PageVO;
import com.gccloud.dashboard.core.config.DashboardConfig;
import com.gccloud.dashboard.core.constant.PageDesignConstant;
import com.gccloud.dashboard.core.module.basic.dao.DashboardPageDao;
import com.gccloud.dashboard.core.module.basic.entity.PageEntity;
import com.gccloud.dashboard.core.module.chart.bean.Chart;
import com.gccloud.dashboard.core.module.chart.components.datasource.DataSetDataSource;
import com.gccloud.dashboard.core.module.manage.dto.DashboardPageDTO;
import com.gccloud.dashboard.core.module.manage.dto.DashboardSearchDTO;
import com.gccloud.dashboard.core.module.manage.extend.DashboardExtendClient;
import com.gccloud.dashboard.core.module.manage.service.IDashboardPageService;
import com.gccloud.dashboard.core.module.template.entity.PageTemplateEntity;
import com.gccloud.dashboard.core.module.template.service.IPageTemplateService;
import com.gccloud.dashboard.core.utils.CodeGenerateUtils;
import com.google.common.collect.Lists;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Objects;

/**
 * @author hongyang
 * @version 1.0
 * @date 2023/3/13 11:05
 */
@Service
@Slf4j
public class DashboardPageServiceImpl extends ServiceImpl<DashboardPageDao, PageEntity> implements IDashboardPageService {


    @Resource
    private IPageTemplateService pageTemplateService;

    @Resource
    private DashboardConfig dashboardConfig;

    @Resource
    private DashboardExtendClient dashboardExtendClient;

    @Override
    public String add(DashboardPageDTO dashboardPageDTO) {
        if (StringUtils.isBlank(dashboardPageDTO.getCode())) {
            String code = CodeGenerateUtils.generate(dashboardPageDTO.getType());
            dashboardPageDTO.setCode(code);
        }
        List<Chart> chartList = dashboardPageDTO.getChartList();
        if (CollectionUtils.isEmpty(chartList)) {
            chartList = Lists.newArrayList();
        }
        for (Chart chart : chartList) {
            if (StringUtils.isNotBlank(chart.getCode())) {
                continue;
            }
            chart.setCode(CodeGenerateUtils.generate(chart.getType() == null ? "chart" : chart.getType()));
        }
        if (StringUtils.isNotBlank(dashboardPageDTO.getCoverPicture())) {
            String base64Str = dashboardPageDTO.getCoverPicture();
            String fileUrl = this.saveCoverPicture(base64Str, dashboardPageDTO.getCode());
            dashboardPageDTO.setCoverPicture(fileUrl);
        }
        PageEntity dashboard = BeanConvertUtils.convert(dashboardPageDTO, PageEntity.class);
        dashboard.setConfig(dashboardPageDTO);
        AssertUtils.isTrue(!checkNameRepeat(dashboard), "名称重复");
        AssertUtils.isTrue(!checkCodeRepeat(dashboard), "编码重复");
        this.save(dashboard);
        return dashboard.getCode();
    }


    /**
     * 将base64字符串转为图片文件存储
     *
     * @param base64String
     * @param fileName
     * @return
     */
    private String saveCoverPicture(String base64String, String fileName) {
        String fileUrl = "";
        if (StringUtils.isBlank(base64String)) {
            return fileUrl;
        }
        try {
            // 去除base64字符串前缀，从初始位置，到逗号位置
            base64String = base64String.substring(base64String.indexOf(",") + 1);
            // 解码base64字符串
            byte[] imageBytes = Base64.getDecoder().decode(base64String);
            String basePath = dashboardConfig.getFile().getBasePath();
            // 不是/结尾，加上/
            if (!basePath.endsWith("/") || !basePath.endsWith("\\")) {
                basePath += File.separator;
            }
            // 检查目录是否存在，不存在则创建
            File file = new File(basePath + "cover");
            if (!file.exists()) {
                file.mkdirs();
            }
            // 保存为图片文件
            String filePath = basePath + "cover" + File.separator + fileName + ".png";
            fileUrl = "cover" + File.separator + fileName + ".png";
            FileOutputStream outputStream = new FileOutputStream(filePath);
            outputStream.write(imageBytes);
            outputStream.close();
            log.info("仪表盘封面保存至：{}", filePath);
        } catch (IOException e) {
            log.error(ExceptionUtils.getStackTrace(e));
        }
        return fileUrl;
    }

    @Override
    public String addByTemplate(DashboardPageDTO dashboardPageDTO) {
        if (StringUtils.isBlank(dashboardPageDTO.getPageTemplateId())) {
            throw new GlobalException("页面模板不能为空");
        }
        dashboardPageDTO = getConfigByTemplate(dashboardPageDTO);
        return add(dashboardPageDTO);
    }

    @Override
    public DashboardPageDTO getConfigByTemplate(DashboardPageDTO dashboardPageDTO) {
        String pageTemplateId = dashboardPageDTO.getPageTemplateId();
        PageTemplateEntity pageTemplate = pageTemplateService.getById(pageTemplateId);
        AssertUtils.isTrue(pageTemplate != null, "页面模板不存在");
        AssertUtils.isTrue(Objects.equals(pageTemplate.getType(), PageDesignConstant.Type.DASHBOARD), "页面模板类型不正确");
        DashboardPageDTO config = (DashboardPageDTO) pageTemplate.getConfig();
        String name = dashboardPageDTO.getName();
        if (StringUtils.isBlank(name)) {
            int i = 0;
            String newName = pageTemplate.getName() + "副本";
            while (checkNameRepeat(dashboardPageDTO.getAppCode(), newName, null, "dashboard")) {
                i++;
                newName = pageTemplate.getName() + "副本" + i;
            }
            name = newName;
        }
        config.setName(name);
        config.setCode(dashboardPageDTO.getCode());
        config.setParentCode(dashboardPageDTO.getParentCode());
        config.setId(dashboardPageDTO.getId());
        config.setAppCode(dashboardPageDTO.getAppCode());
        List<Chart> chartList = config.getChartList();
        if (CollectionUtils.isEmpty(chartList)) {
            chartList = Lists.newArrayList();
        }
        for (Chart chart : chartList) {
            chart.setCode("");
            chart.setDataSource(new DataSetDataSource());
        }
        return config;
    }

    @Override
    public PageVO<PageEntity> getByCategory(DashboardSearchDTO searchDTO) {
        if (StringUtils.isBlank(searchDTO.getType())) {
            throw new GlobalException("类型不能为空");
        }
        LambdaQueryWrapper<PageEntity> queryWrapper = QueryWrapperUtils.wrapperLike(new LambdaQueryWrapper<>(), searchDTO.getSearchKey(), PageEntity::getName);
        if (StringUtils.isNotBlank(searchDTO.getParentCode())) {
            queryWrapper.eq(PageEntity::getParentCode, searchDTO.getParentCode());
        }
        queryWrapper.eq(PageEntity::getType, searchDTO.getType());
        queryWrapper.select(PageEntity::getId, PageEntity::getAppCode, PageEntity::getCode, PageEntity::getName, PageEntity::getOrderNum, PageEntity::getParentCode, PageEntity::getCoverPicture, PageEntity::getUpdateDate);
        queryWrapper.orderByAsc(PageEntity::getOrderNum);
        queryWrapper.orderByDesc(PageEntity::getCreateDate);
        PageVO<PageEntity> page = page(searchDTO, queryWrapper);
        List<PageEntity> list = page.getList();
        if (list == null || list.isEmpty()) {
            return page;
        }
        String urlPrefix = dashboardConfig.getFile().getUrlPrefix();
        if (!urlPrefix.endsWith("/")) {
            urlPrefix += "/";
        }
        for (PageEntity pageEntity : list) {
            if (StringUtils.isBlank(pageEntity.getCoverPicture())) {
                continue;
            }
            pageEntity.setCoverPicture(urlPrefix + pageEntity.getCoverPicture().replace("\\", "/"));
        }
        return page;
    }


    @Override
    public void update(DashboardPageDTO dashboardPageDTO) {
        AssertUtils.isTrue(StringUtils.isNotBlank(dashboardPageDTO.getCode()), "编码不能为空");
        AssertUtils.isTrue(StringUtils.isNotBlank(dashboardPageDTO.getName()), "名称不能为空");
        List<Chart> chartList = dashboardPageDTO.getChartList();
        if (CollectionUtils.isNotEmpty(chartList)) {
            for (Chart chart : chartList) {
                if (StringUtils.isNotBlank(chart.getCode())) {
                    continue;
                }
                chart.setCode(CodeGenerateUtils.generate(chart.getType() == null ? "chart" : chart.getType()));
            }
        }
        if (StringUtils.isNotBlank(dashboardPageDTO.getCoverPicture())) {
            String coverPicture = this.saveCoverPicture(dashboardPageDTO.getCoverPicture(), dashboardPageDTO.getCode());
            dashboardPageDTO.setCoverPicture(coverPicture);
        }
        PageEntity dashboardEntity = BeanConvertUtils.convert(dashboardPageDTO, PageEntity.class);
        dashboardEntity.setConfig(dashboardPageDTO);
        AssertUtils.isTrue(!checkNameRepeat(dashboardEntity), "名称重复");
        AssertUtils.isTrue(!checkCodeRepeat(dashboardEntity), "编码重复");
        this.updateById(dashboardEntity);
        PAGE_ENTITY_CACHE.invalidate(dashboardPageDTO.getCode());
    }

    @Override
    public String copy(PageEntity dashboardEntity) {
        DashboardPageDTO config = (DashboardPageDTO) dashboardEntity.getConfig();
        dashboardEntity.setId(null);
        dashboardEntity.setCode(CodeGenerateUtils.generate(dashboardEntity.getType()));
        dashboardEntity.setName(dashboardEntity.getName() + "_复制");
        config.setName(dashboardEntity.getName());
        config.setCode(dashboardEntity.getCode());
        List<Chart> chartList = config.getChartList();
        for (Chart chart : chartList) {
            chart.setCode(CodeGenerateUtils.generate(chart.getType() == null ? "chart" : chart.getType()));
        }
        this.save(dashboardEntity);
        return dashboardEntity.getCode();
    }

    @Override
    public void deleteByCode(String code) {
        LambdaQueryWrapper<PageEntity> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(PageEntity::getCode, code);
        this.remove(queryWrapper);
        PAGE_ENTITY_CACHE.invalidate(code);
        // 调用扩展接口
        dashboardExtendClient.deleteByCode(code);
    }
}
