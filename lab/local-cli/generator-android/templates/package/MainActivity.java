package <%= package %>;

import android.os.Bundle;
import android.widget.Toast;

import com.lightappbuilder.lab4.lablibrary.LABActivity;

public class MainActivity extends LABActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        //StartPageManager.showStartPage(this);
        if (BuildConfig.DEBUG) {
            if (!ezy.assist.compat.SettingsCompat.canDrawOverlays(this)) {
                Toast.makeText(this, "请开启悬浮窗权限", Toast.LENGTH_SHORT).show();
                ezy.assist.compat.SettingsCompat.manageDrawOverlays(this);
            }
        }
        // 恢复Activity Theme为默认主题 释放启动背景图内存(用于设置主题为LABSplashActivityTheme时)
        //setTheme(R.style.LABActivityTheme);
        super.onCreate(savedInstanceState);
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "app";
    }
}
