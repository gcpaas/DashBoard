package com.gccloud.dashboard.core.module.chart.components;

import com.gccloud.dashboard.core.constant.PageDesignConstant;
import com.gccloud.dashboard.core.module.chart.bean.Chart;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.LinkedList;

/**
 * @author hongyang
 * @version 1.0
 * @date 2023/3/22 16:10
 */
@Data
public class DashboardScrollRankingChart extends Chart {

    @ApiModelProperty(notes = "类型")
    private String type = PageDesignConstant.DashBoard.Type.DASHBOARD_SCROLL_RANKING;

    @ApiModelProperty(notes = "个性化")
    private Customize customize = new Customize();

    @Data
    public static class Customize {

        @ApiModelProperty(notes = "高亮个数")
        private Integer highlightNum;

        @ApiModelProperty(notes = "高亮显示自定义样式")
        private LinkedList<HighlightStyle> highlightStyle;
    }

    @Data
    public static class HighlightStyle {

        @ApiModelProperty(notes = "高亮颜色")
        private String highlightColor;

        @ApiModelProperty(notes = "高亮标记")
        private Integer mark;
    }

}
