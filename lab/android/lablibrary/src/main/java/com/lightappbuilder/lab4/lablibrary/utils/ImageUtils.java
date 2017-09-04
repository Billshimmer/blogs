package com.lightappbuilder.lab4.lablibrary.utils;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Matrix;
import android.media.ExifInterface;
import android.opengl.GLES10;
import android.util.Log;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

/**
 * TODO 参考ThumbnailUtils 进行优化
 */
public class ImageUtils {
    private static final String TAG = "ImageUtils";

    private static final int MAX_BITMAP_DIMENSION;

    static {
        int[] maxTextureSize = new int[1];
        GLES10.glGetIntegerv(GLES10.GL_MAX_TEXTURE_SIZE, maxTextureSize, 0);
        Log.d(TAG, "static initializer: GLES10 GL_MAX_TEXTURE_SIZE=" + maxTextureSize[0]);
        MAX_BITMAP_DIMENSION = Math.max(maxTextureSize[0], 1024);
    }

    /**
     * 获取图片的exif的旋转角度
     */
    public static int exifRotateAngle(String path) {
        int angle = 0;
        try {
            ExifInterface exifInterface = new ExifInterface(path);
            int orientation = exifInterface.getAttributeInt(ExifInterface.TAG_ORIENTATION, ExifInterface.ORIENTATION_NORMAL);
            switch (orientation) {
                case ExifInterface.ORIENTATION_ROTATE_90:
                    angle = 90;
                    break;
                case ExifInterface.ORIENTATION_ROTATE_180:
                    angle = 180;
                    break;
                case ExifInterface.ORIENTATION_ROTATE_270:
                    angle = 270;
                    break;
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return angle;
    }

    /**
     * 计算decode时缩小比例,不使图片变形(防止图片太大内存溢出)
     */
    public static int calcInSampleSize(BitmapFactory.Options options, int maxWidth, int maxHeight) {
        double outWidth = options.outWidth;
        double outHeight = options.outHeight;
        //Log.d(TAG, "calcInSampleSize outHeight="+outHeight+" outWidth="+outWidth);
        double ratio = 1;
        if (maxWidth > 0 && maxHeight <= 0) {
            ratio = Math.ceil(outWidth / maxWidth);
        } else if (maxHeight > 0 && maxWidth <= 0) {
            ratio = Math.ceil(outHeight / maxHeight);
        } else if (maxWidth > 0 && maxHeight > 0) {
            double widthRatio = Math.ceil(outWidth / maxWidth);
            double heightRatio = Math.ceil(outHeight / maxHeight);
            //Log.d(TAG, "calcInSampleSize widthRatio="+widthRatio+" heightRatio="+heightRatio);
            ratio = widthRatio > heightRatio ? widthRatio : heightRatio;
        }
        //Log.d(TAG, "calcInSampleSize ratio="+ratio);
        return (int) (ratio > 1 ? ratio : 1);
    }

    /**
     * 根据路径获得指定最大宽高的Bitmap
     */
    public static Bitmap getSmallBitmap(String filePath, int maxWidth, int maxHeight) {
        final BitmapFactory.Options options = new BitmapFactory.Options();
        options.inJustDecodeBounds = true;
        BitmapFactory.decodeFile(filePath, options);

        options.inSampleSize = calcInSampleSize(options, maxWidth, maxHeight);
        options.inJustDecodeBounds = false;
        return BitmapFactory.decodeFile(filePath, options);
    }

    /**
     * 获取不超出当前手机能渲染文理最大宽高的Bitmap
     */
    public static Bitmap getSmallBitmap(String filePath) {
        return getSmallBitmap(filePath, MAX_BITMAP_DIMENSION, MAX_BITMAP_DIMENSION);
    }

    public static boolean compressImage(Bitmap bitmap, File outFile) {
        if (bitmap == null) {
            return false;
        }
        FileOutputStream out = null;
        try {
            out = new FileOutputStream(outFile);
            bitmap.compress(Bitmap.CompressFormat.JPEG, 95,
                    out);
            return true;
        } catch (FileNotFoundException e) {
            Log.e(TAG, "compressImage FileNotFoundException", e);
        } finally {
            if(out != null) {
                try {
                    out.close();
                } catch (IOException ignored) {
                }
            }
        }
        return false;
    }

    /**
     * 裁剪图片
     * @param bitmap 原始图片
     * @param x 起点x
     * @param y 起点y
     * @param cropWidth 裁剪区域width
     * @param cropHeight 裁剪区域height
     * @param degree 旋转角度
     * @param outWidth 输出宽度
     * @param outHeight 输出高度
     */
    public static Bitmap cropBitmap(Bitmap bitmap, int x, int y, int cropWidth, int cropHeight, float degree, int outWidth, int outHeight) {
        //规范旋转角度
        degree %= 360f;
        if(degree < 0) {
            degree += 360f;
        }
        if (degree >= 315f || degree < 45f) {
            degree = 0;
        } else if (degree >= 45f && degree < 135f) {
            degree = 90f;
        } else if (degree >= 135f && degree < 225f) {
            degree = 180f;
        } else if (degree >= 225f && degree < 315f) {
            degree = 270f;
        }
        //防止裁剪区域超出图片
        int bmWidth = bitmap.getWidth();
        int bmHeight = bitmap.getHeight();
        cropWidth = Math.min(cropWidth, bmWidth);
        cropHeight = Math.min(cropHeight, bmHeight);
        int xBound = bmWidth - cropWidth;
        int yBound = bmHeight - cropHeight;
        if(x < 0) {
            x = 0;
        } else if(x > xBound) {
            x = xBound;
        }
        if(y < 0) {
            y = 0;
        } else if(y > yBound) {
            y = yBound;
        }
        //裁剪缩放图片
        Matrix matrix = new Matrix();
        matrix.postRotate(degree);
        matrix.postScale((float) outWidth / cropWidth, (float)outHeight / cropHeight);
        return Bitmap.createBitmap(bitmap, x, y, cropWidth, cropHeight, matrix, true);
    }
}
