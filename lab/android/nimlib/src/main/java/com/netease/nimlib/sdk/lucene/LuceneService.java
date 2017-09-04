package com.netease.nimlib.sdk.lucene;

import com.netease.nimlib.sdk.InvocationFuture;
import com.netease.nimlib.sdk.msg.constant.SessionTypeEnum;
import com.netease.nimlib.sdk.search.model.MsgIndexRecord;

import java.util.List;

/**
 * Created by dansejijie on 17/4/15.
 */

public interface LuceneService {
    InvocationFuture<List<MsgIndexRecord>> searchAllSession(String var1, int var2);

    List<MsgIndexRecord> searchAllSessionBlock(String var1, int var2);

    InvocationFuture<List<MsgIndexRecord>> searchSession(String var1, SessionTypeEnum var2, String var3);

    List<MsgIndexRecord> searchSessionBlock(String var1, SessionTypeEnum var2, String var3);

    InvocationFuture<List<MsgIndexRecord>> searchSessionPage(String var1, SessionTypeEnum var2, String var3, int var4, int var5);

    List<MsgIndexRecord> searchSessionPageBlock(String var1, SessionTypeEnum var2, String var3, int var4, int var5);

    InvocationFuture<List<MsgIndexRecord>> searchSessionNextPage(String var1, SessionTypeEnum var2, String var3, MsgIndexRecord var4, int var5);

    List<MsgIndexRecord> searchSessionNextPageBlock(String var1, SessionTypeEnum var2, String var3, MsgIndexRecord var4, int var5);

    int searchSessionMatchCount(String var1, SessionTypeEnum var2, String var3);

    int searchSessionPageCount(String var1, SessionTypeEnum var2, String var3, int var4);

    long getCacheSize();

    void clearCache();
}
