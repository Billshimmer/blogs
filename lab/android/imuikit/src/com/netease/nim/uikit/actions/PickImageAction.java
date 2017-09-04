package com.netease.nim.uikit.actions;

import android.content.Intent;
import android.net.Uri;
import android.text.TextUtils;
import android.util.Log;
import android.widget.Toast;

import com.bilibili.boxing.Boxing;
import com.bilibili.boxing.model.config.BoxingConfig;
import com.bilibili.boxing.model.config.BoxingCropOption;
import com.bilibili.boxing.model.entity.BaseMedia;
import com.bilibili.boxing.model.entity.impl.ImageMedia;
import com.bilibili.boxing.utils.BoxingFileHelper;
import com.bilibili.boxing.utils.ImageCompressor;
import com.bilibili.boxing_impl.ui.BoxingActivity;
import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

/**
 * Created by zhoujianghua on 2015/7/31.
 */
public abstract class PickImageAction extends BaseAction {

    private static final int PICK_IMAGE_COUNT = 9;
    private static final int PORTRAIT_IMAGE_WIDTH = 720;

    public static final String MIME_JPEG = "image/jpeg";
    public static final String JPG = ".jpg";

    private boolean multiSelect;
    private boolean crop = false;

    private static final int MAX_IMAGE_WIDTHG=1024*4;
    private static final int MAX_IMAGE_HEIGHT=1024*4;
    private static final int REQUEST_LAUNCH_IMAGE_LIBRARY = 0;
    private static final String TAG=PickImageAction.class.getSimpleName();

    protected abstract void onPicked(File file);

    protected PickImageAction(int iconResId, int titleId, boolean multiSelect) {
        super(iconResId, titleId);
        this.multiSelect = multiSelect;
    }

    @Override
    public void onClick() {
        //int requestCode = makeRequestCode(RequestCode.PICK_IMAGE);
        //showSelector(getTitleId(), requestCode, multiSelect, tempFile());
        String cachePath= BoxingFileHelper.getCacheDir(getActivity());
        if (TextUtils.isEmpty(cachePath)){
            Toast.makeText(getActivity(),"图片缓存路径不可读取",Toast.LENGTH_SHORT).show();;
            return;
        }
        Uri destUri=new Uri.Builder().scheme("file").appendPath(cachePath).appendPath(String.format(Locale.US,"%s.jpg",System.currentTimeMillis())).build();
        BoxingCropOption boxingCropOption=new BoxingCropOption(destUri);
        boxingCropOption.withMaxResultSize(MAX_IMAGE_WIDTHG,MAX_IMAGE_HEIGHT);
        BoxingConfig singleCropImageConfig=new BoxingConfig(BoxingConfig.Mode.SINGLE_IMG).needCamera();
        Boxing.of(singleCropImageConfig).withIntent(getActivity(),BoxingActivity.class).start(getActivity(),REQUEST_LAUNCH_IMAGE_LIBRARY);
    }

    /*private String tempFile() {
        String filename = StringUtil.get32UUID() + JPG;
        return StorageUtil.getWritePath(filename, StorageType.TYPE_TEMP);
    }*/

    /**
     * 打开图片选择器
     */
    private void showSelector(int titleId, final int requestCode, final boolean multiSelect, final String outPath) {
        /*PickImageHelper.PickImageOption option = new PickImageHelper.PickImageOption();
        option.titleResId = titleId;
        option.multiSelect = multiSelect;
        option.multiSelectMaxCount = PICK_IMAGE_COUNT;
        option.crop = crop;
        option.cropOutputImageWidth = PORTRAIT_IMAGE_WIDTH;
        option.cropOutputImageHeight = PORTRAIT_IMAGE_WIDTH;
        option.outputPath = outPath;

        PickImageHelper.pickImage(getActivity(), requestCode, option);*/
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (resultCode!=getActivity().RESULT_OK){
            return;
        }

        switch (requestCode) {
            case REQUEST_LAUNCH_IMAGE_LIBRARY:
                final ArrayList<BaseMedia> medias=Boxing.getResult(data);
                if (medias.size()>0){
                    final List<BaseMedia> imageMedias=new ArrayList<>(medias.size());
                    for (BaseMedia baseMedia:medias){
                        if (!(baseMedia instanceof ImageMedia)){
                            Log.i(TAG,"选择图片时发生错误");
                            return;
                        }
                        final ImageMedia imageMedia=(ImageMedia)baseMedia;
                        if (imageMedia.compress(new ImageCompressor(getActivity()))){
                            imageMedia.removeExif();
                            imageMedias.add(imageMedia);
                        }
                    }

                    BaseMedia baseMedia=imageMedias.get(0);
                    onPicked(new File(baseMedia.getPath()));
                }

                break;
        }
    }

