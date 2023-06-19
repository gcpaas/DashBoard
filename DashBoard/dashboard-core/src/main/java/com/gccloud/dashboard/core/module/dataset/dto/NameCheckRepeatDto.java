package com.gccloud.dashboard.core.module.dataset.dto;

import com.gccloud.dashboard.core.entity.SuperEntity;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * @author zhang.zeJun
 * @date 2022-10-20-16:18
 */
@Data
public class NameCheckRepeatDto extends SuperEntity {

    @ApiModelProperty(value = "名称")
    private String name;

    @ApiModelProperty(value = "模块编码")
    private String moduleCode;
}
