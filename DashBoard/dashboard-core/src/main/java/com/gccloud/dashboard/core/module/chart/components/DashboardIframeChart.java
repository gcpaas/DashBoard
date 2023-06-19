package com.gccloud.dashboard.core.module.chart.components;

import com.gccloud.dashboard.core.constant.PageDesignConstant;
import com.gccloud.dashboard.core.module.chart.bean.Chart;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * @author hongyang
 * @version 1.0
 * @date 2023/3/13 16:44
 */
@Data
public class DashboardIframeChart extends Chart {

    @ApiModelProperty(notes = "外链地址")
    private String url;

    @ApiModelProperty(notes = "类型")
    private String type = PageDesignConstant.DashBoard.Type.IFRAME;

}
