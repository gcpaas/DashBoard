package com.gccloud.dashboard.core.module.chart.components;

import com.gccloud.dashboard.core.constant.PageDesignConstant;
import com.gccloud.dashboard.core.module.chart.bean.Chart;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.List;

/**
 * @author hongyang
 * @version 1.0
 * @date 2022/11/14 14:52
 */
@Data
public class TabsChart extends Chart {

    @ApiModelProperty(notes = "类型")
    private String type = PageDesignConstant.DashBoard.Type.TABS;

    @ApiModelProperty(notes = "标签页")
    private List<Tab> tabList;

    @Data
    public static class Tab {

        @ApiModelProperty(notes = "子图表")
        private Chart chart;

        @ApiModelProperty(notes = "子图表编码")
        private String chartCode;

        @ApiModelProperty(notes = "显示标签")
        private String name;

    }

}
