package com.lightappbuilder.lab4.lablibrary.utils;

import java.io.File;
import java.text.DecimalFormat;

/**
 * 文件操作工具类
 */
public class FileUtils {
    private static final String TAG = "FileUtils";

    /**
     * 获取文件的文件名(不包括扩展名)
     */
    public static String getFileNameWithoutExtension(String path) {
        if(path == null) {
            return null;
        }
        int separatorIndex = path.lastIndexOf(File.separator);
        if(separatorIndex < 0) {
            separatorIndex = 0;
        }
        int dotIndex = path.lastIndexOf(".");
        if(dotIndex < 0) {
            dotIndex = path.length();
        } else if(dotIndex < separatorIndex) {
            dotIndex = path.length();
        }
        return path.substring(separatorIndex + 1, dotIndex);
    }

    /**
     * 获取文件名
     */
    public static String getFileName(String path) {
        if(path == null) {
            return null;
        }
        int separatorIndex = path.lastIndexOf(File.separator);
        return (separatorIndex < 0) ? path : path.substring(separatorIndex + 1, path.length());
    }

    /**
     * 获取扩展名
     */
    public static String getExtension(String path) {
        if(path == null) {
            return null;
        }

        int dot = path.lastIndexOf(".");
        if(dot >= 0) {
            return path.substring(dot);
        } else {
            return "";
        }
    }

    /**
     * 获取可读的文件大小
     */
    public static String getReadableFileSize(int size) {
        final int BYTES_IN_KILOBYTES = 1024;
        final DecimalFormat dec = new DecimalFormat("###.#");
        final String KILOBYTES = " KB";
        final String MEGABYTES = " MB";
        final String GIGABYTES = " GB";
        float fileSize = 0;
        String suffix = KILOBYTES;

        if(size > BYTES_IN_KILOBYTES) {
            fileSize = size / BYTES_IN_KILOBYTES;
            if(fileSize > BYTES_IN_KILOBYTES) {
                fileSize = fileSize / BYTES_IN_KILOBYTES;
                if(fileSize > BYTES_IN_KILOBYTES) {
                    fileSize = fileSize / BYTES_IN_KILOBYTES;
                    suffix = GIGABYTES;
                } else {
                    suffix = MEGABYTES;
                }
            }
        }
        return String.valueOf(dec.format(fileSize) + suffix);
    }
}
