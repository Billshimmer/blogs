package com.lightappbuilder.lab4.lablibrary.rnviews.photobrowser;

import android.content.Context;
import android.graphics.drawable.Animatable;
import android.net.Uri;
import android.support.v4.view.PagerAdapter;
import android.support.v4.view.ViewCompat;
import android.support.v4.view.ViewPager;
import android.view.View;
import android.view.ViewGroup;

import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.drawee.backends.pipeline.PipelineDraweeControllerBuilder;
import com.facebook.drawee.controller.BaseControllerListener;
import com.facebook.imagepipeline.common.ResizeOptions;
import com.facebook.imagepipeline.image.ImageInfo;
import com.facebook.imagepipeline.request.ImageRequestBuilder;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.Event;
import com.lightappbuilder.lab4.lablibrary.rnviews.LABRNTopView;
import com.lightappbuilder.lab4.lablibrary.utils.DisplayUtils;

import java.util.ArrayList;
import java.util.List;

import me.relex.photodraweeview.OnPhotoTapListener;
import me.relex.photodraweeview.PhotoDraweeView;

/**
 * Created by yinhf on 2017/1/4.
 */

public class PhotoBrowserView extends LABRNTopView implements OnPhotoTapListener, ViewPager.OnPageChangeListener {
    private static final String TAG = "PhotoBrowserView";

    private static final int MAX_IMAGE_SIZE = (int) (DisplayUtils.getLength() * 1.5);
    private MultiTouchViewPager viewPager;
    private ReadableMap pendingOptions;

    public PhotoBrowserView(Context context) {
        super(context);
        init(context);
    }

    private void init(Context context) {
        viewPager = new MultiTouchViewPager(context);
        addView(viewPager, -1, -1);
        viewPager.addOnPageChangeListener(this);
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        if (pendingOptions != null) {
            updateOptions(pendingOptions);
            pendingOptions = null;
        }
    }

    public void setOptions(ReadableMap options) {
        if (options == null) {
            viewPager.setAdapter(null);
            return;
        }
        if (ViewCompat.isAttachedToWindow(this)) {
            updateOptions(options);
        } else {
            pendingOptions = options;
        }
    }

    private void updateOptions(ReadableMap options) {
        ArrayList<Uri> photos;
        int currentIndex;
        try {
            ReadableArray photosArray = options.getArray("photos");
            photos = new ArrayList<>(photosArray.size());
            for (int i = 0; i < photosArray.size(); ++i) {
                photos.add(Uri.parse(photosArray.getString(i)));
            }
            currentIndex = 0;
            if (options.hasKey("currentIndex")) {
                currentIndex = options.getInt("currentIndex");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return;
        }
        PhotoPagerAdapter adapter = new PhotoPagerAdapter(photos);
        viewPager.setAdapter(adapter);
        viewPager.setCurrentItem(currentIndex);
    }

    private void dispatchEvent(Event event) {
        ((ReactContext) getContext()).getNativeModule(UIManagerModule.class).getEventDispatcher().dispatchEvent(event);
    }

    @Override
    public void onPhotoTap(View view, float x, float y) {
        dispatchEvent(new PhotoEvent(getId(), "onPhotoTap", null));
    }

    @Override
    public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {

    }

    @Override
    public void onPageSelected(int position) {
        WritableMap map = Arguments.createMap();
        map.putInt("index", position);
        dispatchEvent(new PhotoEvent(getId(), "onPhotoSelected", map));
    }

    @Override
    public void onPageScrollStateChanged(int state) {

    }

    private class PhotoPagerAdapter extends PagerAdapter {

        List<Uri> photos;

        PhotoPagerAdapter(List<Uri> photos) {
            this.photos = photos;
        }

        @Override public int getCount() {
            return photos.size();
        }

        @Override public boolean isViewFromObject(View view, Object object) {
            return view == object;
        }

        @Override public void destroyItem(ViewGroup container, int position, Object object) {
            container.removeView((View) object);
        }

        @Override public Object instantiateItem(ViewGroup viewGroup, int position) {
            final PhotoDraweeView photoDraweeView = new PhotoDraweeView(viewGroup.getContext());
            photoDraweeView.setOnPhotoTapListener(PhotoBrowserView.this);
            PipelineDraweeControllerBuilder controllerBuilder = Fresco.newDraweeControllerBuilder();
            controllerBuilder.setImageRequest(
                    ImageRequestBuilder.newBuilderWithSource(photos.get(position))
                            .setResizeOptions(new ResizeOptions(MAX_IMAGE_SIZE, MAX_IMAGE_SIZE))
                            .build());
            controllerBuilder.setOldController(photoDraweeView.getController());
            controllerBuilder.setControllerListener(new BaseControllerListener<ImageInfo>() {
                @Override
                public void onFinalImageSet(String id, ImageInfo imageInfo, Animatable animatable) {
                    super.onFinalImageSet(id, imageInfo, animatable);
                    if (imageInfo == null) {
                        return;
                    }
                    photoDraweeView.update(imageInfo.getWidth(), imageInfo.getHeight());
                }
            });
            photoDraweeView.setController(controllerBuilder.build());

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
