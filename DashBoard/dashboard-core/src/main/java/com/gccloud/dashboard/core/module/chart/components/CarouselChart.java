package com.gccloud.dashboard.core.module.chart.components;

import com.gccloud.dashboard.core.constant.PageDesignConstant;
import com.gccloud.dashboard.core.module.chart.bean.Chart;
import com.google.common.collect.Lists;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.HashMap;
import java.util.List;

/**
 * 轮播图
 * @author hongyang
 * @version 1.0
 * @date 2023/2/21 14:03
 */
@Data
public class CarouselChart extends Chart {

    @ApiModelProperty(notes = "数据来源类型，dataSet数据集，static静态数据")
    private String dataSourceType;

    @ApiModelProperty(notes = "类型")
    private String type = PageDesignConstant.DashBoard.Type.CAROUSEL;

    @ApiModelProperty(notes = "图片配置")
    private List<PicConfig> customizeList = Lists.newArrayList();

    @ApiModelProperty(notes = "个性化配置")
    private Customize customize = new Customize();


    @Data
    public static class PicConfig {

        @ApiModelProperty(notes = "图片地址")
        private String url;

        @ApiModelProperty(notes = "图片描述文本")
        private String description;

        @ApiModelProperty(notes = "轮播图点击事件")
        private HashMap<String, Object> eventConfig;

    }


    @Data
    public static class Customize {

        @ApiModelProperty(notes = "指示器的触发方式")
        private String trigger;

        @ApiModelProperty(notes = "指示器的位置")
        private String indicatorPosition;

        @ApiModelProperty(notes = "切换箭头的时机")
        private String arrow;

        @ApiModelProperty(notes = "轮播图的模式")
        private String type;

        @ApiModelProperty(notes = "轮播图方向")
        private String direction;

        @ApiModelProperty(notes = "是否自动切换")
        private boolean autoplay;

        @ApiModelProperty(notes = "自动切换的时间间隔")
        private Integer interval;

        @ApiModelProperty(notes = "是否循环显示")
        private boolean loop;

        @ApiModelProperty(notes = "初始状态激活的幻灯片的索引")
        private Integer initialIndex = 0;

    }

}
