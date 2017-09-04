package com.netease.nim.uikit.extra.session.activity;

import android.content.Context;

import com.facebook.drawee.backends.pipeline.PipelineDraweeControllerBuilder;
import com.facebook.drawee.backends.pipeline.PipelineDraweeControllerBuilderSupplier;
import com.facebook.imagepipeline.core.ImagePipelineConfig;
import com.facebook.imagepipeline.core.ImagePipelineFactory;

import okhttp3.OkHttpClient;

/**
 * Created by dansejijie on 17/4/16.
 */

public class EMImageLoadHelper {

    private static Context context;
    private static PipelineDraweeControllerBuilderSupplier sSipelineDraweeControllerBuilderSupplier;

    public static void init(Context context) {
        EMImageLoadHelper.context = context;
        OkHttpClient okHttpClient = new OkHttpClient.Builder().build();
        ImagePipelineConfig config = ImagePipelineConfig.newBuilder(context).setNetworkFetcher(new EMOkHttpFetcher(okHttpClient)).build();
        ImagePipelineFactory imagePipelineFactory = new ImagePipelineFactory(config);
        sSipelineDraweeControllerBuilderSupplier = new PipelineDraweeControllerBuilderSupplier(context, imagePipelineFactory);
    }

    public static PipelineDraweeControllerBuilder newDraweeControllerBuilder() {
        return sSipelineDraweeControllerBuilderSupplier.get();
    }

}