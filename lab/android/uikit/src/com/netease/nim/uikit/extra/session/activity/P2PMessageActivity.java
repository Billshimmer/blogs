package com.netease.nim.uikit.extra.session.activity;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.Nullable;

import com.netease.nim.uikit.R;
import com.netease.nim.uikit.extra.session.fragment.MessageFragment;
import com.netease.nim.uikit.session.constant.Extras;
import com.netease.nimlib.sdk.msg.constant.SessionTypeEnum;


/**
 * Created by tygzx on 17/4/18.
 */

public class P2PMessageActivity extends Activity {

    MessageFragment messageFragment;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.test_main);

        messageFragment=new MessageFragment();
        Bundle args = new Bundle();
        args.putString(Extras.EXTRA_ACCOUNT, "dansejijie2");
        args.putSerializable(Extras.EXTRA_TYPE, SessionTypeEnum.P2P);
        messageFragment.setArguments(args);
        getFragmentManager().beginTransaction().add(R.id.id_container,messageFragment).commit();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        messageFragment.onActivityResult(requestCode,resultCode,data);
    }



}
