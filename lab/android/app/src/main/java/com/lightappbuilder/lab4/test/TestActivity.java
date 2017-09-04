package com.lightappbuilder.lab4.test;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.os.ResultReceiver;
import android.provider.MediaStore;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.InputType;
import android.util.Log;
import android.util.TypedValue;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;
import android.widget.FrameLayout;

import com.facebook.infer.annotation.Assertions;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.ViewDefaults;
import com.facebook.react.views.textinput.ReactEditText;
import com.lightappbuilder.lab4.lablibrary.utils.UiThreadHelper;
import com.umeng.socialize.UMAuthListener;
import com.umeng.socialize.UMShareAPI;
import com.umeng.socialize.bean.SHARE_MEDIA;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.Field;
import java.util.Map;
import java.util.UUID;

public class TestActivity extends AppCompatActivity {
    private static final String TAG = "TestActivity";

    private int editId = 0;
    private InputMethodManager mInputMethodManager;
    TestEditText editText;

    Field immField_mCurRootView;
    Field immField_mServedView;
    Field immField_mNextServedView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Log.i(TAG, "onCreate");

        Log.i(TAG, "onCreate: Build.BOARD=" + Build.BOARD + " Build.MODEL=" + Build.MODEL + " Build.MANUFACTURER=" + Build.MANUFACTURER);

        setContentView(R.layout.activity_test);

        mInputMethodManager = (InputMethodManager)
                Assertions.assertNotNull(getSystemService(Context.INPUT_METHOD_SERVICE));

        try {
            immField_mCurRootView = InputMethodManager.class.getDeclaredField("mCurRootView");
            immField_mCurRootView.setAccessible(true);

            immField_mServedView = InputMethodManager.class.getDeclaredField("mServedView");
            immField_mServedView.setAccessible(true);

            immField_mNextServedView = InputMethodManager.class.getDeclaredField("mNextServedView");
            immField_mNextServedView.setAccessible(true);

            Field field_debug = InputMethodManager.class.getDeclaredField("DEBUG");
            field_debug.setAccessible(true);
            try {
                field_debug.set(null, true);
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            }
        } catch (NoSuchFieldException e) {
            e.printStackTrace();
        }

