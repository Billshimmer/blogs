package com.netease.nim.uikit.viewholder;


import android.net.Uri;
import android.text.TextUtils;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.View;

import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.drawee.controller.ControllerListener;
import com.facebook.drawee.generic.GenericDraweeHierarchyBuilder;
import com.facebook.drawee.interfaces.DraweeController;
import com.facebook.drawee.view.SimpleDraweeView;
import com.facebook.imagepipeline.common.ResizeOptions;
import com.facebook.imagepipeline.image.ImageInfo;
import com.facebook.imagepipeline.request.ImageRequestBuilder;
import com.hyphenate.chat.EMClient;
import com.hyphenate.chat.EMFileMessageBody;
import com.hyphenate.chat.EMImageMessageBody;
import com.hyphenate.chat.EMVoiceMessageBody;
import com.hyphenate.util.PathUtil;
import com.netease.nim.uikit.R;
import com.netease.nim.uikit.common.ui.recyclerview.adapter.BaseMultiItemFetchLoadAdapter;
import com.netease.nim.uikit.common.util.EaseImageUtils;
import com.netease.nim.uikit.common.util.file.FileUtil;
import com.netease.nim.uikit.common.util.media.BitmapDecoder;
import com.netease.nim.uikit.common.util.media.ImageUtil;
import com.netease.nim.uikit.common.util.sys.ScreenUtil;
import com.netease.nim.uikit.common.http.EMImageLoadHelper;
import com.netease.nim.uikit.system.MsgDirectionEnum;
import com.netease.nim.uikit.system.MsgStatusEnum;
import com.netease.nim.uikit.system.MsgTypeEnum;
import com.netease.nim.uikit.system.NimUIKit;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nullable;

/**
 * Created by zhoujianghua on 2015/8/4.
 */
public abstract class MsgViewHolderImageThumbBase extends MsgViewHolderBase {



    protected SimpleDraweeView thumbnail;
    protected View progressCover;
    EMImageMessageBody msgAttachment;

    private static DisplayMetrics metrics= NimUIKit.getContext().getResources().getDisplayMetrics();

    public MsgViewHolderImageThumbBase(BaseMultiItemFetchLoadAdapter adapter) {
        super(adapter);
    }


    @Override
    protected void inflateContentView() {
        thumbnail = findViewById(R.id.message_item_thumb_thumbnail);
        progressBar = findViewById(R.id.message_item_thumb_progress_bar);
        progressCover = findViewById(R.id.message_item_thumb_progress_cover);


    }

    @Override
    protected void bindContentView() {

//        if (message.getDirect()== MsgDirectionEnum.In){
//            setMessageReceiveCallback();
//        }else {
//            setMessageSendCallback();
//        }
    }

    @Override
    protected void setStatus() {

        msgAttachment = (EMImageMessageBody) message.getAttachment();
        MsgStatusEnum status = message.getStatus();
        // alert button
        if (TextUtils.isEmpty(msgAttachment.getLocalUrl())) {
            if (msgAttachment.downloadStatus() == EMFileMessageBody.EMDownloadStatus.FAILED || status == MsgStatusEnum.fail) {
                alertButton.setVisibility(View.VISIBLE);
            } else {
                alertButton.setVisibility(View.GONE);
            }
        }

        if (message.getStatus() == MsgStatusEnum.sending
                || (isReceivedMessage() && msgAttachment.thumbnailDownloadStatus() == EMFileMessageBody.EMDownloadStatus.DOWNLOADING)) {
            progressCover.setVisibility(View.VISIBLE);
            progressBar.setVisibility(View.VISIBLE);
        } else {
            progressCover.setVisibility(View.GONE);
            progressBar.setVisibility(View.GONE);
        }

        GenericDraweeHierarchyBuilder hierarchyBuilder=GenericDraweeHierarchyBuilder.newInstance(NimUIKit.getContext().getResources());
        hierarchyBuilder.setPlaceholderImage(R.drawable.nim_default_img).setFailureImage(R.drawable.nim_default_img_failed).build();

        thumbnail.setHierarchy(hierarchyBuilder.build());
        thumbnail.setController(null);
        if (message.getDirect() == MsgDirectionEnum.In) {
            if (msgAttachment.thumbnailDownloadStatus()==EMFileMessageBody.EMDownloadStatus.SUCCESSED){
                thumbnail.setController(null);
                String thumbPath = msgAttachment.thumbnailLocalPath();

                if (!new File(thumbPath).exists()) {
                    thumbPath = EaseImageUtils.getThumbnailImagePath(msgAttachment.getLocalUrl());
                }
//                File picDir=context.getCacheDir();
//                File newFile=new File(picDir,msgAttachment.getFileName());
//                if (!newFile.exists()){
//                    new File(thumbPath).renameTo(newFile);
//                }

//                File cacheFile=new File(context.getCacheDir(),msgAttachment.getFileName());
//                if (!cacheFile.exists()){
//                    if (FileUtil.CopySdcardFile(thumbPath,cacheFile.getAbsolutePath())==0){
//                        thumbPath=cacheFile.getAbsolutePath();
//                    }
//                }else {
//                    thumbPath=cacheFile.getAbsolutePath();
//                }

                loadImage(thumbPath);
            }else if (msgAttachment.thumbnailDownloadStatus() == EMFileMessageBody.EMDownloadStatus.FAILED){
                String thumbPath = msgAttachment.getRemoteUrl();
                loadImage(thumbPath);
            }
            return;
        }else {
            String thumbImageName = msgAttachment.getLocalUrl().substring(msgAttachment.getLocalUrl().lastIndexOf("/") + 1, msgAttachment.getLocalUrl().length());
            String thumbPath = PathUtil.getInstance().getImagePath() + "/" + "th" + thumbImageName;
            loadImage(thumbPath);
        }

    }

