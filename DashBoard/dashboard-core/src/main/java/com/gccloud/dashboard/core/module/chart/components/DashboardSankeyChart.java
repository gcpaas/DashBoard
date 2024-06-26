package com.gccloud.dashboard.core.module.chart.components;

import com.gccloud.dashboard.core.module.chart.bean.Chart;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.Map;

/**
 * 桑基图
 * @author hongyang
 * @version 1.0
 * @date 2023/3/13 16:44
 */
@Data
public class DashboardSankeyChart extends Chart {


    @ApiModelProperty(notes = "个性化")
    private Map<String, Object> customize;


}
