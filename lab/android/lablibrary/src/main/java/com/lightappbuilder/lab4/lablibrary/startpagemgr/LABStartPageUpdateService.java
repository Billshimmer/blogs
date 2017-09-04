package com.lightappbuilder.lab4.lablibrary.startpagemgr;

import android.app.IntentService;
import android.content.Context;
import android.content.Intent;
import android.util.DisplayMetrics;
import android.util.Log;

import com.facebook.react.modules.network.OkHttpClientProvider;
import com.lightappbuilder.lab4.lablibrary.utils.DisplayUtils;
import com.lightappbuilder.lab4.lablibrary.utils.L;

import org.apache.commons.io.FileUtils;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;

import okhttp3.Request;
import okhttp3.Response;

/**
 * 启动页更新服务
 * Created by yinhf on 16/1/8.
 */
public class LABStartPageUpdateService extends IntentService {
    private static final String TAG = "StartPageUpdateService";

    private static boolean isRunning;

    public static void startUpdate(Context context, QDPage qdPage, GGPage ggPage, YDPage ydPage) {
        boolean needUpdateQD = qdPage != null && !qdPage.disableUpdate;
        boolean needUpdateGG = ggPage != null && !ggPage.disableUpdate;
        boolean needUpdateYD = ydPage != null && !ydPage.disableUpdate;
        if(!needUpdateQD && !needUpdateGG && !needUpdateYD) {
            return;
        }
        int qdCode = needUpdateQD ? qdPage.code : -1;
        int ggCode = needUpdateGG ? ggPage.code : -1;
        int ydCode = needUpdateYD ? ydPage.code : -1;
        String qdHash = needUpdateQD ? qdPage.hash : null;
        if(isRunning) {
            Log.w(TAG, "startUpdate: isRunning");
            return;
        }
        isRunning = true;
        Intent intent = new Intent(context, LABStartPageUpdateService.class);
        intent.putExtra("qdCode", qdCode);
        intent.putExtra("qdHash", qdHash);
        intent.putExtra("ydCode", ydCode);
        context.startService(intent);
    }

    public LABStartPageUpdateService() {
        super(TAG);
    }

    private String buildUrl(int qdCode, int ggCode, int ydCode) {
        return StartPageManager.checkUpdateUrl;
    }

    @Override
    protected void onHandleIntent(Intent intent) {
        int qdCode = intent.getIntExtra("qdCode", -1);
        String qdHash = intent.getStringExtra("qdHash");
        int ggCode = intent.getIntExtra("ggCode", -1);
        int ydCode = intent.getIntExtra("ydCode", -1);

        String url = buildUrl(qdCode, ggCode, ydCode);

        Request request = new Request.Builder().url(url).build();
        try {
            Response response = OkHttpClientProvider.getOkHttpClient().newCall(request).execute();
            String responseStr = response.body().string();
            L.i(TAG, "onHandleIntent responseStr=", responseStr);
            JSONObject jsonObject = new JSONObject(responseStr);// TODO: 16/1/8
            if("ok".equalsIgnoreCase(jsonObject.getString("CODE"))) {

                if(qdCode >= 0) {
                    //updateQD(qdCode, jsonObject.optJSONObject("qd"));
                    jsonObject = jsonObject.getJSONObject("DATA");
                    updateQD(qdCode, qdHash, jsonObject);
                }
//                if(ggCode >= 0) {
//                    updateGG(ggCode, jsonObject.optJSONObject("gg"));
//                }
//                if(ydCode >= 0) {
//                    updateYD(ydCode, jsonObject.optJSONObject("yd"));
//                }
            }
        } catch (IOException | JSONException e) {
            e.printStackTrace();
        }
        L.timeEnd("LABStartPageUpdateService update");
        isRunning = false;
    }

    private File getAndCleanDownloadFile(String type) {
        File downloadFile = StartPageManager.getDownloadFile(getApplicationContext(), type);
        if(downloadFile.exists()) {
            L.i(TAG, "cleanDownloadFile: ", downloadFile);
            FileUtils.deleteQuietly(downloadFile);
        }
        downloadFile.mkdirs();
        return downloadFile;
    }

