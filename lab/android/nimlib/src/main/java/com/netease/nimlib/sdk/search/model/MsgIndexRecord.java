package com.netease.nimlib.sdk.search.model;

/**
 * Created by dansejijie on 17/4/4.
 */


//import com.netease.nimlib.n.h;
import android.util.Log;

import com.netease.nimlib.sdk.msg.constant.SessionTypeEnum;
import com.netease.nimlib.sdk.msg.model.IMMessage;
//import com.netease.nimlib.search.a.a;
//import com.netease.nimlib.search.b.b;
import com.netease.nimlib.search.model.NIMIndexRecord;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class MsgIndexRecord implements Comparable<MsgIndexRecord> {
    private final NIMIndexRecord record;
    private IMMessage message;
    private final String query;
    private List<RecordHitInfo> hitInfo;

    public MsgIndexRecord(NIMIndexRecord var1, String var2) {
        this.record = var1;
        this.query = var2;
    }

    public String getText() {
        return this.record.content;
    }

    public SessionTypeEnum getSessionType() {
        Log.e("TAG","unhandler");
        return SessionTypeEnum.P2P;
        //return a.a(this.record.id);
    }

    public String getSessionId() {
        Log.e("TAG","unhandler");
        return "123";
        //return a.b(this.record.id);
    }

    public long getTime() {
        return this.record.time;
    }

    public int getCount() {
        return this.record.count;
    }

    public String getQuery() {
        return this.query;
    }

    public NIMIndexRecord getRecord() {
        return this.record;
    }

//    public IMMessage getMessage() {
//        if(this.message == null) {
//            this.message = h.a(this.record.dataid);
//        }
//
//        return this.message;
//    }
//
//    public List<RecordHitInfo> getHitInfo() {
//        if(this.hitInfo == null) {
//            b var10000 = com.netease.nimlib.search.b.b.b.a;
//            ArrayList var1;
//            if((var1 = b.a(this.getText(), this.query, false)) == null || var1.isEmpty()) {
//                var10000 = com.netease.nimlib.search.b.b.b.a;
//                var1 = b.a(this.getText(), this.query, true);
//            }
//
//            this.hitInfo = new ArrayList(var1.size());
//            Iterator var3 = var1.iterator();
//
//            while(var3.hasNext()) {
//                com.netease.nimlib.search.b.b.a var2 = (com.netease.nimlib.search.b.b.a)var3.next();
//                this.hitInfo.add(new RecordHitInfo(var2.a, var2.b));
//            }
//        }
//
//        return this.hitInfo;
//    }

//    public List<RecordHitInfo> cloneHitInfo() {
//        this.getHitInfo();
//        ArrayList var1 = new ArrayList(this.hitInfo.size());
//        Iterator var2 = this.hitInfo.iterator();
//
//        while(var2.hasNext()) {
//            RecordHitInfo var3 = (RecordHitInfo)var2.next();
//            var1.add(new RecordHitInfo(var3.start, var3.end));
//        }
//
//        return var1;
//    }

    public int compareTo(MsgIndexRecord var1) {
        return (int)(var1.record.time - this.record.time);
    }

    public String toString() {
        return this.record.toString();
    }
}
