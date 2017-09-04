package com.lightappbuilder.lab4.lablibrary.startpagemgr;

import android.net.Uri;

import java.io.File;

/**
 * 启动页数据
 * Created by yinhf on 16/1/8.
 */
public class QDPage extends BasePage {

    public Uri imgUri;
    public int imgResId;
    public int placeHolderColor;

    public int minQdDuration = StartPageManager.MIN_LOADING_DURATION;
    public int maxQdDuration = StartPageManager.MAX_LOADING_DURATION;
    public int defQdDuration = 3000;

    public QDPage() {

    }

    public QDPage(File packageFile) throws Exception {
        super(packageFile);
        File imgFile = new File(packageFile, "0");
        if(!imgFile.isFile()) {
            throw new Exception("!imgFile.isFile()");
        }
        imgUri = Uri.fromFile(imgFile);
    }
}
