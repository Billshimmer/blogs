package com.lightappbuilder.lab4.labmap;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.os.Build;
import android.view.View;

import com.baidu.mapapi.map.BitmapDescriptor;
import com.baidu.mapapi.map.BitmapDescriptorFactory;
import com.baidu.mapapi.map.MarkerOptions;

import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;

/**
 * Created by yinhf on 2016/12/27.
 */
public class ViewMarkerOptionsHelper {
    private final Canvas canvas = new Canvas();
    private Bitmap bitmap;
    private Bitmap mockBitmap = Bitmap.createBitmap(1, 1, Bitmap.Config.ARGB_8888);

    private static Constructor<BitmapDescriptor> constructor_BitmapDescriptor;
    private static Field field_a;
    private static Method method_b;
    static {
        try {
            constructor_BitmapDescriptor = BitmapDescriptor.class.getDeclaredConstructor(Bitmap.class);
            constructor_BitmapDescriptor.setAccessible(true);
            field_a = BitmapDescriptor.class.getDeclaredField("a");
            field_a.setAccessible(true);
            method_b = BitmapDescriptor.class.getDeclaredMethod("b");
            method_b.setAccessible(true);
        } catch (Exception e) {
            e.printStackTrace();
            constructor_BitmapDescriptor = null;
            field_a = null;
            method_b = null;
        }
    }

    /**
     * 获取view截图的markerOptions
     * NOTE 非线程安全
     */
    public MarkerOptions crateMarkerOptions(View view, int widthMeasureSpec, int heightMeasureSpec) {
        MarkerOptions options = new MarkerOptions();
        options.icon(createBitmapDescriptor(view, widthMeasureSpec, heightMeasureSpec));
        return options;
    }

    /**
     * 获取view截图的 BitmapDescriptor
     * NOTE 非线程安全
     */
    public BitmapDescriptor createBitmapDescriptor(View view, int widthMeasureSpec, int heightMeasureSpec) {
        view.measure(widthMeasureSpec, heightMeasureSpec);
        view.layout(0, 0, view.getMeasuredWidth(), view.getMeasuredHeight());
        int width = view.getWidth();
        int height = view.getHeight();
        return getViewBitmapDescriptor(view, width, height);
    }

    private Bitmap obtainBitmap(int width, int height) {
        if (Build.VERSION.SDK_INT >= 19) {
            if (bitmap == null || width * height * 4 >= bitmap.getAllocationByteCount()) {
                bitmap = Bitmap.createBitmap((int) (width * 1.3), height, Bitmap.Config.ARGB_8888);
            }
            if (bitmap.getWidth() != width || bitmap.getHeight() != height) {
                try {
                    bitmap.reconfigure(width, height, Bitmap.Config.ARGB_8888);
                    bitmap.eraseColor(0);
                    return bitmap;
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
        return Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
    }

    /**
     * 获取View 的BitmapDescriptor
     * NOTE 非线程安全!!
     */
    public BitmapDescriptor getViewBitmapDescriptor(View view, int width, int height) {
        Bitmap bm = obtainBitmap(width, height);
        //if(LABMap.DEBUG) Log.d(TAG, "getViewBitmapDescriptor width=" + width + " height=" + height + "Bitmap ByteCount" + bm.getByteCount());
        canvas.setBitmap(bm);
        view.draw(canvas);
        canvas.setBitmap(null);
        if (field_a != null) {
            // NOTE 通过反射的方式优化BitmapDescriptor 的创建，对百度地图4.1.1有效
            // 不能混淆相关方法，如果百度地图升级也需要跟进修改
            try {
                BitmapDescriptor bitmapDescriptor = constructor_BitmapDescriptor.newInstance(new Object[] {null});
                field_a.set(bitmapDescriptor, bm);
                Object[] x = new Object[0];
                method_b.invoke(bitmapDescriptor, x);
                field_a.set(bitmapDescriptor, mockBitmap);
                return bitmapDescriptor;
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return BitmapDescriptorFactory.fromBitmap(bm);
    }
}
