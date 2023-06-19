package com.gccloud.dashboard.core.exception;

import com.gccloud.dashboard.core.constant.DashboardConst;
import lombok.Data;

/**
 * @author liuchengbiao
 * @date 2020-06-12 16:11
 */
@Data
public class GlobalException extends RuntimeException {

    private int code = DashboardConst.Response.Code.SERVER_ERROR;

    public GlobalException(String msg) {
        super(msg);
    }

    public GlobalException(String msg, Throwable e) {
        super(msg, e);
    }

    public GlobalException(String msg, int code) {
        super(msg);
        this.setCode(code);
    }

    public GlobalException(String msg, int code, Throwable e) {
        super(msg, e);
        this.setCode(code);
    }
}
