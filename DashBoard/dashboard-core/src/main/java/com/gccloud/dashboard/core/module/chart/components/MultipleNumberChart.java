package com.gccloud.dashboard.core.module.chart.components;

import com.gccloud.dashboard.core.constant.PageDesignConstant;
import com.gccloud.dashboard.core.module.chart.bean.Chart;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.List;

/**
 * 多个数字图表
 * @author liuchengbiao
 * @version 1.0
 * @date 2022/8/8 15:11
 */
@Data
public class MultipleNumberChart extends Chart {

    @ApiModelProperty(notes = "类型")
    private String type = PageDesignConstant.DashBoard.Type.MULTIPLE_NUMBER;

    @ApiModelProperty(notes = "个性化")
    private Customize customize;


    /**
     * 定制化
     */
    @Data
    public static class Customize {

        @ApiModelProperty("数字配置列表")
        private List<NumberConfig> customizeList;
    }

    @Data
    public static class NumberConfig {

            @ApiModelProperty(notes = "指标")
            private String metric;

            @ApiModelProperty(notes = "指标名称")
            private String descriptionField;

            @ApiModelProperty(notes = "指标字体大小")
            private Integer metricFontSize;

            @ApiModelProperty(notes = "指标字体权重")
            private Integer metricFontWeight;

            @ApiModelProperty(notes = "指标字体颜色")
            private String metricColor;

            @ApiModelProperty(notes = "描述字体大小")
            private Integer descriptionFontSize;

            @ApiModelProperty(notes = "描述字体权重")
            private Integer descriptionWeight;

            @ApiModelProperty(notes = "描述字体颜色")
            private String descriptionColor;

            @ApiModelProperty(notes = "指标格式")
            private String numberFormat;
    }

}
