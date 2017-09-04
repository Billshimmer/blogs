package com.lightappbuilder.lab4.lablibrary.utils;

import android.os.SystemClock;
import android.util.Log;

import java.util.Formatter;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Log工具
 */
public class L {

    private static final String DEF_TAG = "L";

    private static boolean allowV = true;
    private static boolean allowD = true;
    private static boolean allowI = true;
    private static boolean allowW = true;
    private static boolean allowE = true;

    private static int sMinimumLoggingLevel = Log.VERBOSE;

    private L() {
    }

    /**
     * 设置最低的Log等级,大于等于此等级的可以输出
     * @param level {@link Log#VERBOSE}, {@link Log#DEBUG}, {@link Log#INFO}, {@link Log#WARN}, {@link Log#ERROR}
     */
    public static void setMinimumLoggingLevel(int level) {
        if(level < Log.VERBOSE) {
            level = Log.VERBOSE;
        }
        allowV = allowD = allowI = allowW = allowE = false;
        switch(level) {
        case Log.VERBOSE:
            allowV = true;
        case Log.DEBUG:
            allowD = true;
        case Log.INFO:
            allowI = true;
        case Log.WARN:
            allowW = true;
        case Log.ERROR:
            allowE = true;
        }
        sMinimumLoggingLevel = level;
    }

    /**
     * 设置所有Log等级的开启与关闭
     * @param loggable 是否开启
     */
    public static void setAllLevelLoggable(boolean loggable) {
        allowV = allowD = allowI = allowW = allowE = loggable;
        sMinimumLoggingLevel = loggable ? Log.VERBOSE : Integer.MAX_VALUE;
    }

    public static boolean isLoggable(int level) {
        return level >= sMinimumLoggingLevel;
    }

    // VERBOSE

    public static void v(String msg) {
        if(allowV) {
            log(Log.VERBOSE, null, null, false, msg);
        }
    }

    public static void v(String TAG, String msg) {
        if(allowV) {
            log(Log.VERBOSE, TAG, null, false, msg);
        }
    }

    public static void v(String TAG, String msg, Object arg1) {
        if(allowV) {
            log(Log.VERBOSE, TAG, null, false, msg, arg1);
        }
    }

    public static void v(String TAG, String msg, Object arg1, Object arg2) {
        if(allowV) {
            log(Log.VERBOSE, TAG, null, false, msg, arg1, arg2);
        }
    }

    public static void v(String TAG, String msg, Object arg1, Object arg2, Object arg3) {
        if(allowV) {
            log(Log.VERBOSE, TAG, null, false, msg, arg1, arg2, arg3);
        }
    }

    public static void v(String TAG, String msg, Object... args) {
        if(allowV) {
            log(Log.VERBOSE, TAG, null, false, msg, args);
        }
    }

    public static void v(String TAG, Throwable tr, String msg, Object... args) {
        if(allowV) {
            log(Log.VERBOSE, TAG, tr, false, msg, args);
        }
    }

    public static void v(Object TAG_OBJ, String msg, Object... args) {
        if(allowV) {
            log(Log.VERBOSE, TAG_OBJ, null, false, msg, args);
        }
    }

    /**
     * @param TAG_OBJ 如果为String 则以该String为TAG,否则以TAG_OBJ.getClass().getSimpleName()为TAG
     * @param tr 异常
     * @param msg 消息
     * @param args 参数 直接与msg拼接
     */
    public static void v(Object TAG_OBJ, Throwable tr, String msg, Object... args) {
        if(allowV) {
            log(Log.VERBOSE, TAG_OBJ, tr, false, msg, args);
        }
    }

    public static void fv(String TAG, String format, Object arg1) {
        if(allowV) {
            log(Log.VERBOSE, TAG, null, true, format, arg1);
        }
    }

    public static void fv(String TAG, String format, Object arg1, Object arg2) {
        if(allowV) {
            log(Log.VERBOSE, TAG, null, true, format, arg1, arg2);
        }
    }

    public static void fv(String TAG, String format, Object arg1, Object arg2, Object arg3) {
        if(allowV) {
            log(Log.VERBOSE, TAG, null, true, format, arg1, arg2, arg3);
        }
    }

