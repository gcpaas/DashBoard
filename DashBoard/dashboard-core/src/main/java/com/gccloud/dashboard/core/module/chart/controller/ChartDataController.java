package com.gccloud.dashboard.core.module.chart.controller;

import com.gccloud.common.permission.ApiPermission;
import com.gccloud.common.utils.AssertUtils;
import com.gccloud.common.vo.R;
import com.gccloud.dashboard.core.module.basic.dto.BasePageDTO;
import com.gccloud.dashboard.core.module.basic.entity.PageEntity;
import com.gccloud.dashboard.core.module.chart.bean.Chart;
import com.gccloud.dashboard.core.module.chart.dto.ChartDataSearchDTO;
import com.gccloud.dashboard.core.module.chart.service.BaseChartDataService;
import com.gccloud.dashboard.core.module.chart.service.ChartMockData;
import com.gccloud.dashboard.core.module.chart.vo.ChartDataVO;
import com.gccloud.dashboard.core.module.manage.dto.DashboardPageDTO;
import com.gccloud.dashboard.core.module.manage.service.IDashboardPageService;
import com.gccloud.dashboard.core.permission.Permission;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.List;

/**
 * 图表组件数据获取
 * @author liuchengbiao
 * @version 1.0
 * @date 2022/8/8 15:11
 */
@Slf4j
@RestController("dashboardChartController")
@RequestMapping("/dashboard/chart/data")
@Api(tags = "图表组件数据获取")
public class ChartDataController {

    @Resource
    private IDashboardPageService pageService;
    @Resource
    private BaseChartDataService baseChartDataService;

    @ApiPermission(permissions = {Permission.Dataset.VIEW})
    @PostMapping("/list")
    @ApiOperation(value = "图表数据", position = 10, notes = "获取指定图表的数据(通过唯一编码)", produces = MediaType.APPLICATION_JSON_VALUE)
    public R<ChartDataVO> getChartDataByCode(@RequestBody ChartDataSearchDTO chartDataSearchDTO) {
        PageEntity pageEntity = pageService.getByCode(chartDataSearchDTO.getPageCode());
        AssertUtils.isTrue(pageEntity != null, "页面不存在");
        BasePageDTO config = pageEntity.getConfig();
        List<Chart> chartList = null;
        if (config.getClass().equals(DashboardPageDTO.class)) {
            chartList = ((DashboardPageDTO) config).getChartList();
        }
        if (chartList == null) {
            ChartDataVO mockData = ChartMockData.getMockData(chartDataSearchDTO.getType());
            return R.success(mockData);
        }
        Chart chart = getByCode(chartList, chartDataSearchDTO.getChartCode());
        return getChartData(chartDataSearchDTO, config, chart);
    }

    @ApiPermission(permissions = {Permission.Dataset.VIEW})
    @PostMapping("/chart")
    @ApiOperation(value = "图表数据", position = 10, notes = "获取指定图表的数据(通过配置)", produces = MediaType.APPLICATION_JSON_VALUE)
    public R<ChartDataVO> getChartDataByChart(@RequestBody ChartDataSearchDTO chartDataSearchDTO) {
        PageEntity pageEntity = pageService.getByCode(chartDataSearchDTO.getPageCode());
        AssertUtils.isTrue(pageEntity != null, "页面不存在");
        BasePageDTO config = pageEntity.getConfig();
        Chart chart = chartDataSearchDTO.getChart();
        return getChartData(chartDataSearchDTO, config, chart);
    }

    /**
     * 获取图表数据
     * @param chartDataSearchDTO
     * @param config
     * @param chart
     * @return
     */
    private R<ChartDataVO> getChartData(ChartDataSearchDTO chartDataSearchDTO, BasePageDTO config, Chart chart) {
        if (chart == null) {
            ChartDataVO mockData = ChartMockData.getMockData(chartDataSearchDTO.getType());
            return R.success(mockData);
        }
        try {
            ChartDataVO chartDataVO = baseChartDataService.dataQuery(chart, chartDataSearchDTO);
            if (chartDataVO == null) {
                chartDataVO = ChartMockData.getMockData(chartDataSearchDTO.getType());
            }
            return R.success(chartDataVO);
        } catch (Exception e) {
            log.error("图表数据获取失败", e);
            ChartDataVO mockData = ChartMockData.getMockData(chartDataSearchDTO.getType());
            return R.success(mockData);
        }
    }

    /**
     * 从组件列表中获取指定code的图表组件
     * @param chartList
     * @param code
     * @return
     */
    public Chart getByCode(List<Chart> chartList, String code) {
        for (Chart chart : chartList) {
            if (chart.getCode().equals(code)) {
                return chart;
            }
        }
        return null;
    }
}
