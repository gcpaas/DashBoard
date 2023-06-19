package com.gccloud.dashboard.core.module.chart.components;

import com.gccloud.dashboard.core.constant.PageDesignConstant;
import com.gccloud.dashboard.core.module.chart.bean.Chart;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.List;

/**
 * 链接组件
 * @author hongyang
 * @version 1.0
 * @date 2023/3/13 16:44
 */
@Data
public class DashboardIconLinkChart extends Chart {
    
    @ApiModelProperty(notes = "组件类型")
    private String type = PageDesignConstant.DashBoard.Type.ICON_LINK;

    @ApiModelProperty(notes = "个性化")
    private Customize customize = new Customize();

    @Data
    public static class Customize {

        @ApiModelProperty(notes = "跳转链接列表")
        private List<Link> linkList;

    }

    @Data
    public static class Link {

        @ApiModelProperty(notes = "名称")
        private String name;

        @ApiModelProperty(notes = "链接地址")
        private String url;

        @ApiModelProperty(notes = "打开方式")
        private String target;

        @ApiModelProperty(notes = "图标")
        private String icon;

        @ApiModelProperty(notes = "图标颜色")
        private String iconColor;

    }

}
