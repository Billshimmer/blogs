package com.lightappbuilder.lab4.lablibrary.startpagemgr;

import org.apache.commons.io.FileUtils;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;

/**
 * Created by yinhf on 16/1/8.
 */
public abstract class BasePage {

    public int code = -1;
    public boolean disableUpdate = true;
    public String hash;

    public BasePage() {

    }

    protected BasePage(File packageFile) throws NumberFormatException {
        String name = packageFile.getName();
        int temp = name.indexOf('_');
        if (temp > 0) {
            hash = name.substring(0, temp);
            temp++;
        } else {
            temp = 0;
        }
        code = Integer.parseInt(name.substring(temp));
    }

    protected JSONObject loadConfigFile(File packageFile) throws IOException, JSONException {
        File configFile = new File(packageFile, StartPageManager.CONFIG_FILE_NAME);
        String str = FileUtils.readFileToString(configFile);
        return new JSONObject(str);
    }
}
