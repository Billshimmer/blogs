package com.netease.nim.uikit.module;


import com.netease.nim.uikit.system.IMMessage;

/**
 * 消息转发过滤器
 */
public interface MsgForwardFilter {
    /**
     * 是否过滤该消息的转发 （默认不过滤）
     * @param message 消息
     * @return 返回true为过滤，返回false则不过滤
     */
    boolean shouldIgnore(IMMessage message);
}