    public static void fv(String TAG, String format, Object... args) {
        if(allowV) {
            log(Log.VERBOSE, TAG, null, true, format, args);
        }
    }

    public static void fv(String TAG, Throwable tr, String format, Object... args) {
        if(allowV) {
            log(Log.VERBOSE, TAG, null, true, format, args);
        }
    }

    public static void fv(Object TAG_OBJ, String format, Object... args) {
        if(allowV) {
            log(Log.VERBOSE, TAG_OBJ, null, true, format, args);
        }
    }

    /**
     * @param TAG_OBJ 如果为String 则以该String为TAG,否则以TAG_OBJ.getClass().getSimpleName()为TAG
     * @param tr 异常
     * @param format 格式化字符串
     * @param args 参数 按format格式化
     */
    public static void fv(Object TAG_OBJ, Throwable tr, String format, Object... args) {
        if(allowV) {
            log(Log.VERBOSE, TAG_OBJ, tr, true, format, args);
        }
    }

    // DEBUG

    public static void d(String msg) {
        if(allowD) {
            log(Log.DEBUG, null, null, false, msg);
        }
    }

    public static void d(String TAG, String msg) {
        if(allowD) {
            log(Log.DEBUG, TAG, null, false, msg);
        }
    }

    public static void d(String TAG, String msg, Object arg1) {
        if(allowD) {
            log(Log.DEBUG, TAG, null, false, msg, arg1);
        }
    }

    public static void d(String TAG, String msg, Object arg1, Object arg2) {
        if(allowD) {
            log(Log.DEBUG, TAG, null, false, msg, arg1, arg2);
        }
    }

    public static void d(String TAG, String msg, Object arg1, Object arg2, Object arg3) {
        if(allowD) {
            log(Log.DEBUG, TAG, null, false, msg, arg1, arg2, arg3);
        }
    }

    public static void d(String TAG, String msg, Object... args) {
        if(allowD) {
            log(Log.DEBUG, TAG, null, false, msg, args);
        }
    }

    public static void d(String TAG, Throwable tr, String msg, Object... args) {
        if(allowD) {
            log(Log.DEBUG, TAG, tr, false, msg, args);
        }
    }

    public static void d(Object TAG_OBJ, String msg, Object... args) {
        if(allowD) {
            log(Log.DEBUG, TAG_OBJ, null, false, msg, args);
        }
    }

    /**
     * @param TAG_OBJ 如果为String 则以该String为TAG,否则以TAG_OBJ.getClass().getSimpleName()为TAG
     * @param tr 异常
     * @param msg 消息
     * @param args 参数 直接与msg拼接
     */
    public static void d(Object TAG_OBJ, Throwable tr, String msg, Object... args) {
        if(allowD) {
            log(Log.DEBUG, TAG_OBJ, tr, false, msg, args);
        }
    }

    public static void fd(String TAG, String format, Object arg1) {
        if(allowD) {
            log(Log.DEBUG, TAG, null, true, format, arg1);
        }
    }

    public static void fd(String TAG, String format, Object arg1, Object arg2) {
        if(allowD) {
            log(Log.DEBUG, TAG, null, true, format, arg1, arg2);
        }
    }

    public static void fd(String TAG, String format, Object arg1, Object arg2, Object arg3) {
        if(allowD) {
            log(Log.DEBUG, TAG, null, true, format, arg1, arg2, arg3);
        }
    }

    public static void fd(String TAG, String format, Object... args) {
        if(allowD) {
            log(Log.DEBUG, TAG, null, true, format, args);
        }
    }

    public static void fd(String TAG, Throwable tr, String format, Object... args) {
        if(allowD) {
            log(Log.DEBUG, TAG, null, true, format, args);
        }
    }

    public static void fd(Object TAG_OBJ, String format, Object... args) {
        if(allowD) {
            log(Log.DEBUG, TAG_OBJ, null, true, format, args);
        }
    }

    /**
     * @param TAG_OBJ 如果为String 则以该String为TAG,否则以TAG_OBJ.getClass().getSimpleName()为TAG
     * @param tr 异常
     * @param format 格式化字符串
     * @param args 参数 按format格式化
     */
    public static void fd(Object TAG_OBJ, Throwable tr, String format, Object... args) {
        if(allowD) {
            log(Log.DEBUG, TAG_OBJ, tr, true, format, args);
        }
    }

