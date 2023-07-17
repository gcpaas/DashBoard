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

        }

        interface TimeRange {
            /**
             * 昨天
             */
            String LAST_DAY = "lastDay";
            /**
             * 最近一周
             */
            String LAST_WEEK = "lastWeek";
            /**
             * 最近一月
             */
            String LAST_MONTH = "lastMonth";
            /**
             * 最近一季度
             */
            String LAST_QUARTER = "lastQuarter";
            /**
             * 最近一年
             */
            String LAST_YEAR = "lastYear";

            /**
             * 上周
             */
            String PREVIOUS_WEEK = "previousWeek";
            /**
             * 上月
             */
            String PREVIOUS_MONTH = "previousMonth";
            /**
             * 上一年
             */
            String PREVIOUS_YEAR = "previousYear";

        }

        interface TimeGrain {
            /**
             * 原始值
             */
            String ORIGINAL = "original";
            /**
             * 秒
             */
            String SECOND = "second";
            /**
             * 分钟
             */
            String MINUTE = "minute";
            /**
             * 小时
             */
            String HOUR = "hour";
            /**
             * 日
             */
            String DAY = "day";
            /**
             * 周
             */
            String WEEK = "week";
            /**
             * 月
             */
            String MONTH = "month";
            /**
             * 季度
             */
            String QUARTER = "quarter";
            /**
             * 年
             */
            String YEAR = "year";
        }

        interface Operator {
            /**
             * 等于
             */
            String EQUAL = "=";
            /**
             * 不等于
             */
            String NOT_EQUAL = "!=";
            /**
             * 大于
             */
            String GREATER_THAN = ">";
            /**
             * 小于
             */
            String LESS_THAN = "<";
            /**
             * 大于等于
             */
            String GREATER_THAN_OR_EQUAL = ">=";
            /**
             * 小于等于
             */
            String LESS_THAN_OR_EQUAL = "<=";
            /**
             * 在...之中
             */
            String IN = "IN";
            /**
             * 不在...之中
             */
            String NOT_IN = "NOT IN";
            /**
             * 包含
             */
            String LIKE = "LIKE";
            /**
             * 为空
             */
            String IS_NULL = "IS NULL";
            /**
             * 不为空
             */
            String IS_NOT_NULL = "IS NOT NULL";


        }

        interface Aggregate {
            /**
             * 统计
             */
            String COUNT = "COUNT";
            /**
             * 求和
             */
            String SUM = "SUM";
            /**
             * 平均值
             */
            String AVG = "AVG";
            /**
             * 最大值
             */
            String MAX = "MAX";
            /**
             * 最小值
             */
            String MIN = "MIN";
            /**
             * 统计不重复值
             */
            String COUNT_DISTINCT = "COUNT_DISTINCT";
        }
    }


}
