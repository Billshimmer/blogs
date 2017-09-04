package com.netease.nim.uikit.viewholder;

import android.graphics.Color;
import android.text.Spannable;
import android.text.method.LinkMovementMethod;
import android.view.View;
import android.widget.TextView;
import com.netease.nim.uikit.R;
import com.netease.nim.uikit.common.ui.recyclerview.adapter.BaseMultiItemFetchLoadAdapter;
import com.netease.nim.uikit.emoji.EaseSmileUtils;
import com.netease.nim.uikit.system.MsgDirectionEnum;
import com.netease.nim.uikit.system.NimUIKit;

/**
 * Created by zhoujianghua on 2015/8/4.
 */
public class MsgViewHolderText extends MsgViewHolderBase {

    public MsgViewHolderText(BaseMultiItemFetchLoadAdapter adapter) {
        super(adapter);
    }

    @Override
    protected int getContentResId() {
        return R.layout.nim_message_item_text;
    }

    @Override
    protected void inflateContentView() {
    }

    @Override
    protected void bindContentView() {
        layoutDirection();

        TextView bodyTextView = findViewById(R.id.nim_message_item_text_body);
        bodyTextView.setTextColor(isReceivedMessage() ? NimUIKit.getContext().getResources().getColor(R.color.receive_text) : NimUIKit.getContext().getResources().getColor(R.color.receive_text));
        bodyTextView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                onItemClick();
            }
        });
        Spannable span = EaseSmileUtils.getSmiledText(context, getDisplayText());
        bodyTextView.setText(span, TextView.BufferType.SPANNABLE);

        bodyTextView.setMovementMethod(LinkMovementMethod.getInstance());
        bodyTextView.setOnLongClickListener(longClickListener);

//        if (message.getDirect()== MsgDirectionEnum.In){
//            setMessageReceiveCallback();
//        }else {
//            setMessageSendCallback();
//        }
    }

    private void layoutDirection() {
        TextView bodyTextView = findViewById(R.id.nim_message_item_text_body);
        bodyTextView.setBackgroundResource(android.R.color.transparent);
        bodyTextView.setTextColor(Color.BLACK);

    }

    @Override
    protected int leftBackground() {
        return R.drawable.ease_chatfrom_bg;
    }

    @Override
    protected int rightBackground() {
        return R.drawable.ease_chatto_bg;
    }

    protected String getDisplayText() {
        return message.getContent();
    }
}