    // INFO

    public static void i(String msg) {
        if(allowI) {
            log(Log.INFO, null, null, false, msg);
        }
    }

    public static void i(String TAG, String msg) {
        if(allowI) {
            log(Log.INFO, TAG, null, false, msg);
        }
    }

    public static void i(String TAG, String msg, Object arg1) {
        if(allowI) {
            log(Log.INFO, TAG, null, false, msg, arg1);
        }
    }

    public static void i(String TAG, String msg, Object arg1, Object arg2) {
        if(allowI) {
            log(Log.INFO, TAG, null, false, msg, arg1, arg2);
        }
    }

    public static void i(String TAG, String msg, Object arg1, Object arg2, Object arg3) {
        if(allowI) {
            log(Log.INFO, TAG, null, false, msg, arg1, arg2, arg3);
        }
    }

    public static void i(String TAG, String msg, Object... args) {
        if(allowI) {
            log(Log.INFO, TAG, null, false, msg, args);
        }
    }

    public static void i(String TAG, Throwable tr, String msg, Object... args) {
        if(allowI) {
            log(Log.INFO, TAG, tr, false, msg, args);
        }
    }

    public static void i(Object TAG_OBJ, String msg, Object... args) {
        if(allowI) {
            log(Log.INFO, TAG_OBJ, null, false, msg, args);
        }
    }

    /**
     * @param TAG_OBJ 如果为String 则以该String为TAG,否则以TAG_OBJ.getClass().getSimpleName()为TAG
     * @param tr 异常
     * @param msg 消息
     * @param args 参数 直接与msg拼接
     */
    public static void i(Object TAG_OBJ, Throwable tr, String msg, Object... args) {
        if(allowI) {
            log(Log.INFO, TAG_OBJ, tr, false, msg, args);
        }
    }

    public static void fi(String TAG, String format, Object arg1) {
        if(allowI) {
            log(Log.INFO, TAG, null, true, format, arg1);
        }
    }

    public static void fi(String TAG, String format, Object arg1, Object arg2) {
        if(allowI) {
            log(Log.INFO, TAG, null, true, format, arg1, arg2);
        }
    }

    public static void fi(String TAG, String format, Object arg1, Object arg2, Object arg3) {
        if(allowI) {
            log(Log.INFO, TAG, null, true, format, arg1, arg2, arg3);
        }
    }

    public static void fi(String TAG, String format, Object... args) {
        if(allowI) {
            log(Log.INFO, TAG, null, true, format, args);
        }
    }

    public static void fi(String TAG, Throwable tr, String format, Object... args) {
        if(allowI) {
            log(Log.INFO, TAG, null, true, format, args);
        }
    }

    public static void fi(Object TAG_OBJ, String format, Object... args) {
        if(allowI) {
            log(Log.INFO, TAG_OBJ, null, true, format, args);
        }
    }

    /**
     * @param TAG_OBJ 如果为String 则以该String为TAG,否则以TAG_OBJ.getClass().getSimpleName()为TAG
     * @param tr 异常
     * @param format 格式化字符串
     * @param args 参数 按format格式化
     */
    public static void fi(Object TAG_OBJ, Throwable tr, String format, Object... args) {
        if(allowI) {
            log(Log.INFO, TAG_OBJ, tr, true, format, args);
        }
    }

    // WARN

    public static void w(String msg) {
        if(allowW) {
            log(Log.WARN, null, null, false, msg);
        }
    }

    public static void w(String TAG, String msg) {
        if(allowW) {
            log(Log.WARN, TAG, null, false, msg);
        }
    }

    public static void w(String TAG, String msg, Object arg1) {
        if(allowW) {
            log(Log.WARN, TAG, null, false, msg, arg1);
        }
    }

    public static void w(String TAG, String msg, Object arg1, Object arg2) {
        if(allowW) {
            log(Log.WARN, TAG, null, false, msg, arg1, arg2);
        }
    }

    public static void w(String TAG, String msg, Object arg1, Object arg2, Object arg3) {
        if(allowW) {
            log(Log.WARN, TAG, null, false, msg, arg1, arg2, arg3);
        }
    }

    public static void w(String TAG, String msg, Object... args) {
        if(allowW) {
            log(Log.WARN, TAG, null, false, msg, args);
        }
    }

