package com.lightappbuilder.lab4.lablibrary.rnviews.webview;

import android.content.Context;
import android.content.DialogInterface;
import android.support.v7.app.AlertDialog;
import android.support.v7.widget.AppCompatEditText;
import android.webkit.JsPromptResult;
import android.webkit.JsResult;
import android.widget.EditText;

import com.lightappbuilder.lab4.lablibrary.utils.L;

public class LABDialogsHelper implements DialogInterface.OnDismissListener {
    private static final String TAG = "LABDialogsHelper";

    private final Context context;
    private AlertDialog lastDialog;
    private JsResult lastJsResult;

    public LABDialogsHelper(Context context) {
        this.context = context;
    }

    public void showAlert(String message, final JsResult result) {
        AlertDialog.Builder dlg = new AlertDialog.Builder(context);
        dlg.setMessage(message);
        dlg.setCancelable(false);
        dlg.setPositiveButton(android.R.string.ok, new AlertDialog.OnClickListener() {
                    public void onClick(DialogInterface dialog, int which) {
                        result.confirm();
                    }
                });
        showDlg(dlg, result);
    }

    public void showConfirm(String message, final JsResult result) {
        AlertDialog.Builder dlg = new AlertDialog.Builder(context);
        dlg.setMessage(message);
        dlg.setCancelable(true);
        dlg.setPositiveButton(android.R.string.ok, new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int which) {
                result.confirm();
            }
        });
        dlg.setNegativeButton(android.R.string.cancel, new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int which) {
                result.cancel();
            }
        });
        dlg.setOnCancelListener(new DialogInterface.OnCancelListener() {
            public void onCancel(DialogInterface dialog) {
                result.cancel();
            }
        });
        showDlg(dlg, result);
    }

    public void showPrompt(String message, String defaultValue, final JsPromptResult result) {
        AlertDialog.Builder dlg = new AlertDialog.Builder(context);
        dlg.setMessage(message);
        final EditText input = new AppCompatEditText(context);
        if (defaultValue != null) {
            input.setText(defaultValue);
        }
        int margin = (int) (input.getResources().getDisplayMetrics().density * 4);
        dlg.setView(input, margin, margin, margin, 0);
        dlg.setCancelable(false);
        dlg.setPositiveButton(android.R.string.ok, new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int which) {
                result.confirm(input.getText().toString());
            }
        });
        dlg.setNegativeButton(android.R.string.cancel, new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int which) {
                result.cancel();
            }
        });
        showDlg(dlg, result);
    }

    private void showDlg(AlertDialog.Builder dlg, JsResult result) {
        cancelLastDialog();
        lastJsResult = result;
        lastDialog = dlg.show();
        lastDialog.setOnDismissListener(this);
    }

    private void cancelLastDialog() {
        if(lastDialog != null) {
            L.w(TAG, "cancelLastDialog lastDialog != null");
            lastJsResult.cancel();
            lastJsResult = null;
            lastDialog.dismiss();
            lastDialog = null;
        }
    }

    public void onDestroy(){
        cancelLastDialog();
    }

    @Override
    public void onDismiss(DialogInterface dialog) {
        if(lastDialog == dialog) {
            lastDialog = null;
            lastJsResult = null;
        }
    }
}