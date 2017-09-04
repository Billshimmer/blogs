//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by Fernflower decompiler)
//

package com.netease.nimlib.sdk.nos.util;

import android.util.DisplayMetrics;
import com.netease.nimlib.sdk.nos.model.NosThumbParam.ThumbType;

public class NosThumbImageUtil {
    public NosThumbImageUtil() {
    }

    public static final String makeImageThumbUrl(String var0, ThumbType var1, int var2, int var3) {
        return var0 + "?" + toImageThumbParams(var1, var2, var3);
    }

    public static final String makeImageThumbUrl(String var0, int var1, int var2) {
//        ThumbType var3 = ThumbType.Internal;
//        if(var2 > 0 && var1 > 0) {
//            var3 = (var1 > var2?var1 / var2:var2 / var1) > 4?ThumbType.External:ThumbType.Internal;
//        }
//
//        if((var1 = b.d().thumbnailSize) <= 0) {
//            DisplayMetrics var4;
//            var1 = Math.min((var4 = b.a().getApplicationContext().getResources().getDisplayMetrics()).widthPixels, var4.heightPixels) / 2;
//        }

        return " ";
    }

    private static final String toImageThumbParams(ThumbType var0, int var1, int var2) {
        if(!checkImageThumb(var0, var1, var2)) {
            throw new IllegalArgumentException("width=" + var1 + ", height=" + var2);
        } else {
            StringBuilder var3;
            (var3 = new StringBuilder()).append("thumbnail=");
            var3.append(var1);
            var3.append(toImageThumbMethod(var0));
            var3.append(var2);
            var3.append("&imageView");
            return var3.toString();
        }
    }

    private static final boolean checkImageThumb(ThumbType var0, int var1, int var2) {
//        if(var1 >= 0 && var2 >= 0) {
//            switch(null.$SwitchMap$com$netease$nimlib$sdk$nos$model$NosThumbParam$ThumbType[var0.ordinal()]) {
//                case 1:
//                    if(var1 <= 0 && var2 <= 0) {
//                        return false;
//                    }
//
//                    return true;
//                case 2:
//                case 3:
//                    if(var1 > 0 && var2 > 0) {
//                        return true;
//                    }
//
//                    return false;
//                default:
//                    return false;
//            }
//        } else {
//            return false;
//        }
        return false;
    }

    private static final String toImageThumbMethod(ThumbType var0) {

//        switch(null.$SwitchMap$com$netease$nimlib$sdk$nos$model$NosThumbParam$ThumbType[var0.ordinal()]) {
//            case 1:
//                return "x";
//            case 2:
//                return "y";
//            case 3:
//                return "z";
//            default:
//                throw new IllegalArgumentException("thumb: " + var0);
//        }
        return "x";
    }
}