    public static void w(String TAG, Throwable tr, String msg, Object... args) {
        if(allowW) {
            log(Log.WARN, TAG, tr, false, msg, args);
        }
    }

    public static void w(Object TAG_OBJ, String msg, Object... args) {
        if(allowW) {
            log(Log.WARN, TAG_OBJ, null, false, msg, args);
        }
    }

    /**
     * @param TAG_OBJ 如果为String 则以该String为TAG,否则以TAG_OBJ.getClass().getSimpleName()为TAG
     * @param tr 异常
     * @param msg 消息
     * @param args 参数 直接与msg拼接
     */
    public static void w(Object TAG_OBJ, Throwable tr, String msg, Object... args) {
        if(allowW) {
            log(Log.WARN, TAG_OBJ, tr, false, msg, args);
        }
    }

    public static void fw(String TAG, String format, Object arg1) {
        if(allowW) {
            log(Log.WARN, TAG, null, true, format, arg1);
        }
    }

    public static void fw(String TAG, String format, Object arg1, Object arg2) {
        if(allowW) {
            log(Log.WARN, TAG, null, true, format, arg1, arg2);
        }
    }

    public static void fw(String TAG, String format, Object arg1, Object arg2, Object arg3) {
        if(allowW) {
            log(Log.WARN, TAG, null, true, format, arg1, arg2, arg3);
        }
    }

    public static void fw(String TAG, String format, Object... args) {
        if(allowW) {
            log(Log.WARN, TAG, null, true, format, args);
        }
    }

    public static void fw(String TAG, Throwable tr, String format, Object... args) {
        if(allowW) {
            log(Log.WARN, TAG, null, true, format, args);
        }
    }

    public static void fw(Object TAG_OBJ, String format, Object... args) {
        if(allowW) {
            log(Log.WARN, TAG_OBJ, null, true, format, args);
        }
    }

    /**
     * @param TAG_OBJ 如果为String 则以该String为TAG,否则以TAG_OBJ.getClass().getSimpleName()为TAG
     * @param tr 异常
     * @param format 格式化字符串
     * @param args 参数 按format格式化
     */
    public static void fw(Object TAG_OBJ, Throwable tr, String format, Object... args) {
        if(allowW) {
            log(Log.WARN, TAG_OBJ, tr, true, format, args);
        }
    }

    // ERROR

    public static void e(String msg) {
        if(allowE) {
            log(Log.ERROR, null, null, false, msg);
        }
    }

    public static void e(String TAG, String msg) {
        if(allowE) {
            log(Log.ERROR, TAG, null, false, msg);
        }
    }

    public static void e(String TAG, String msg, Object arg1) {
        if(allowE) {
            log(Log.ERROR, TAG, null, false, msg, arg1);
        }
    }

    public static void e(String TAG, String msg, Object arg1, Object arg2) {
        if(allowE) {
            log(Log.ERROR, TAG, null, false, msg, arg1, arg2);
        }
    }

    public static void e(String TAG, String msg, Object arg1, Object arg2, Object arg3) {
        if(allowE) {
            log(Log.ERROR, TAG, null, false, msg, arg1, arg2, arg3);
        }
    }

    public static void e(String TAG, String msg, Object... args) {
        if(allowE) {
            log(Log.ERROR, TAG, null, false, msg, args);
        }
    }

    public static void e(String TAG, Throwable tr) {
        if(allowE) {
            log(Log.ERROR, TAG, tr, false, null);
        }
    }

    public static void e(String TAG, Throwable tr, String msg, Object arg1) {
        if(allowE) {
            log(Log.ERROR, TAG, tr, false, msg, arg1);
        }
    }

    public static void e(String TAG, Throwable tr, String msg, Object arg1, Object arg2) {
        if(allowE) {
            log(Log.ERROR, TAG, tr, false, msg, arg1, arg2);
        }
    }

    public static void e(String TAG, Throwable tr, String msg, Object arg1, Object arg2, Object arg3) {
        if(allowE) {
            log(Log.ERROR, TAG, tr, false, msg, arg1, arg2, arg3);
        }
    }

    public static void e(String TAG, Throwable tr, String msg, Object... args) {
        if(allowE) {
            log(Log.ERROR, TAG, tr, false, msg, args);
        }
    }

