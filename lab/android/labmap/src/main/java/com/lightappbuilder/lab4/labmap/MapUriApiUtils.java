package com.lightappbuilder.lab4.labmap;

import android.app.Activity;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.support.v7.app.AlertDialog;

/**
 * Created by yinhf on 16/3/23.
 */
public class MapUriApiUtils {
    private static final String TAG = "MapUriApiUtils";

    private static final String BAIDU_MAP_PACKAGE = "com.baidu.BaiduMap";
    private static final String AMAP_PACKAGE = "com.autonavi.minimap"; //高德地图

    public static final double INVALID_COORD = Double.MIN_VALUE;

    public static boolean isAppInstalled(Context context, String packageName) {
        try {
            return context.getPackageManager().getPackageInfo(packageName, 0) != null;
        } catch (PackageManager.NameNotFoundException ignored) {
        }
        return false;
    }

    /**
     * 打开外部app进行导航,默认坐标为gcj02
     * @param context ctx
     * @param destLng 目标经度
     * @param destLat 目标纬度
     * @return 是否有能导航的app
     */
    public static boolean openNavigation(final Activity context, final double destLng, final double destLat, final String coordType) {
        boolean isBaiduMapInstalled = isAppInstalled(context, BAIDU_MAP_PACKAGE);
        boolean isAMapInstalled = isAppInstalled(context, AMAP_PACKAGE);
        if(!isBaiduMapInstalled && !isAMapInstalled) {
            return false;
        }
        if(isBaiduMapInstalled && isAMapInstalled) {
            new AlertDialog.Builder(context)
                    .setItems(new String[]{"百度地图", "高德地图", "取消"}, new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            switch (which) {
                                case 0:
                                    openBaiduMapNavigation(context, destLng, destLat, null, coordType);
                                    break;
                                case 1:
                                    openAMapNavigation(context, destLng, destLat, coordType);
                                    break;
                                default:
                                    dialog.dismiss();
                                    break;
                            }
                        }
                    })
                    .show();
        } else if(isBaiduMapInstalled) {
            return openBaiduMapNavigation(context, destLng, destLat, null, coordType);
        } else {
            return openAMapNavigation(context, destLng, destLat, coordType);
        }
        return true;
    }

    /**
     * 打开百度地图导航
     * http://lbsyun.baidu.com/index.php?title=uri/api/android
     * @param coordType 坐标类型 bd09、gcj02、wgs84 如果为null 则默认为gcj02
     */
    public static boolean openBaiduMapNavigation(Activity activity, double destLng, double destLat, String destName, String coordType) {
        StringBuilder uriBuilder = new StringBuilder("intent://map/direction?destination=");
        if(destLng == INVALID_COORD) {
            uriBuilder.append(destName);
        } else {
            uriBuilder.append(destLat)
                .append(",")
                .append(destLng);
        }

        uriBuilder.append("&coord_type=")
                .append(coordType == null ? "gcj02" : coordType)
                .append("&mode=driving&src=lightappbuilder#Intent;scheme=bdapp;package=com.baidu.BaiduMap;end");
        try {
            Intent intent = Intent.parseUri(uriBuilder.toString(), 0);
            activity.startActivity(intent);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    /**
     * 打开高德导航
     * http://lbs.amap.com/api/uri-api/android-uri-explain/
     * @param coordType 坐标类型 bd09、gcj02、wgs84 如果为null 则默认为gcj02
     */
    public static boolean openAMapNavigation(Activity activity, double destLng, double destLat, String coordType) {
        boolean dev = false;
        double[] lnglat;
        switch (coordType) {
            case "bd09":
                lnglat = CoordinateTransformUtil.bd09togcj02(destLng, destLat);
                break;
            case "gcj02":
                lnglat = new double[] {destLng, destLat};
                break;
            default:
                lnglat = new double[] {destLng, destLat};
                dev = true;
                break;
        }
        Intent intent = new Intent();
        intent.addCategory("android.intent.category.DEFAULT");
        intent.setPackage("com.autonavi.minimap");
        StringBuilder uriBuilder = new StringBuilder("androidamap://navi?sourceApplication=lightappbuilder&lat=")
                .append(lnglat[1])
                .append("&lon=")
                .append(lnglat[0])
                .append("&dev=")
                .append(dev ? "1" : "0")
                .append("&style=2");
        intent.setData(Uri.parse(uriBuilder.toString()));
        try {
            activity.startActivity(intent);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }
}
