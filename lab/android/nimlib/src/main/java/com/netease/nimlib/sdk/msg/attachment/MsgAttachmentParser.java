package com.netease.nimlib.sdk.msg.attachment;

import java.io.Serializable;

/**
 * Created by dansejijie on 17/4/4.
 */

public interface MsgAttachmentParser extends Serializable {
    MsgAttachment parse(String var1);
}