    public static void e(Object TAG_OBJ, String msg, Object... args) {
        if(allowE) {
            log(Log.ERROR, TAG_OBJ, null, false, msg, args);
        }
    }

    /**
     * @param TAG_OBJ 如果为String 则以该String为TAG,否则以TAG_OBJ.getClass().getSimpleName()为TAG
     * @param tr 异常
     * @param msg 消息
     * @param args 参数 直接与msg拼接
     */
    public static void e(Object TAG_OBJ, Throwable tr, String msg, Object... args) {
        if(allowE) {
            log(Log.ERROR, TAG_OBJ, tr, false, msg, args);
        }
    }

    public static void fe(String TAG, String format, Object arg1) {
        if(allowE) {
            log(Log.ERROR, TAG, null, true, format, arg1);
        }
    }

    public static void fe(String TAG, String format, Object arg1, Object arg2) {
        if(allowE) {
            log(Log.ERROR, TAG, null, true, format, arg1, arg2);
        }
    }

    public static void fe(String TAG, String format, Object arg1, Object arg2, Object arg3) {
        if(allowE) {
            log(Log.ERROR, TAG, null, true, format, arg1, arg2, arg3);
        }
    }

    public static void fe(String TAG, String format, Object... args) {
        if(allowE) {
            log(Log.ERROR, TAG, null, true, format, args);
        }
    }

    public static void fe(String TAG, Throwable tr, String msg, Object arg1) {
        if(allowE) {
            log(Log.ERROR, TAG, tr, true, msg, arg1);
        }
    }

    public static void fe(String TAG, Throwable tr, String msg, Object arg1, Object arg2) {
        if(allowE) {
            log(Log.ERROR, TAG, tr, true, msg, arg1, arg2);
        }
    }

    public static void fe(String TAG, Throwable tr, String msg, Object arg1, Object arg2, Object arg3) {
        if(allowE) {
            log(Log.ERROR, TAG, tr, true, msg, arg1, arg2, arg3);
        }
    }

    public static void fe(String TAG, Throwable tr, String format, Object... args) {
        if(allowE) {
            log(Log.ERROR, TAG, null, true, format, args);
        }
    }

    public static void fe(Object TAG_OBJ, String format, Object... args) {
        if(allowE) {
            log(Log.ERROR, TAG_OBJ, null, true, format, args);
        }
    }

    /**
     * @param TAG_OBJ 如果为String 则以该String为TAG,否则以TAG_OBJ.getClass().getSimpleName()为TAG
     * @param tr 异常
     * @param format 格式化字符串
     * @param args 参数 按format格式化
     */
    public static void fe(Object TAG_OBJ, Throwable tr, String format, Object... args) {
        if(allowE) {
            log(Log.ERROR, TAG_OBJ, tr, true, format, args);
        }
    }

    // WTF

    public static void wtf(String msg) {
        if(allowE) {
            log(Log.ERROR, null, null, false, msg);
        }
    }

    public static void wtf(String TAG, String msg) {
        if(allowE) {
            log(Log.ERROR, TAG, null, false, msg);
        }
    }

    public static void wtf(String TAG, String msg, Object arg1) {
        if(allowE) {
            log(Log.ERROR, TAG, null, false, msg, arg1);
        }
    }

    public static void wtf(String TAG, String msg, Object arg1, Object arg2) {
        if(allowE) {
            log(Log.ERROR, TAG, null, false, msg, arg1, arg2);
        }
    }

    public static void wtf(String TAG, String msg, Object arg1, Object arg2, Object arg3) {
        if(allowE) {
            log(Log.ERROR, TAG, null, false, msg, arg1, arg2, arg3);
        }
    }

    public static void wtf(String TAG, String msg, Object... args) {
        if(allowE) {
            log(Log.ERROR, TAG, null, false, msg, args);
        }
    }

    public static void wtf(String TAG, Throwable tr, String msg, Object... args) {
        if(allowE) {
            log(Log.ERROR, TAG, tr, false, msg, args);
        }
    }

    public static void wtf(Object TAG_OBJ, String msg, Object... args) {
        if(allowE) {
            log(Log.ERROR, TAG_OBJ, null, false, msg, args);
        }
    }

