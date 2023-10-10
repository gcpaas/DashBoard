package com.gccloud.dashboard.core.module.manage.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.gccloud.common.utils.EmptyAsNullDeserializer;
import com.gccloud.common.validator.group.Insert;
import com.gccloud.common.validator.group.Update;
import com.gccloud.dashboard.core.constant.PageDesignConstant;
import com.gccloud.dashboard.core.module.basic.dto.BasePageDTO;
import com.gccloud.dashboard.core.module.chart.bean.Chart;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import java.util.List;

/**
 * 仪表盘页面
 * @author hongyang
 * @version 1.0
 * @date 2023/3/13 10:49
 */
@Data
public class DashboardPageDTO extends BasePageDTO {

    @JsonDeserialize(using = EmptyAsNullDeserializer.class)
    @NotBlank(message = "id不能为空", groups = Update.class)
    @ApiModelProperty(notes = "主键id")
    private String id;

    @NotBlank(message = "名称不能为空", groups = {Update.class, Insert.class})
    @ApiModelProperty(notes = "仪表盘名称")
    private String name;

    @NotBlank(message = "编码不能为空", groups = {Update.class})
    @ApiModelProperty(notes = "仪表盘唯一标识符")
    private String code;

    @ApiModelProperty(notes = "仪表盘页图标")
    private String icon;

    @ApiModelProperty(notes = "仪表盘首页封面")
    private String coverPicture;

    @ApiModelProperty(notes = "仪表盘页颜色")
    private String iconColor;

    @ApiModelProperty(notes = "排序")
    private Integer orderNum;

    @ApiModelProperty(notes = "备注")
    private String remark;

    @ApiModelProperty(notes = "仪表盘整体样式")
    private String style;

    @ApiModelProperty(notes = "父节点编码")
    private String parentCode;

    @ApiModelProperty(notes = "图表数据")
    private List<Chart> chartList;

    @ApiModelProperty(notes = "页面模板id")
    private String pageTemplateId;

    /**
     * 参考：{@link PageDesignConstant.Type}
     */
    @NotBlank(message = "类型不能为空", groups = {Update.class, Insert.class})
    @ApiModelProperty(notes = "类型")
    private String type;

    @ApiModelProperty(notes = "页面配置")
    private PageConfig pageConfig;

    @ApiModelProperty(notes = "所属应用编码")
    private String appCode;

    @Data
    public static class PageConfig {

        @ApiModelProperty(notes = "背景色")
        private String bgColor;

        @ApiModelProperty(notes = "背景图")
        private String bg;

        @ApiModelProperty(notes = "组件标题线宽度")
        private String titleLineWidth;

        @ApiModelProperty(notes = "组件标题线颜色")
        private String titleLineColor;

        @ApiModelProperty(notes = "组件标题字体大小")
        private String titleFontSize;

        @ApiModelProperty(notes = "组件标题字体颜色")
        private String titleFontColor;

        @ApiModelProperty(notes = "定时刷新配置")
        private List<RefreshConfig> refreshConfig;

    }



    @Data
    public static class RefreshConfig {

        @ApiModelProperty(notes = "组件编码")
        private String code;

        @ApiModelProperty(notes = "刷新时间，单位秒")
        private Integer time;

    }

}
