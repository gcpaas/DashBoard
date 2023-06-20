package com.gccloud.dashboard.core.module.chart.components;

import com.gccloud.dashboard.core.constant.PageDesignConstant;
import com.gccloud.dashboard.core.module.chart.bean.Btn;
import com.gccloud.dashboard.core.module.chart.bean.Chart;
import com.gccloud.dashboard.core.module.chart.bean.Field;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.List;

/**
 * @author hongyang
 * @version 1.0
 * @date 2023/2/8 15:28
 */
@Data
public class DetailChart extends Chart {
    
    @ApiModelProperty(notes = "类型")
    private String type = PageDesignConstant.DashBoard.Type.DETAIL;

    @ApiModelProperty(notes = "快速筛选项配置")
    private List<Field> fields;

    @ApiModelProperty(notes = "查询表单按钮")
    private List<Btn> btns;

    @ApiModelProperty(notes = "自定义")
    private Customize customize;

    @Data
    public static class Customize {

        @ApiModelProperty(notes = "几列")
        private Integer column;

    }

}
