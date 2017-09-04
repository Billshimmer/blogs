package com.netease.nim.uikit.widget;

import android.content.Context;
import android.graphics.drawable.Animatable;
import android.net.Uri;
import android.support.v4.view.PagerAdapter;
import android.util.AttributeSet;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import com.facebook.drawee.controller.BaseControllerListener;
import com.facebook.drawee.interfaces.DraweeController;
import com.facebook.imagepipeline.common.ResizeOptions;
import com.facebook.imagepipeline.image.ImageInfo;
import com.facebook.imagepipeline.request.ImageRequestBuilder;
import com.hyphenate.chat.EMClient;
import com.hyphenate.chat.EMImageMessageBody;
import com.hyphenate.chat.EMMessage;
import com.netease.nim.uikit.common.http.EMImageLoadHelper;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import me.relex.photodraweeview.PhotoDraweeView;

/**
 * Created by tygzx on 17/1/5.
 */
public class PhotoBrowserView extends FrameLayout {
    private static final String TAG = "PhotoBrowserView";

    private MultiTouchViewPager viewPager;
    private static final int MAX_SIZE = (int) (DisplayUtils.getLength() * 1.5);

    public PhotoBrowserView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init(context);
    }

    public PhotoBrowserView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init(context);
    }

    public PhotoBrowserView(Context context) {
        super(context);
        init(context);
    }

    private void init(Context context) {
        viewPager = new MultiTouchViewPager(context);
        addView(viewPager, -1, -1);
    }

    public void setOptions(List<EMMessage> messages, int index) {
        if (messages == null) {
            viewPager.setAdapter(null);
            return;
        }

        PhotoPagerAdapter adapter = new PhotoPagerAdapter(messages);
        viewPager.setAdapter(adapter);
        viewPager.setCurrentItem(index);
    }


    private class PhotoPagerAdapter extends PagerAdapter {

        List<EMMessage> photos;

        PhotoPagerAdapter(List<EMMessage> photos) {
            this.photos = photos;
        }

        @Override
        public int getCount() {
            return photos.size();
        }

        @Override
        public boolean isViewFromObject(View view, Object object) {
            return view == object;
        }

        @Override
        public void destroyItem(ViewGroup container, int position, Object object) {
            container.removeView((View) object);
        }

        @Override
        public Object instantiateItem(ViewGroup viewGroup, int position) {
            final PhotoDraweeView photoDraweeView = new PhotoDraweeView(viewGroup.getContext());

            EMMessage emMessage = photos.get(position);
            String url;
            /*if (emMessage.direct()== EMMessage.Direct.RECEIVE){
                url=((EMImageMessageBody) emMessage.getBody()).getRemoteUrl();
            }else {
                url=((EMImageMessageBody) emMessage.getBody()).getLocalUrl();
            }*/

            Map<String, String> authHeaders = new HashMap<>();
            authHeaders.put("share-secret", ((EMImageMessageBody) emMessage.getBody()).getSecret());
            authHeaders.put("Authorization", "Bearer " + EMClient.getInstance().getAccessToken());
            authHeaders.put("thumbnail", "false");
            authHeaders.put("Accept","application/octet-stream");
            DraweeController controller = EMImageLoadHelper.newDraweeControllerBuilder()
                    .setCallerContext(authHeaders)
                    .setControllerListener(new BaseControllerListener<ImageInfo>() {

                        @Override
                        public void onFinalImageSet(String id, ImageInfo imageInfo, Animatable animatable) {
                            super.onFinalImageSet(id, imageInfo, animatable);
                            if (imageInfo == null) {
                                return;
                            }
                            photoDraweeView.update(imageInfo.getWidth(), imageInfo.getHeight());
                        }
                    })
                    .setImageRequest(ImageRequestBuilder.newBuilderWithSource(Uri.parse(((EMImageMessageBody) emMessage.getBody()).getRemoteUrl()))
                            .setResizeOptions(new ResizeOptions(MAX_SIZE, MAX_SIZE))
                            .build())
                    .build();

            photoDraweeView.setController(controller);

            try {
                viewGroup.addView(photoDraweeView, ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.MATCH_PARENT);
            } catch (Exception e) {
                e.printStackTrace();
            }

            return photoDraweeView;
        }
    }
}