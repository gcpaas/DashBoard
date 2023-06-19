package com.gccloud.dashboard.core.module.chart.components;

import com.gccloud.dashboard.core.constant.PageDesignConstant;
import com.gccloud.dashboard.core.module.chart.bean.Chart;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 数字图表
 * @author liuchengbiao
 * @version 1.0
 * @date 2022/8/8 15:11
 */
@Data
public class DashboardBigNumberChart extends Chart {

    @ApiModelProperty(notes = "类型")
    private String type = PageDesignConstant.DashBoard.Type.BIG_NUMBER;

    @ApiModelProperty(notes = "个性化")
    private Customize customize = new Customize();


    @Data
    public static class Customize {

        @ApiModelProperty(notes = "字体大小")
        private Integer fontSize = 30;

        @ApiModelProperty(notes = "字体粗细")
        private Integer fontWeight = 700;

        @ApiModelProperty(notes = "数字格式")
        private String numberFormat;


    }
}
