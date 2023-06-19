package com.gccloud.dashboard.core.module.chart.components;

import com.gccloud.dashboard.core.constant.PageDesignConstant;
import com.gccloud.dashboard.core.module.chart.bean.Chart;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
/**
 * 文本
 * @author hongyang
 * @version 1.0
 * @date 2023/3/13 16:44
 */
@Data
public class DashboardTextChart extends Chart {
    
    @ApiModelProperty(notes = "组件类型")
    private String type = PageDesignConstant.DashBoard.Type.TEXT;

    @ApiModelProperty(notes = "个性化")
    private Customize customize = new Customize();

    @Data
    public static class Customize {

        @ApiModelProperty(notes = "字体大小")
        private Integer fontSize;

        @ApiModelProperty(notes = "字体粗细")
        private Integer fontWeight;

        @ApiModelProperty(notes = "字体颜色")
        private String color;

        @ApiModelProperty(notes = "标题")
        private String title;

    }
}
