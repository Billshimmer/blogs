package com.dansejijie.myapplication.richtext;


import android.app.Activity;
import android.graphics.Bitmap;
import android.graphics.Rect;
import android.graphics.drawable.Animatable;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.util.DisplayMetrics;
import android.util.Log;
import android.util.LruCache;
import android.widget.TextView;
import com.facebook.common.executors.UiThreadImmediateExecutorService;
import com.facebook.common.references.CloseableReference;
import com.facebook.datasource.DataSource;
import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.drawee.backends.pipeline.PipelineDraweeControllerBuilder;
import com.facebook.drawee.controller.BaseControllerListener;
import com.facebook.drawee.generic.GenericDraweeHierarchy;
import com.facebook.drawee.generic.GenericDraweeHierarchyBuilder;
import com.facebook.drawee.interfaces.DraweeController;
import com.facebook.drawee.view.DraweeHolder;
import com.facebook.imagepipeline.common.ResizeOptions;
import com.facebook.imagepipeline.core.ImagePipeline;
import com.facebook.imagepipeline.datasource.BaseBitmapDataSubscriber;
import com.facebook.imagepipeline.image.CloseableImage;
import com.facebook.imagepipeline.image.ImageInfo;
import com.facebook.imagepipeline.request.ImageRequest;
import com.facebook.imagepipeline.request.ImageRequestBuilder;
import com.zzhoujay.richtext.CacheType;
import com.zzhoujay.richtext.ImageHolder;
import com.zzhoujay.richtext.RichTextConfig;
import com.zzhoujay.richtext.callback.ImageGetter;
import com.zzhoujay.richtext.callback.ImageLoadNotify;
import com.zzhoujay.richtext.drawable.DrawableWrapper;

import java.util.HashSet;

/**
 * Created by tygzx on 17/1/11.
 */

public class FrescoImageGetter implements ImageGetter, ImageLoadNotify {

    private static final int TARGET_TAG = com.zzhoujay.richtext.R.id.zhou_default_image_tag_id;

    private static final LruCache<String, Rect> imageBoundCache;

    DraweeHolder<GenericDraweeHierarchy> mDraweeHolder;

    static {
        imageBoundCache = new LruCache<>(20);
    }

    private static void cache(String source, Rect rect) {
        imageBoundCache.put(source, rect);
    }

    private static Rect loadCache(String source) {
        return imageBoundCache.get(source);
    }

    /*private HashSet<ImageTarget> targets;*/

    private ImageLoadNotify imageLoadNotify;

    private int loadedCount;

    public FrescoImageGetter() {
        //targets = new HashSet<>();
    }

    /*private void checkTag(TextView textView) {

        HashSet<ImageTarget> ts = (HashSet<ImageTarget>) textView.getTag(TARGET_TAG);
        if (ts != null) {
            if (ts == targets) {
                return;
            }
            for (ImageTarget target : ts) {
                //TODO
            }
            ts.clear();
        }
        textView.setTag(TARGET_TAG, targets);
    }*/


    @Override
    public Drawable getDrawable(final ImageHolder holder, final RichTextConfig config, final TextView textView) {


        final DrawableWrapper drawableWrapper = new DrawableWrapper();

        int realWidth=textView.getWidth()-textView.getPaddingLeft()-textView.getPaddingRight();
        int realHeight=textView.getHeight()-textView.getPaddingTop()-textView.getPaddingBottom();

        if (config.cacheType >= CacheType.LAYOUT) {
            Rect rect = loadCache(holder.getSource());
            if (rect != null) {
                holder.setCachedBound(rect);
                drawableWrapper.setBounds(rect);
            }
            drawableWrapper.setBounds(0,0,realWidth,realHeight);
        } else {
            drawableWrapper.setBounds(0, 0, (int) holder.getScaleWidth(), (int) holder.getScaleHeight());
        }
        if (config.placeHolder!=null){
            drawableWrapper.setBounds(0,0,config.placeHolder.getIntrinsicWidth(),config.placeHolder.getIntrinsicHeight());
            drawableWrapper.setDrawable(config.placeHolder);
        }

        ImageRequestBuilder imageRequestBuilder = ImageRequestBuilder.newBuilderWithSource(Uri.parse(holder.getSource()));
        if (!config.resetSize && holder.isInvalidateSize()) {
            imageRequestBuilder.setResizeOptions(new ResizeOptions((int) holder.getScaleWidth(),(int) holder.getScaleHeight()));
        }

        final ImagePipeline imagePipeline = Fresco.getImagePipeline();
        DataSource<CloseableReference<CloseableImage>> dataSource = imagePipeline.fetchDecodedImage(imageRequestBuilder.build(), UiThreadImmediateExecutorService.getInstance());
        dataSource.subscribe(new BaseBitmapDataSubscriber() {
            @Override
            protected void onNewResultImpl(Bitmap bitmap) {

                drawableWrapper.setBounds(0,0,bitmap.getWidth(),bitmap.getHeight());//TODO 这里必须的
                drawableWrapper.setDrawable(new BitmapDrawable(textView.getResources(),bitmap));
                CharSequence sequence = textView.getText();
                if (sequence != null) {
                    textView.setText(sequence);
                }
                cache(holder.getSource(), new Rect(0,0,bitmap.getWidth(),bitmap.getHeight()));
            }

            @Override
            protected void onFailureImpl(DataSource<CloseableReference<CloseableImage>> dataSource) {

                if (config.errorImage!=null){
                    drawableWrapper.setBounds(0,0,config.errorImage.getIntrinsicWidth(),config.errorImage.getIntrinsicHeight());
                    drawableWrapper.setDrawable(config.errorImage);
                    cache(holder.getSource(), new Rect(0,0,config.errorImage.getIntrinsicWidth(),config.errorImage.getIntrinsicHeight()));
                }else {
                    drawableWrapper.setBounds(0,0,0,0);
                    drawableWrapper.setDrawable(new BitmapDrawable(textView.getResources()));
                    cache(holder.getSource(), new Rect(0,0,0,0));
                }

                CharSequence sequence = textView.getText();
                if (sequence != null) {
                    textView.setText(sequence);
                }
                Log.i("TAG", "加载失败");
            }
        }, UiThreadImmediateExecutorService.getInstance());
        drawableWrapper.setCallback(textView);
        return drawableWrapper;

    }

    @Override
    public void registerImageLoadNotify(ImageLoadNotify imageLoadNotify) {

        this.imageLoadNotify = imageLoadNotify;
    }

    @Override
    public void done(Object from) {

        loadedCount++;
        if (imageLoadNotify != null) {
            imageLoadNotify.done(loadedCount);
        }
    }

    @Override
    public void recycle() {

        if (mDraweeHolder!=null){
            mDraweeHolder.onDetach();
        }
        if (imageBoundCache.size() > 0) {
            imageBoundCache.evictAll();
        }
    }

}
