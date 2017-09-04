//package com.lightappbulder.lab4.test;
//
//import android.app.Activity;
//import android.content.Intent;
//import android.os.Bundle;
//import com.netease.nim.uikit.R;
//import com.netease.nim.uikit.system.SessionTypeEnum;
//import com.netease.nim.uikit.widget.MessageView;
//import com.netease.nim.uikit.constant.Extras;
//
//
///**
// * 点对点聊天界面
// * <p/>
// * Created by huangjun on 2015/2/1.
// */
//public class P2PMessageActivity extends Activity {
//
//    MessageView messageView;
//
//    @Override
//    protected void onCreate(Bundle savedInstanceState) {
//        super.onCreate(savedInstanceState);
//        setContentView(R.layout.nim_chat_activity);
//        messageView= (MessageView) findViewById(R.id.chat_view);
//        Bundle bundle=new Bundle();
//        bundle.putString(Extras.EXTRA_ACCOUNT,"dansejijie");
//        bundle.putString(Extras.EXTRA_TOIMID,"dansejijie");
//        bundle.putString(Extras.EXTRA_TONICKNAME,"dansejijie");
//        bundle.putString(Extras.EXTRA_TOAVATOR,"http://img06.tooopen.com/images/20160807/tooopen_sy_174499584135.jpg");
//        bundle.putString(Extras.EXTRA_MYNICKNAME,"dansejijie2");
//        bundle.putString(Extras.EXTRA_MYAVATOR,"http://img06.tooopen.com/images/20160807/tooopen_sy_174499584135.jpg");
//        bundle.putBoolean(Extras.EXTRA_FRIEND,true);
//        bundle.putSerializable(Extras.EXTRA_TYPE, SessionTypeEnum.P2P);
//        messageView.setArguments(bundle);
//    }
//
//
//
//    @Override
//    protected void onResume() {
//        super.onResume();
//        messageView.onResume();
//    }
//
//    @Override
//    protected void onPause() {
//        super.onPause();
//        messageView.onPause();
//    }
//
//    @Override
//    protected void onDestroy() {
//        super.onDestroy();
//        messageView.onDestroy();
//    }
//
//    @Override
//    public void onBackPressed() {
//        super.onBackPressed();
//        messageView.onBackPressed();
//    }
//
//    @Override
//    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
//        super.onActivityResult(requestCode, resultCode, data);
//        messageView.onActivityResult(requestCode,resultCode,data);
//    }
//}
