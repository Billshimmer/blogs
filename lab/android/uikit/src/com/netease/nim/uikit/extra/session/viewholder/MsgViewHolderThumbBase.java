package com.netease.nim.uikit.extra.session.viewholder;

import android.graphics.Bitmap;
import android.graphics.drawable.Animatable;
import android.net.Uri;
import android.os.AsyncTask;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.drawee.controller.BaseControllerListener;
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
import com.hyphenate.chat.EMMessage;
import com.hyphenate.util.PathUtil;
import com.netease.nim.uikit.NimUIKit;
import com.netease.nim.uikit.R;
import com.netease.nim.uikit.common.ui.imageview.MsgThumbImageView;
import com.netease.nim.uikit.common.ui.recyclerview.adapter.BaseMultiItemFetchLoadAdapter;
import com.netease.nim.uikit.common.ui.recyclerview.loadmore.LoadMoreView;
import com.netease.nim.uikit.common.util.media.BitmapDecoder;
import com.netease.nim.uikit.common.util.media.ImageUtil;
import com.netease.nim.uikit.common.util.string.StringUtil;
import com.netease.nim.uikit.common.util.sys.ScreenUtil;
import com.netease.nim.uikit.extra.session.activity.DisplayUtils;
import com.netease.nim.uikit.extra.session.activity.EMImageLoadHelper;
import com.netease.nim.uikit.session.viewholder.MsgViewHolderBase;
import com.netease.nimlib.sdk.msg.attachment.FileAttachment;
import com.netease.nimlib.sdk.msg.attachment.ImageAttachment;
import com.netease.nimlib.sdk.msg.attachment.VideoAttachment;
import com.netease.nimlib.sdk.msg.constant.AttachStatusEnum;
import com.netease.nimlib.sdk.msg.constant.MsgDirectionEnum;
import com.netease.nimlib.sdk.msg.constant.MsgStatusEnum;
import com.netease.nimlib.sdk.msg.constant.MsgTypeEnum;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by zhoujianghua on 2015/8/4.
 */
public abstract class MsgViewHolderThumbBase extends MsgViewHolderBase {

    private static final int MAX_SIZE = (int) (DisplayUtils.getLength() * 1.5);

    public MsgViewHolderThumbBase(BaseMultiItemFetchLoadAdapter adapter) {
        super(adapter);
    }

    protected SimpleDraweeView thumbnail;
    protected View progressCover;
    //protected TextView progressLabel;

    @Override
    protected void inflateContentView() {
        thumbnail = findViewById(R.id.message_item_thumb_thumbnail);
        progressBar = findViewById(R.id.message_item_thumb_progress_bar); // 覆盖掉
        progressCover = findViewById(R.id.message_item_thumb_progress_cover);
        //progressLabel = findViewById(R.id.message_item_thumb_progress_text);
    }

    @Override
    protected void bindContentView() {

        EMImageMessageBody imgBody = (EMImageMessageBody) message.emMessage.getBody();
        // received messages
        if (message.emMessage.direct() == EMMessage.Direct.RECEIVE) {
            if (imgBody.thumbnailDownloadStatus() == EMFileMessageBody.EMDownloadStatus.DOWNLOADING ||
                    imgBody.thumbnailDownloadStatus() == EMFileMessageBody.EMDownloadStatus.PENDING) {
                thumbnail.setImageResource(R.drawable.nim_default_img);
            } else {
                String thumbPath = imgBody.thumbnailLocalPath();
                if (!new File(thumbPath).exists()) {
                    // to make it compatible with thumbnail received in previous version
                    thumbPath = EaseImageUtils.getThumbnailImagePath(imgBody.getLocalUrl());
                }
                showImageView(thumbPath, thumbnail, imgBody.getLocalUrl(), message.emMessage);
            }
            return;
        }

        String filePath = imgBody.getLocalUrl();
        String thumbPath = EaseImageUtils.getThumbnailImagePath(imgBody.getLocalUrl());
        showImageView(thumbPath, thumbnail, filePath, message.emMessage);

        refreshStatus();
    }

