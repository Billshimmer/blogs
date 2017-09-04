package com.lightappbuilder.lab4.labmap;

import android.Manifest;
import android.app.Activity;
import android.support.annotation.NonNull;
import com.baidu.location.BDLocation;
import com.baidu.location.BDLocationListener;
import com.baidu.location.LocationClient;
import com.baidu.location.LocationClientOption;
import com.lightappbuilder.lab4.lablibrary.utils.AppContextUtils;
import com.lightappbuilder.lab4.lablibrary.utils.UiThreadHelper;
import com.yanzhenjie.permission.AndPermission;
import com.yanzhenjie.permission.PermissionListener;
import com.yanzhenjie.permission.Rationale;
import com.yanzhenjie.permission.RationaleListener;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Created by yinhf on 2015/11/5.
 */
public class LocationClientManager {
    private static final String TAG = "LocationClientManager";

    private static volatile LocationClientManager instance;
    private static final int REQUEST_LOCATION_TIMEOUT = 30000; //30s
    private static final int REQUEST_CODE_PERMISSION_LOCATION_METHOD_START=0x1000021;
    private static final int REQUEST_CODE_PERMISSION_SETTINGS=0x1000000;
    private boolean hasPermission=false;

    public static LocationClientManager getInstance() {
        if(instance == null) {
            synchronized(LocationClientManager.class) {
                if(instance == null) {
                    instance = new LocationClientManager();
                }
            }
        }
        if (instance.locClient == null) {
            instance.init();
        }
        return instance;
    }

    private LocationClient locClient;
    private AtomicInteger startCount = new AtomicInteger();

    private LocationClientManager() {}

