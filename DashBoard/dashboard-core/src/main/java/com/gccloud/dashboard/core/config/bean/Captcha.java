package com.gccloud.dashboard.core.config.bean;

import com.gccloud.dashboard.core.constant.DashboardConst;
import lombok.Data;

/**
 * @author chen.hu
 * @date 2025/5/7 9:50
 */
@Data
public class Captcha {
    /**
     * 是否打开验证码
     */
    public boolean enable = false;
    /**
     * 参考 {@link DashboardConst.Captcha.Type}
     */
    public int type = 4;

    /**
     * 验证码图片宽度
     */
    public int width = 100;

    /**
     * 验证码图片高度
     */
    public int height = 30;

    /**
     * 验证码长度
     */
    public int length = 4;
}