    /**
     * load image into image view
     *
     * @param thumbernailPath
     * @param iv
     * @param
     * @return the image exists or not
     */
    private void showImageView(final String thumbernailPath, final ImageView iv, final String localFullSizePath, final EMMessage message) {

        ControllerListener controllerListener=new ControllerListener() {
            @Override
            public void onSubmit(String id, Object callerContext) {

            }

            @Override
            public void onFinalImageSet(String id, Object imageInfo, Animatable animatable) {
                Log.d("TAG","onFinalImageSet");
            }

            @Override
            public void onIntermediateImageSet(String id, Object imageInfo) {

            }

            @Override
            public void onIntermediateImageFailed(String id, Throwable throwable) {

            }

            @Override
            public void onFailure(String id, Throwable throwable) {
                Log.d("TAG","onFailure");
            }

            @Override
            public void onRelease(String id) {

            }
        };



        File file = new File(thumbernailPath);
        if (new File(thumbernailPath).exists()){
            setImageSize(file.getAbsolutePath());

            DraweeController draweeController= Fresco.newDraweeControllerBuilder().setControllerListener(controllerListener).setUri(Uri.fromFile(new File(thumbernailPath))).build();
            thumbnail.setController(draweeController);
            //thumbnail.setImageURI(Uri.fromFile(file));
        }else if (new File(((EMImageMessageBody)message.getBody()).getLocalUrl()).exists()){
            setImageSize(((EMImageMessageBody)message.getBody()).thumbnailLocalPath());

            DraweeController draweeController= Fresco.newDraweeControllerBuilder().setControllerListener(controllerListener).setUri(Uri.fromFile(new File(((EMImageMessageBody)message.getBody()).getLocalUrl()))).build();
            thumbnail.setController(draweeController);
            //thumbnail.setImageURI(Uri.fromFile(new File(((EMImageMessageBody)message.getBody()).thumbnailLocalPath())));
        }else {

            Map<String, String> authHeaders = new HashMap<>();
            authHeaders.put("share-secret", ((EMImageMessageBody) message.getBody()).getSecret());
            authHeaders.put("Authorization", "Bearer " + EMClient.getInstance().getAccessToken());
            authHeaders.put("thumbnail", "true");
            authHeaders.put("Accept","application/octet-stream");
            DraweeController controller = EMImageLoadHelper.newDraweeControllerBuilder()
                    .setCallerContext(authHeaders)
                    .setControllerListener(new BaseControllerListener<ImageInfo>() {

                        @Override
                        public void onFinalImageSet(String id, ImageInfo imageInfo, Animatable animatable) {
                            super.onFinalImageSet(id, imageInfo, animatable);
//                            if (imageInfo == null) {
//                                return;
//                            }
//                            thumbnail.update(imageInfo.getWidth(), imageInfo.getHeight());
                            int height = imageInfo.getHeight();
                            int width = imageInfo.getWidth();
                            ViewGroup.LayoutParams layoutParams=thumbnail.getLayoutParams();
                            layoutParams.width=width;
                            layoutParams.height=height;
                            thumbnail.setLayoutParams(layoutParams);
                        }

                        @Override
                        public void onFailure(String id, Throwable throwable) {
                            super.onFailure(id, throwable);
                        }
                    })
                    .setImageRequest(ImageRequestBuilder.newBuilderWithSource(Uri.parse(((EMImageMessageBody) message.getBody()).getThumbnailUrl()+"?thumbnail"))
                            .setResizeOptions(new ResizeOptions(MAX_SIZE, MAX_SIZE))
                            .build())
                    .build();
            thumbnail.setController(controller);


//            if (message.direct() == EMMessage.Direct.SEND) {
//                if (localFullSizePath != null && new File(localFullSizePath).exists()) {
//                    setImageSize(localFullSizePath);
//                    DraweeController draweeController= Fresco.newDraweeControllerBuilder().setControllerListener(controllerListener).setUri(Uri.fromFile(new File(localFullSizePath))).build();
//                    thumbnail.setController(draweeController);
//                    //thumbnail.setImageURI(Uri.fromFile(new File(localFullSizePath)));
//                } else {
//                    //return null;
//                }
//            } else {
//                //return null;
//            }
        }

    }

    private void refreshStatus() {
        ImageAttachment attachment = (ImageAttachment) message.getAttachment();
        if (TextUtils.isEmpty(attachment.getPath()) && TextUtils.isEmpty(attachment.getThumbPath())) {
            if (message.getAttachStatus() == AttachStatusEnum.fail || message.getStatus() == MsgStatusEnum.fail) {
                alertButton.setVisibility(View.VISIBLE);
            } else {
                alertButton.setVisibility(View.GONE);
            }
        }

        if (message.getStatus() == MsgStatusEnum.sending
                || (isReceivedMessage() && message.getAttachStatus() == AttachStatusEnum.transferring)) {
            progressCover.setVisibility(View.VISIBLE);
            progressBar.setVisibility(View.VISIBLE);
            //progressLabel.setVisibility(View.VISIBLE);
            //progressLabel.setText(StringUtil.getPercentString(getMsgAdapter().getProgress(message)));
        } else {
            progressCover.setVisibility(View.GONE);
            progressBar.setVisibility(View.GONE);
            //progressLabel.setVisibility(View.GONE);
        }
    }

    private void loadThumbnailImage(String path, boolean isOriginal) {

        GenericDraweeHierarchyBuilder hierarchyBuilder=GenericDraweeHierarchyBuilder.newInstance(NimUIKit.getContext().getResources());
        hierarchyBuilder.setPlaceholderImage(R.drawable.nim_default_img).setFailureImage(R.drawable.nim_default_img_failed).build();
        thumbnail.setHierarchy(hierarchyBuilder.build());
        thumbnail.setController(null);

        if (new File(path).exists()){
            setImageSize(path);
            thumbnail.setImageURI(Uri.fromFile(new File(path)));
        }
        //thumbnail.setImageURI(Uri.fromFile(new File(path)));
    }

    private void setImageSize(String thumbPath) {
        int[] bounds = null;
        if (thumbPath != null) {
            bounds = BitmapDecoder.decodeBound(new File(thumbPath));
        }
        if (bounds == null) {
            if (message.getMsgType() == MsgTypeEnum.image) {
                ImageAttachment attachment = (ImageAttachment) message.getAttachment();
                bounds = new int[]{attachment.getWidth(), attachment.getHeight()};
            } else if (message.getMsgType() == MsgTypeEnum.video) {
                VideoAttachment attachment = (VideoAttachment) message.getAttachment();
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

    protected abstract String thumbFromSourceFile(String path);
}
