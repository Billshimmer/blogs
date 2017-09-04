package com.lightappbuilder.lab4.lablibrary.utils;

import android.app.ActivityManager;
import android.content.Context;
import android.text.TextUtils;
import android.util.Log;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class ProcessUtils {

    private static String curProcessName;

    private ProcessUtils() {

    }

    /**
     * 获取进程号对应的进程名
     * <p>
     * 代码来自bugly推荐
     * https://bugly.qq.com/docs/user-guide/instruction-manual-android/?v=20170517185032#_6
     *
     * @param pid 进程号
     * @return 进程名 null 获取失败
     */
    private static String getProcessName(int pid) {
        BufferedReader reader = null;
        try {
            reader = new BufferedReader(new FileReader("/proc/" + pid + "/cmdline"));
            String processName = reader.readLine();
            if (!TextUtils.isEmpty(processName)) {
                processName = processName.trim();
            }
            return processName;
        } catch (Throwable throwable) {
            throwable.printStackTrace();
        } finally {
            try {
                if (reader != null) {
                    reader.close();
                }
            } catch (IOException exception) {
                exception.printStackTrace();
            }
        }
        return null;
    }

    /**
     * 获取当前进程名
     */
    public static String getCurProcessName(Context context) {
        if (curProcessName == null) {
            curProcessName = getProcessName(android.os.Process.myPid());
        }
        return curProcessName;
    }

    /**
     * 判断当前进程是否为默认进程
     * @param context
     * @param fallback 获取processName失败时的返回值
     */
    public static boolean isMainProcess(Context context, boolean fallback) {
        String processName = ProcessUtils.getCurProcessName(context);
        if (processName == null) {
            return fallback;
        }
        return processName.equals(context.getPackageName());
    }

    /**
     * 判断当前进程是否为子进程(android:process=":xxx")
     */
    public static boolean isChildProcess(Context context, String childName) {
        String curProcessName = getCurProcessName(context);
        return curProcessName.endsWith(":" + childName);
    }

    /**
     * Log进程id与进程名
     */
    public static void logProcessInfo(Context context) {
        int pid = android.os.Process.myPid();
        String packageName = context.getPackageName();
        StringBuilder sb = new StringBuilder();
        ActivityManager activityManager = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
        sb.append("进程列表=====================================\n");
        for (ActivityManager.RunningAppProcessInfo appProcess : activityManager.getRunningAppProcesses()) {
            if (appProcess.pid == pid) {
                sb.append("当前进程>>>> ");
            } else if (appProcess.processName.startsWith(packageName + ":")) {
                sb.append("当前包>>>>> ");
            }
            sb.append("Process pid=").append(appProcess.pid).append(" | processName=").append(appProcess.processName).append('\n');
        }
        sb.append("进程列表结束====================================");
        Log.i("logProcessInfo", sb.toString());
    }
}