    /**
     * @param TAG_OBJ 如果为String 则以该String为TAG,否则以TAG_OBJ.getClass().getSimpleName()为TAG
     * @param tr 异常
     * @param msg 消息
     * @param args 参数 直接与msg拼接
     */
    public static void wtf(Object TAG_OBJ, Throwable tr, String msg, Object... args) {
        if(allowE) {
            log(Log.ERROR, TAG_OBJ, tr, false, msg, args);
        }
    }

    public static void fwtf(String TAG, String format, Object arg1) {
        if(allowE) {
            log(Log.ERROR, TAG, null, true, format, arg1);
        }
    }

    public static void fwtf(String TAG, String format, Object arg1, Object arg2) {
        if(allowE) {
            log(Log.ERROR, TAG, null, true, format, arg1, arg2);
        }
    }

    public static void fwtf(String TAG, String format, Object arg1, Object arg2, Object arg3) {
        if(allowE) {
            log(Log.ERROR, TAG, null, true, format, arg1, arg2, arg3);
        }
    }

    public static void fwtf(String TAG, String format, Object... args) {
        if(allowE) {
            log(Log.ERROR, TAG, null, true, format, args);
        }
    }

    public static void fwtf(String TAG, Throwable tr, String format, Object... args) {
        if(allowE) {
            log(Log.ERROR, TAG, null, true, format, args);
        }
    }

    public static void fwtf(Object TAG_OBJ, String format, Object... args) {
        if(allowE) {
            log(Log.ERROR, TAG_OBJ, null, true, format, args);
        }
    }

    /**
     * @param TAG_OBJ 如果为String 则以该String为TAG,否则以TAG_OBJ.getClass().getSimpleName()为TAG
     * @param tr 异常
     * @param format 格式化字符串
     * @param args 参数 按format格式化
     */
    public static void fwtf(Object TAG_OBJ, Throwable tr, String format, Object... args) {
        if(allowE) {
            log(Log.ERROR, TAG_OBJ, tr, true, format, args);
        }
    }

    /**
     * Log.println输出行
     * @param priority 优先级
     * @param TAG_OBJ 如果为String 则以该String为TAG,否则以TAG_OBJ.getClass().getSimpleName()为TAG
     * @param tr 异常
     * @param format 是否用msg格式化args
     * @param msg 格式化字符串或只是消息 取决于参数format
     * @param args 参数
     */
    public static void log(int priority, Object TAG_OBJ, Throwable tr, boolean format, String msg, Object... args) {
        String TAG;
        if(TAG_OBJ instanceof String) {
            TAG = (String) TAG_OBJ;
        } else if(TAG_OBJ == null) {
            TAG = DEF_TAG;
        } else {
            TAG = TAG_OBJ.getClass().getSimpleName();
        }

        StringBuilder sb = new StringBuilder(msg == null ? 0 : msg.length() + (args == null ? 0 : args.length * 10));
        if(format && msg != null) {
            new Formatter(sb, null).format(msg, args);
        } else {
            if(msg != null) {
                sb.append(msg);
            }
            if(args != null) {
                for(Object arg : args) {
                    sb.append(String.valueOf(arg)).append(' ');
                }
            }
        }

        if(tr != null) {
            sb.append('\n');
            sb.append(Log.getStackTraceString(tr));
        }

        Log.println(priority, TAG, sb.toString());
    }

    private static ConcurrentHashMap<String, Long> timeMap = new ConcurrentHashMap<>();

    public static void time(String tag) {
        if(allowD) {
            timeMap.put(tag, SystemClock.elapsedRealtime());
        }
    }

    public static void timeEnd(String tag) {
        if(allowD) {
            Long start = timeMap.remove(tag);
            if(start != null) {
                Log.d("TIME-" + tag, (SystemClock.elapsedRealtime() - start) + "ms");
            }
        }
    }

    private static CrashReportHandler sCrashReportHandler;

    public static void setCrashReportHandler(CrashReportHandler handler) {
        sCrashReportHandler = handler;
    }

    /**
     * 上报异常 目前依赖Bugly
     */
    public static void postException(Throwable e) {
        if (sCrashReportHandler != null) {
            sCrashReportHandler.postException(e);
        }
    }

    public interface CrashReportHandler {
        void postException(Throwable e);
    }
}