    private void loadImage(String thumbPath) {

        Uri uri;

        if (new File(thumbPath).exists()) {
            setImageSize(thumbPath);
            uri=Uri.fromFile(new File(thumbPath));
            //uri=Uri.parse("file://"+thumbPath);
        } else if (new File(msgAttachment.getLocalUrl()).exists()) {
            setImageSize(msgAttachment.getLocalUrl());
            uri=Uri.fromFile(new File(msgAttachment.getLocalUrl()));
        } else {
            Map<String,String>authHeaders=new HashMap<>();
            authHeaders.put("share-secret", ((EMImageMessageBody)message.getAttachment()).getSecret());
            authHeaders.put("Authorization", "Bearer " + EMClient.getInstance().getAccessToken());
            authHeaders.put("thumbnail", "true");
            authHeaders.put("Accept","application/octet-stream");
            DraweeController controller= EMImageLoadHelper.newDraweeControllerBuilder()
                    .setCallerContext(authHeaders)
                    .setImageRequest(ImageRequestBuilder.newBuilderWithSource(Uri.parse(((EMImageMessageBody)message.getAttachment()).getRemoteUrl()))
                        .setResizeOptions(new ResizeOptions((int)(metrics.widthPixels*1.5f),(int)(metrics.heightPixels*1.5f)))
                        .build())
                    .build();
            thumbnail.setController(controller);
            return;
        }

//        DraweeController controller= Fresco.newDraweeControllerBuilder().setControllerListener(new ControllerListener<ImageInfo>() {
//            @Override
//            public void onSubmit(String id, Object callerContext) {
//
//            }
//
//            @Override
//            public void onFinalImageSet(String id, @Nullable ImageInfo imageInfo, @Nullable Animatable animatable) {
//                Log.i("TAG","success");
//            }
//
//            @Override
//            public void onIntermediateImageSet(String id, @Nullable ImageInfo imageInfo) {
//                Log.i("TAG","success");
//            }
//
//            @Override
//            public void onIntermediateImageFailed(String id, Throwable throwable) {
//                Log.i("TAG",throwable.getMessage());
//            }
//
//            @Override
//            public void onFailure(String id, Throwable throwable) {
//                Log.i("TAG",throwable.getMessage());
//            }
//
//            @Override
//            public void onRelease(String id) {
//
//            }
//        }).setUri(uri).build();
        //Log.i("TAG",uri.getPath());
        thumbnail.setImageURI(uri);

    }

    private void refreshStatus() {
        EMImageMessageBody attachment = (EMImageMessageBody) message.getAttachment();
        if (attachment.thumbnailDownloadStatus() == EMFileMessageBody.EMDownloadStatus.FAILED) {
            alertButton.setVisibility(View.VISIBLE);
        } else {
            alertButton.setVisibility(View.GONE);
        }
        if (message.getStatus() == MsgStatusEnum.sending
                || (isReceivedMessage() && attachment.thumbnailDownloadStatus() == EMFileMessageBody.EMDownloadStatus.DOWNLOADING)) {
            progressCover.setVisibility(View.VISIBLE);
            progressBar.setVisibility(View.VISIBLE);
        } else {
            progressCover.setVisibility(View.GONE);
            progressBar.setVisibility(View.GONE);
        }
        progressCover.setVisibility(View.GONE);
        progressBar.setVisibility(View.GONE);
    }


    private void setImageSize(String thumbPath) {
        int[] bounds = null;
        if (thumbPath != null) {
            bounds = BitmapDecoder.decodeBound(new File(thumbPath));
        }
        if (bounds == null) {
            if (message.getMsgType() == MsgTypeEnum.image) {
                EMImageMessageBody attachment = (EMImageMessageBody) message.getAttachment();
                bounds = new int[]{attachment.getWidth(), attachment.getHeight()};
            }
        }

        if (bounds != null) {
            ImageUtil.ImageSize imageSize = ImageUtil.getThumbnailDisplaySize(bounds[0], bounds[1], getImageMaxEdge(), getImageMinEdge());
            setLayoutParams(imageSize.width, imageSize.height, thumbnail);
        }
    }

    private int maskBg() {
        return R.drawable.nim_message_item_round_bg;
    }

    public static int getImageMaxEdge() {
        return (int) (165.0 / 320.0 * ScreenUtil.screenWidth);
    }

    public static int getImageMinEdge() {
        return (int) (76.0 / 320.0 * ScreenUtil.screenWidth);
    }

}