        ((TestFrameLayout) findViewById(R.id.frame1)).onInterceptTouchEventListener = new TestFrameLayout.onInterceptTouchEventListener() {
            @Override
            public boolean onInterceptTouchEvent(MotionEvent ev) {
                if (ev.getAction() == MotionEvent.ACTION_UP && editText != null) {
                    //editText.requestFocusFromJS();
                    editText.postDelayed(new Runnable() {
                        @Override
                        public void run() {
                            Log.i(TAG, "run: start requestFocusFromJS");
                            editText.requestFocusFromJS();
                            Log.i(TAG, "run: start showSoftKeyboard");
                            showSoftKeyboard(null);
                            Log.i(TAG, "run: end showSoftKeyboard");
                        }
                    }, (long) (Math.random() * 5));
                }
                return false;
            }
        };
    }

    private File createNewFile() {
        String filename = "image-" + UUID.randomUUID().toString() + ".jpg";
        File path = getExternalCacheDir();

        File f = new File(path, filename);
        try {
            path.mkdirs();
            f.createNewFile();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return f;
    }

    private void startCamera() {
        Intent cameraIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);

        // we create a tmp file to save the result
        File imageFile = createNewFile();
        cameraIntent.putExtra(MediaStore.EXTRA_OUTPUT, Uri.fromFile(imageFile));
        startActivityForResult(cameraIntent, 1);
    }

    public void test1(View v) {
        showTextInput();
    }

    public void test2(View v) {
        removeTextInput();
    }

    public void test3(final View v) {
        if (editText == null) {
            return;
        }
        mInputMethodManager.showSoftInput(editText, 0, new ResultReceiver(null) {
            @Override
            protected void onReceiveResult(int resultCode, Bundle resultData) {
                Log.i(TAG, "onReceiveResult: resultCode=" + resultCode + " resultData=" + resultData + " " + Thread.currentThread().getId());
            }
        });
    }

    public void test4(final View v) {
        try {
            Log.i(TAG, "test4: mInputMethodManager isActive=" + mInputMethodManager.isActive() + " isActive(edit)=" + mInputMethodManager.isActive(editText) +
            " immField_mServedView=" + immField_mServedView.get(mInputMethodManager) + " immField_mNextServedView=" + immField_mNextServedView.get(mInputMethodManager) +
            " immField_mCurRootView=" + immField_mCurRootView.get(mInputMethodManager));
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }
    }

    public void test5(View v) {
        UMShareAPI.get(this).doOauthVerify(this, SHARE_MEDIA.QQ, new UMAuthListener() {

            @Override
            public void onStart(SHARE_MEDIA share_media) {

            }

            @Override
            public void onComplete(SHARE_MEDIA share_media, int i, Map<String, String> map) {
                Log.i(TAG, "doOauthVerify onComplete: i:" + i + " data:" + map);
                UiThreadHelper.postDelayedOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        UMShareAPI.get(TestActivity.this).getPlatformInfo(TestActivity.this, SHARE_MEDIA.QQ, new UMAuthListener() {
                            @Override
                            public void onStart(SHARE_MEDIA share_media) {

                            }

                            @Override
                            public void onComplete(SHARE_MEDIA share_media, int i, Map<String, String> map) {
                                Log.i(TAG, "getPlatformInfo onComplete: i:" + i + " data:" + map);
                            }

                            @Override
                            public void onError(SHARE_MEDIA share_media, int i, Throwable throwable) {
                                Log.e(TAG, "onError: i:" + i, throwable);
                            }

                            @Override
                            public void onCancel(SHARE_MEDIA share_media, int i) {
                                Log.i(TAG, "onCancel: i:" + i);
                            }
                        });
                    }
                }, 100);

            }

            @Override
            public void onError(SHARE_MEDIA share_media, int i, Throwable throwable) {
                Log.e(TAG, "onError: i:" + i, throwable);
            }

            @Override
            public void onCancel(SHARE_MEDIA share_media, int i) {
                Log.i(TAG, "onCancel: i:" + i);
            }
        });
    }

    public void test6(View v) {
        UMShareAPI.get(TestActivity.this).getPlatformInfo(TestActivity.this, SHARE_MEDIA.QQ, new UMAuthListener() {

            @Override
            public void onStart(SHARE_MEDIA share_media) {

            }

            @Override
            public void onComplete(SHARE_MEDIA share_media, int i, Map<String, String> map) {
                Log.i(TAG, "getPlatformInfo onComplete: i:" + i + " data:" + map);
            }

            @Override
            public void onError(SHARE_MEDIA share_media, int i, Throwable throwable) {
                Log.e(TAG, "onError: i:" + i, throwable);
            }

            @Override
            public void onCancel(SHARE_MEDIA share_media, int i) {
                Log.i(TAG, "onCancel: i:" + i);
            }
        });
    }

    public void test7(View v) {
        UMShareAPI.get(TestActivity.this).deleteOauth(this, SHARE_MEDIA.QQ, new UMAuthListener() {

            @Override
            public void onStart(SHARE_MEDIA share_media) {

            }

            @Override
            public void onComplete(SHARE_MEDIA share_media, int i, Map<String, String> map) {
                Log.i(TAG, "deleteOauth onComplete: i:" + i + " data:" + map);
            }

            @Override
            public void onError(SHARE_MEDIA share_media, int i, Throwable throwable) {
                Log.e(TAG, "deleteOauth onError: i:" + i, throwable);
            }

            @Override
            public void onCancel(SHARE_MEDIA share_media, int i) {
                Log.i(TAG, "deleteOauth onCancel: i:" + i);
            }
        });
    }

    public void showSoftKeyboard(View v) {
        if (editText != null) {
            mInputMethodManager.showSoftInput(editText, 0);
        }
    }

    public void hideSoftKeyboard(View v) {
        if (editText != null) {
            mInputMethodManager.hideSoftInputFromWindow(editText.getWindowToken(), 0);
        }
    }

    private void removeTextInput() {
        if (editText == null) {
            return;
        }
        editText.clearFocus();
        hideSoftKeyboard(null);
        ((ViewGroup) editText.getParent()).removeAllViews();
        editText = null;
//        editText.postDelayed(new Runnable() {
//            @Override
//            public void run() {
//                ((ViewGroup) editText.getParent()).removeAllViews();
//                editText = null;
//            }
//        }, (long) (Math.random() * 30));
    }

    private void showTextInput() {
        if (editText != null) {
            return;
        }
        editText = new TestEditText(this);
        editText.setId(editId++);
//        int inputType = editText.getInputType();
//        editText.setInputType(inputType & (~InputType.TYPE_TEXT_FLAG_MULTI_LINE));
//        editText.setImeOptions(EditorInfo.IME_ACTION_DONE);
        ((FrameLayout) findViewById(R.id.frame1)).addView(editText, -1, -2);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        Log.d(TAG, "onActivityResult() called with: requestCode = [" + requestCode + "], resultCode = [" + resultCode + "], data = [" + data + "]");
        UMShareAPI.get(this).onActivityResult(requestCode, resultCode, data);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        Log.i(TAG, "onDestroy");
    }
}