    private void init() {
        try {
            UiThreadHelper.runOnUiThreadFuture(new Callable<Void>() {
                @Override
                public Void call() {
                    if (locClient == null) {
                        locClient = new LocationClient(AppContextUtils.get());
                        LocationClientOption option = new LocationClientOption();
                        option.setLocationMode(LocationClientOption.LocationMode.Hight_Accuracy);
                        option.setOpenGps(true);
                        option.setIsNeedAddress(true);
                        option.setCoorType("bd09ll");
                        option.setScanSpan(5000);
                        locClient.setLocOption(option);
                    }
                    return null;
                }

            }).get();
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    public void start(final Activity activity) {

        if (hasPermission){
            locClient.start();
            startCount.incrementAndGet();
        }else {
            PermissionListener startpermissionListener = new PermissionListener() {
                @Override
                public void onSucceed(int requestCode, @NonNull List<String> grantPermissions) {
                    switch (requestCode) {
                        case REQUEST_CODE_PERMISSION_LOCATION_METHOD_START:
                            hasPermission = true;
                            locClient.start();
                            startCount.incrementAndGet();
                            break;
                    }
                }
                @Override
                public void onFailed(int requestCode, @NonNull List<String> deniedPermissions) {
                    switch (requestCode) {
                        default:
                            hasPermission = false;
                            // 用户否勾选了不再提示并且拒绝了权限，那么提示用户到设置中授权。
                            if (AndPermission.hasAlwaysDeniedPermission(activity, deniedPermissions)) {
                                // 第一种：用默认的提示语。
                                AndPermission.defaultSettingDialog(activity, REQUEST_CODE_PERMISSION_SETTINGS).show();
                            }
                            break;
                    }
                }
            };
            AndPermission.with(activity)
                .requestCode(REQUEST_CODE_PERMISSION_LOCATION_METHOD_START)
                .permission(Manifest.permission.ACCESS_COARSE_LOCATION,Manifest.permission.ACCESS_FINE_LOCATION)
                .callback(startpermissionListener)
                .rationale(new RationaleListener() {
                    @Override
                    public void showRequestPermissionRationale(int requestCode, Rationale rationale) {
                        AndPermission.rationaleDialog(activity, rationale).show();
                    }
                })
                .start();
        }

    }

    public void stop() {
        if(startCount.decrementAndGet() <= 0) {
            locClient.stop();
            startCount.set(0);
        }
    }

    public LocationClient getLocationClient() {
        return locClient;
    }

    private static long getLocationTime(BDLocation location) {
        if(location.getTime() == null) {
            return 0;
        }
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        try {
            return sdf.parse(location.getTime()).getTime();
        } catch(ParseException e) {
            e.printStackTrace();
        }
        return 0;
    }

    /**
     * 获取有效的定位信息
     * @param validTime 有效时间 单位毫秒
     */
    public BDLocation getValidLastKnownLocation(long validTime) {
        BDLocation location = locClient.getLastKnownLocation();
        if(!isValidLocation(location)) {
            return null;
        }
        if(validTime > 0 && System.currentTimeMillis() - getLocationTime(location) < validTime) {
            return location;
        }
        return null;
    }

    public static boolean isValidLocation(BDLocation location) {
        if(location == null) {
            return false;
        }
        int type = location.getLocType();
        return type == BDLocation.TypeGpsLocation
                || type == BDLocation.TypeNetWorkLocation
                || type == BDLocation.TypeOffLineLocation
                || type == BDLocation.TypeCacheLocation;
    }

    public static String bdLocationToString(BDLocation location) {
        if(location == null) {
            return "NULL";
        }
        StringBuilder sb = new StringBuilder(256);
        sb.append("time : ");
        sb.append(location.getTime());
        sb.append("\nlatitude : ");
        sb.append(location.getLatitude());
        sb.append("\nlontitude : ");
        sb.append(location.getLongitude());
        sb.append("\nradius : ");
        sb.append(location.getRadius());
        sb.append("\nloc type : ");
        sb.append(location.getLocType());
        if (location.getLocType() == BDLocation.TypeGpsLocation){// GPS定位结果
            sb.append(" | TypeGpsLocation");
            sb.append("\nspeed : ");
            sb.append(location.getSpeed());// 单位：公里每小时
            sb.append("\nsatellite : ");
            sb.append(location.getSatelliteNumber());
            sb.append("\nheight : ");
            sb.append(location.getAltitude());// 单位：米
            sb.append("\ndirection : ");
            sb.append(location.getDirection());
            sb.append("\naddr : ");
            sb.append(location.getAddrStr());
            sb.append("\ndescribe : ");
            sb.append("gps定位成功");
        } else if (location.getLocType() == BDLocation.TypeNetWorkLocation){// 网络定位结果
            sb.append(" | TypeNetWorkLocation");
            sb.append("\naddr : ");
            sb.append(location.getAddrStr());
            //运营商信息
            sb.append("\noperationers : ");
            sb.append(location.getOperators());
            sb.append("\ndescribe : ");
            sb.append("网络定位成功");
        } else if (location.getLocType() == BDLocation.TypeOffLineLocation) {// 离线定位结果
            sb.append(" | TypeOffLineLocation");
            sb.append("\ndescribe : ");
            sb.append("离线定位成功，离线定位结果也是有效的");
        } else if (location.getLocType() == BDLocation.TypeServerError) {
            sb.append(" | TypeServerError");
            sb.append("\ndescribe : ");
            sb.append("服务端网络定位失败，可以反馈IMEI号和大体定位时间到loc-bugs@baidu.com，会有人追查原因");
        } else if (location.getLocType() == BDLocation.TypeNetWorkException) {
            sb.append(" | TypeNetWorkException");
            sb.append("\ndescribe : ");
            sb.append("网络不同导致定位失败，请检查网络是否通畅");
        } else if (location.getLocType() == BDLocation.TypeCriteriaException) {
            sb.append(" | TypeCriteriaException");
            sb.append("\ndescribe : ");
            sb.append("无法获取有效定位依据导致定位失败，一般是由于手机的原因，处于飞行模式下一般会造成这种结果，可以试着重启手机");
        }
        sb.append("\nlocationdescribe : ");// 位置语义化信息
        sb.append(location.getLocationDescribe());
        return sb.toString();
    }

    /**
     * 请求单次定位
     */
    public void requestLocation(LocationCallback callback,Activity activity) {
        if (activity==null){
            return;
        }
        new SingleLocationTask(callback).request(activity);
    }

    private class SingleLocationTask implements BDLocationListener, Runnable {

        SingleLocationTask(LocationCallback callback) {
            this.callback = callback;
        }

        private LocationCallback callback;

        void request(Activity activity) {
            start(activity);
            locClient.registerLocationListener(this);
            locClient.requestLocation();
            if(callback != null) {
                UiThreadHelper.postDelayedOnUiThread(this, REQUEST_LOCATION_TIMEOUT);
            }
        }

        @Override
        public void onReceiveLocation(BDLocation bdLocation) {
            stop();
            locClient.unRegisterLocationListener(this);
            UiThreadHelper.removeUiHandlerCallbacks(this);
            callback.onReceiveLocation(bdLocation, false);
            callback = null;
        }

        @Override
        public void run() {
            if(callback == null) {
                return;
            }
            stop();
            locClient.unRegisterLocationListener(this);
            callback.onReceiveLocation(null, true);
        }
    }

    public interface LocationCallback {
        void onReceiveLocation(BDLocation bdLocation, boolean isTimeout);
    }
}
