package com.netease.nim.uikit.widget;

import android.content.Context;
import android.graphics.Bitmap;
import android.net.Uri;
import android.util.AttributeSet;
import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.drawee.generic.GenericDraweeHierarchyBuilder;
import com.facebook.drawee.interfaces.DraweeController;
import com.facebook.drawee.view.SimpleDraweeView;
import com.facebook.imagepipeline.common.ResizeOptions;
import com.facebook.imagepipeline.request.ImageRequestBuilder;
import com.netease.nim.uikit.R;
import com.netease.nim.uikit.system.NimUIKit;
import com.netease.nim.uikit.system.Team;
import com.netease.nim.uikit.userinfo.UserInfoProvider;

/**
 * Created by tygzx on 17/1/10.
 */

public class HeadImageView extends SimpleDraweeView {

    public HeadImageView(Context context) {
        this(context, null);

    }

    public HeadImageView(Context context, AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public HeadImageView(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
        setHierarchy(hierarchyBuilder.build());
    }

    public static final int DEFAULT_AVATAR_THUMB_SIZE = (int) NimUIKit.getContext().getResources().getDimension(R.dimen.avatar_max_size);
    public static final int DEFAULT_AVATAR_NOTIFICATION_ICON_SIZE = (int) NimUIKit.getContext().getResources().getDimension(R.dimen.avatar_notification_size);

    GenericDraweeHierarchyBuilder hierarchyBuilder = GenericDraweeHierarchyBuilder.newInstance(NimUIKit.getContext().getResources())
            .setPlaceholderImage(R.drawable.ease_default_avatar);

    /**
     * 加载用户头像（默认大小的缩略图）
     *
     * @param account
     */
    public void loadBuddyAvatar(String account) {
        loadBuddyAvatar(account, DEFAULT_AVATAR_THUMB_SIZE);
    }

    /**
     * 加载用户头像（指定缩略大小）
     *
     * @param account
     * @param thumbSize 缩略图的宽、高
     */
    private void loadBuddyAvatar(final String account, final int thumbSize) {
        // 判断是否需要ImageLoader加载
        UserInfoProvider.UserInfo userInfo=null;
        try{
            userInfo= NimUIKit.getUserInfoProvider().getUserInfo(account);
        }catch (Exception e){
            e.printStackTrace();
        }

        boolean needLoad = userInfo != null;
        doLoadImage(needLoad, account, userInfo != null ? userInfo.getAvatar() : null, thumbSize);
    }

    public void loadTeamIcon(String tid) {
        Bitmap bitmap = NimUIKit.getUserInfoProvider().getTeamIcon(tid);
        setImageBitmap(bitmap);
    }

    public void loadTeamIconByTeam(final Team team) {
        // 判断是否需要ImageLoader加载
        boolean needLoad = team != null;
        String tag = team != null ? team.getId() : null;
        String url = team != null ? team.getIcon() : null;
        doLoadImage(needLoad, tag, url, DEFAULT_AVATAR_THUMB_SIZE);
    }

    /**
     * ImageLoader异步加载
     */
    private void doLoadImage(final boolean needLoad, final String tag, final String url, final int thumbSize) {
        if (needLoad) {
            setTag(tag); // 解决ViewHolder复用问题

            DraweeController controller = Fresco.newDraweeControllerBuilder().setImageRequest(ImageRequestBuilder.newBuilderWithSource(Uri.parse(url))
                                        .setResizeOptions(new ResizeOptions(thumbSize, thumbSize)).build()).build();
            setController(controller);
        } else {
            setTag(null);
        }
    }

    /**
     * 解决ViewHolder复用问题
     */
    public void resetImageView() {
        setImageBitmap(null);
    }

}
