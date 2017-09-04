package com.netease.nim.uikit.extra.session.actions;

import android.content.Intent;

import com.bilibili.boxing.Boxing;
import com.bilibili.boxing.BoxingMediaLoader;
import com.bilibili.boxing.loader.IBoxingMediaLoader;
import com.bilibili.boxing.model.config.BoxingConfig;
import com.bilibili.boxing.model.entity.BaseMedia;
import com.bilibili.boxing.model.entity.impl.ImageMedia;
import com.bilibili.boxing.utils.ImageCompressor;
import com.bilibili.boxing_impl.ui.BoxingActivity;
import com.netease.nim.uikit.session.actions.BaseAction;

import java.io.File;
import java.util.List;

import static com.netease.nim.uikit.session.constant.RequestCode.PICK_IMAGE;

/**
 * Created by zhoujianghua on 2015/7/31.
 */
public abstract class PickImageAction extends BaseAction {

    //private static final int REQUEST_CODE=10010;
    private static final int PICK_IMAGE_COUNT = 9;
    private static final int PORTRAIT_IMAGE_WIDTH = 720;

    public static final String MIME_JPEG = "image/jpeg";
    public static final String JPG = ".jpg";

    private boolean multiSelect;
    private boolean crop = false;

    protected abstract void onPicked(File file);

    private BoxingConfig config;

    protected PickImageAction(int iconResId, int titleId, boolean multiSelect) {
        super(iconResId, titleId);
        this.multiSelect = multiSelect;

        if (BoxingMediaLoader.getInstance().getLoader() == null) {
            IBoxingMediaLoader loader = new BoxingGlideLoader();
            BoxingMediaLoader.getInstance().init(loader);
        }

        config = new BoxingConfig(BoxingConfig.Mode.SINGLE_IMG).needCamera(); // Mode：Mode.SINGLE_IMG, Mode.MULTI_IMG, Mode.VIDEO
    }

    @Override
    public void onClick() {
        Boxing.of(config).withIntent(getContainer().activity, BoxingActivity.class).start(getContainer().activity, PICK_IMAGE);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {

        switch (requestCode){
            case PICK_IMAGE:
                List<BaseMedia> medias = Boxing.getResult(data);
                if (medias!=null&&medias.size()>0){
                    ImageMedia imageMedia= (ImageMedia) medias.get(0);
                    if (imageMedia.compress(new ImageCompressor(getActivity()))) {
                        imageMedia.removeExif();
                    }
                    onPicked(new File(imageMedia.getPath()));
                }

                break;
        }
    }
}