    /**
     * 图片选取回调
     */
    /*private void onPickImageActivityResult(int requestCode, Intent data) {
        if (data == null) {
            Toast.makeText(getActivity(), R.string.picker_image_error, Toast.LENGTH_LONG).show();
            return;
        }
        boolean local = data.getBooleanExtra(Extras.EXTRA_FROM_LOCAL, false);
        if (local) {
            // 本地相册
            sendImageAfterSelfImagePicker(data);
        } else {
            // 拍照
            Intent intent = new Intent();
            if (!handleImagePath(intent, data)) {
                return;
            }

            //intent.setClass(getActivity(), PreviewImageFromCameraActivity.class);
            getActivity().startActivityForResult(intent, makeRequestCode(RequestCode.PREVIEW_IMAGE_FROM_CAMERA));
        }
    }*/

    /**
     * 是否可以获取图片
     */
    /*private boolean handleImagePath(Intent intent, Intent data) {
        String photoPath = data.getStringExtra(Extras.EXTRA_FILE_PATH);
        if (TextUtils.isEmpty(photoPath)) {
            Toast.makeText(getActivity(), R.string.picker_image_error, Toast.LENGTH_LONG).show();
            return false;
        }

        File imageFile = new File(photoPath);
        intent.putExtra("OrigImageFilePath", photoPath);
        File scaledImageFile = ImageUtil.getScaledImageFileWithMD5(imageFile, MIME_JPEG);

        boolean local = data.getExtras().getBoolean(Extras.EXTRA_FROM_LOCAL, true);
        if (!local) {
            // 删除拍照生成的临时文件
            AttachmentStore.delete(photoPath);
        }

        if (scaledImageFile == null) {
            Toast.makeText(getActivity(), R.string.picker_image_error, Toast.LENGTH_LONG).show();
            return false;
        } else {
            ImageUtil.makeThumbnail(getActivity(), scaledImageFile);
        }
        intent.putExtra("ImageFilePath", scaledImageFile.getAbsolutePath());
        return true;
    }*/

    /**
     * 从预览界面点击发送图片
     */
    /*private void sendImageAfterPreviewPhotoActivityResult(Intent data) {
        SendImageHelper.sendImageAfterPreviewPhotoActivityResult(data, new SendImageHelper.Callback() {

            @Override
            public void sendImage(File file, boolean isOrig) {
                onPicked(file);
            }
        });
    }*/

    /**
     * 发送图片
     */
    /*private void sendImageAfterSelfImagePicker(final Intent data) {
        SendImageHelper.sendImageAfterSelfImagePicker(getActivity(), data, new SendImageHelper.Callback() {

            @Override
            public void sendImage(File file, boolean isOrig) {
                onPicked(file);

            }
        });
    }*/

    /**
     * 拍摄回调
     */
    private void onPreviewImageActivityResult(int requestCode, Intent data) {
        /*if (data.getBooleanExtra(PreviewImageFromCameraActivity.RESULT_SEND, false)) {
            sendImageAfterPreviewPhotoActivityResult(data);
        } else if (data.getBooleanExtra(PreviewImageFromCameraActivity.RESULT_RETAKE, false)) {
            String filename = StringUtil.get32UUID() + JPG;
            String path = StorageUtil.getWritePath(filename, StorageType.TYPE_TEMP);

            if (requestCode == RequestCode.PREVIEW_IMAGE_FROM_CAMERA) {
                PickImageActivity.start(getActivity(), makeRequestCode(RequestCode.PICK_IMAGE), PickImageActivity.FROM_CAMERA, path);
            }
        }*/
    }
}
