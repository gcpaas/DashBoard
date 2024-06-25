package com.gccloud.dashboard.core.constant;

/**
 * @author zhang.tianming
 */
public interface PageDesignConstant {

    /**
     * 页面类型
     */
    interface Type {
        /**
         * 仪表盘
         */
        String DASHBOARD = "dashboard";

    }


    interface CategoryType {
        /**
         * 仪表盘目录
         */
        String DASHBOARD = "dashboardCatalog";

        /**
         * 仪表盘模板目录
         */
        String DASHBOARD_TEMPLATE = "dashboardTemplateCatalog";

        /**
         * 资源库目录
         */
        String RESOURCE = "resourceCatalog";

        /**
         * 组件库目录
         */
        String COMPONENT = "componentCatalog";

    }

    /**
     * 仪表盘
     */
    interface DashBoard {

        interface Type {

            /**
             * tab页
             */
            String TABS = "tabs";

            /**
             * 轮播图
             */
            String CAROUSEL = "carousel";

            /**
             * 详情
             */
            String DETAIL = "detail";

            /**
             * 多数字
             */
            String MULTIPLE_NUMBER = "multipleNumberChart";

            /**
             * 表格
             */
            String TABLES = "tables";

            /**
             * 外链
             */
            String IFRAME = "iframeChart";

            /**
             * 倒计时
             */
            String TIME_COUNT_DOWN = "timeCountDown";

            /**
             * 当前时间
             */
            String CURRENT_TIME = "currentTime";

            /**
             * 文本
             */
            String TEXT = "texts";

            /**
             * 装饰边框
             */
            String BORDER = "border";

            /**
             * 滚动面板
             */
            String DASHBOARD_SCROLL_BOARD = "dashboardScrollBoard";

            /**
             * 滚动排行榜
             */
            String DASHBOARD_SCROLL_RANKING = "dashboardScrollRanking";
            /**
             * 自定义组件
             */
            String CUSTOM_COMPONENT = "customComponent";

            /**
             * 地图
             */
            String MAP = "map";

            /**
             * 图标
             */
            String SVGS = "svgs";

            /**
             * 数字翻牌器
             */
            String DIGITAL_FLOP = "digitalFlop";

            /**
             * 视频
             */
            String VIDEO = "video";

            /**
             * 输入框
             */
            String INPUT = "input";

            /**
             * 按钮
             */
            String BUTTON = "button";

            /**
             * 超链接
             */
            String LINK = "linkChart";

            /**
             * 超链接
             */
            String ICON_LINK = "icon_link";

            /**
             * 数字
             */
            String BIG_NUMBER = "bigNumber";

            /**
             * K线图
             */
            String K_LINE = "kLine";

        }
    }


}