    private void updateQD(int oldQDcode, String oldQDhash, JSONObject json) throws JSONException {
        String imgUrl = json.getString("url");
        String hash = String.valueOf(imgUrl.hashCode());
        if (hash.equals(oldQDhash)) {
            return;
        }
        File downloadDir = getAndCleanDownloadFile(StartPageManager.TYPE_QD);
        try {
            // XXX 加上裁剪参数
            DisplayMetrics dm = DisplayUtils.getDisplayMetrics();
            int width = dm.widthPixels;
            int height = dm.heightPixels;
            if (width > height) {
                width = dm.heightPixels;
                height = dm.widthPixels;
            }
            download(imgUrl + "?imageView2/1/w/" + width + "/h/" + height, new File(downloadDir, "0"));
        } catch (IOException e) {
            e.printStackTrace();
            FileUtils.deleteQuietly(downloadDir);
            return;
        }
        renameDownloadFile(downloadDir, hash + "_" + (oldQDcode + 1));
    }

//    private void updateQD(int oldCode, JSONObject json) throws JSONException {
//        if(json == null) {
//            return;
//        }
//        L.i(TAG, "updateQD oldCode=", oldCode);
//        int code = json.getInt("code");
//        if(code <= oldCode) {
//            L.e(TAG, "updateQD code <= oldCode");
//            return;
//        }
//        String imgUrl = json.getString("img");
//        File downloadDir = getAndCleanDownloadFile(StartPageManager.TYPE_QD);
//        try {
//            download(imgUrl, new File(downloadDir, "0"));
//        } catch (IOException e) {
//            e.printStackTrace();
//            FileUtils.deleteQuietly(downloadDir);
//            return;
//        }
//        renameDownloadFile(downloadDir, code);
//    }
//
//    private void updateGG(int oldCode, JSONObject json) throws JSONException {
//        if(json == null) {
//            return;
//        }
//        L.i(TAG, "updateGG oldCode=", oldCode);
//        int code = json.getInt("code");
//        if(code <= oldCode) {
//            L.e(TAG, "updateGG code <= oldCode");
//            return;
//        }
//        File downloadDir = getAndCleanDownloadFile(StartPageManager.TYPE_GG);
//        try {
//            if(!json.optBoolean("disable", false)) {
//                String imgUrl = json.getString("img");
//                download(imgUrl, new File(downloadDir, "0"));
//            }
//            json.remove("img");
//            FileUtils.writeStringToFile(new File(downloadDir, StartPageManager.CONFIG_FILE_NAME), json.toString());
//        } catch (IOException e) {
//            e.printStackTrace();
//            FileUtils.deleteQuietly(downloadDir);
//            return;
//        }
//        renameDownloadFile(downloadDir, code);
//    }
//
//    private void updateYD(int oldCode, JSONObject json) throws JSONException {
//        if(json == null) {
//            return;
//        }
//        L.i(TAG, "updateYD: oldCode=", oldCode);
//        int code = json.getInt("code");
//        if(code <= oldCode) {
//            L.e(TAG, "updateYD code <= oldCode");
//            return;
//        }
//        JSONArray urlArr = json.getJSONArray("img");
//        if(urlArr.length() == 0) {
//            L.e(TAG, "updateYD urlArr.length() == 0");
//            return;
//        }
//        File downloadDir = getAndCleanDownloadFile(StartPageManager.TYPE_YD);
//        try {
//            for(int i = 0; i < urlArr.length(); ++i) {
//                download(urlArr.getString(i), new File(downloadDir, String.valueOf(i)));
//            }
//            json.remove("img");
//            FileUtils.writeStringToFile(new File(downloadDir, StartPageManager.CONFIG_FILE_NAME), json.toString());
//        } catch (IOException e) {
//            e.printStackTrace();
//            FileUtils.deleteQuietly(downloadDir);
//            return;
//        }
//        renameDownloadFile(downloadDir, code);
//    }

    private void download(String url, File file) throws IOException {
        Request request = new Request.Builder().url(url).build();
        Response response = OkHttpClientProvider.getOkHttpClient().newCall(request).execute();
        L.i(TAG, "download url=", url, " contentLength=", response.body().contentLength());
        FileUtils.copyInputStreamToFile(response.body().byteStream(), file);
    }

    private void renameDownloadFile(File file, String name) {
        try {
            FileUtils.moveDirectory(file, new File(file.getParentFile(), name));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
