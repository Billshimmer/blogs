package com.netease.nim.uikit.extra.session.activity;

import android.app.Activity;
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
import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import me.relex.photodraweeview.OnPhotoTapListener;
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
            Uri uri;
            String localUrl=((EMImageMessageBody)emMessage.getBody()).getLocalUrl();
            String remotepath=((EMImageMessageBody)emMessage.getBody()).getRemoteUrl();
            //show the image if it exist in local path
//            if (localUrl != null && new File(localUrl).exists()) {
//                uri=Uri.fromFile(new File(localUrl));
//            } else if (remotepath != null) { //download image from server
//                uri=Uri.parse(remotepath);
//            }

            if (emMessage.direct()== EMMessage.Direct.RECEIVE){
                uri=Uri.parse(((EMImageMessageBody) emMessage.getBody()).getRemoteUrl());
            }else {
                //uri=((EMImageMessageBody) emMessage.getBody()).getLocalUrl();
                uri=Uri.fromFile(new File(((EMImageMessageBody) emMessage.getBody()).getLocalUrl()));
            }

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

                        @Override
                        public void onFailure(String id, Throwable throwable) {
                            super.onFailure(id, throwable);
                        }
                    })
                    .setImageRequest(ImageRequestBuilder.newBuilderWithSource(uri)
                            .setResizeOptions(new ResizeOptions(MAX_SIZE, MAX_SIZE))
                            .build())
                    .build();

            photoDraweeView.setController(controller);
            photoDraweeView.setOnPhotoTapListener(new OnPhotoTapListener() {
                @Override
                public void onPhotoTap(View view, float x, float y) {
                    ((Activity)getContext()).finish();
                }
            });

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