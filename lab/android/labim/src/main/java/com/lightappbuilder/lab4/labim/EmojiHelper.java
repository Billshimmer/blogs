package com.lightappbuilder.lab4.labim;

import com.netease.nim.uikit.extra.easeui.utils.EaseSmileUtils;

import java.util.HashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by vice on 2016/8/11.
 */
public class EmojiHelper {
    private static final String TAG = "EmojiHelper";

    private static final Pattern faceCharPattern = Pattern.compile("\\[.{1,4}\\]");

    //    private static final String[] emoji = new String[]{
//            "\ud83d\ude0a", "\ud83d\ude2e", "\ud83d\ude21", "\ud83d\ude1e", "\ud83d\ude07", "\ud83d\ude31", "\ud83d\ude15",
//            "\ud83d\ude03", "\ud83d\ude0b", "\ud83d\ude16", "\ud83d\ude2d", "\ud83d\ude2c", "\ud83c\udf85", "\ud83d\ude37",
//            "\ud83d\ude09", "\ud83d\ude0e", "\ud83d\ude33", "\ud83d\ude10", "\ud83d\ude06", "\ud83d\ude34",
//
//
//            "\ud83d\ude2f", "\ud83d\udc96", "\ud83c\udf1f", "\ud83d\ude1a", "\ud83c\udf39",
//            "\ud83d\ude0f", "\ud83d\udc94", "\ud83c\udf1e", "\ud83d\ude0d", "\ud83c\udf42",
//            "\ud83d\ude11", "\ud83c\udf19", "\ud83c\udf08", "\ud83d\udc8b", "\ud83d\udc4d"
//
//    };
    private static final String[] emoji = new String[]{
            "\ud83d\ude0a", "\ud83d\ude03", "\ud83d\ude09", "\ud83d\ude2e", "\ud83d\ude0b", "\ud83d\ude0e", "\ud83d\ude21",
            "\ud83d\ude16", "\ud83d\ude33", "\ud83d\ude1e", "\ud83d\ude2d", "\ud83d\ude10", "\ud83d\ude07", "\ud83d\ude2c",
            "\ud83d\ude06", "\ud83d\ude31", "\ud83c\udf85", "\ud83d\ude34", "\ud83d\ude15", "\ud83d\ude37",

            "\ud83d\ude2f", "\ud83d\ude0f", "\ud83d\ude11", "\ud83d\udc96", "\ud83d\udc94", "\ud83c\udf19", "\ud83c\udf1f",
            "\ud83c\udf1e", "\ud83c\udf08", "\ud83d\ude1a", "\ud83d\ude0d", "\ud83d\udc8b", "\ud83c\udf39", "\ud83c\udf42",
            "\ud83d\udc4d"
//
//            "\ud83d\ude0a", "\ud83d\ude2e", "\ud83d\ude21", "\ud83d\ude1e", "\ud83d\ude07", "\ud83d\ude31", "\ud83d\ude15",
//            "\ud83d\ude03", "\ud83d\ude0b", "\ud83d\ude16", "\ud83d\ude2d", "\ud83d\ude2c", "\ud83c\udf85", "\ud83d\ude37",
//            "\ud83d\ude09", "\ud83d\ude0e", "\ud83d\ude33", "\ud83d\ude10", "\ud83d\ude06", "\ud83d\ude34",
//
//
//            "\ud83d\ude2f", "\ud83d\udc96", "\ud83c\udf1f", "\ud83d\ude1a", "\ud83c\udf39",
//            "\ud83d\ude0f", "\ud83d\udc94", "\ud83c\udf1e", "\ud83d\ude0d", "\ud83c\udf42",
//            "\ud83d\ude11", "\ud83c\udf19", "\ud83c\udf08", "\ud83d\udc8b", "\ud83d\udc4d"

    };

    private static final String[] iconText = new String[]{
            EaseSmileUtils.ee_1, EaseSmileUtils.ee_2, EaseSmileUtils.ee_3, EaseSmileUtils.ee_4, EaseSmileUtils.ee_5, EaseSmileUtils.ee_6, EaseSmileUtils.ee_7,
            EaseSmileUtils.ee_8, EaseSmileUtils.ee_9, EaseSmileUtils.ee_10, EaseSmileUtils.ee_11, EaseSmileUtils.ee_12, EaseSmileUtils.ee_13, EaseSmileUtils.ee_14,
            EaseSmileUtils.ee_15, EaseSmileUtils.ee_16, EaseSmileUtils.ee_17, EaseSmileUtils.ee_18, EaseSmileUtils.ee_19, EaseSmileUtils.ee_20,

            EaseSmileUtils.ee_21, EaseSmileUtils.ee_22, EaseSmileUtils.ee_23, EaseSmileUtils.ee_24, EaseSmileUtils.ee_25,
            EaseSmileUtils.ee_26, EaseSmileUtils.ee_27, EaseSmileUtils.ee_28, EaseSmileUtils.ee_29, EaseSmileUtils.ee_30,
            EaseSmileUtils.ee_31, EaseSmileUtils.ee_32, EaseSmileUtils.ee_33, EaseSmileUtils.ee_34, EaseSmileUtils.ee_35,
    };

    //        String[] iconText1 = new String[]{
//                "[):]", "[:D]", "[;)]", "[:-o]", "[:p]", "[(H)]", "[:@]",
//                "[:s]", "[:$]", "[:(]", "[:'(]", "[:|]", "[(a)]", "[8o|]",
//                "[8-|]", "[+o(]", "[<o)]", "[|-)]", "[*-)]", "[:-#]",
//
//                "[:-*]", "[^o)]", "[8-)]", "[(|)]", "[(u)]",
//                "[(S)]", "[(*)]", "[(#)]", "[(R)]", "[({)]",
//                "[(})]", "[(k)]", "[(F)]", "[(W)]", "[(D)]",
//        };

    private static HashMap<String, String> iconEmojiMap;

    static {
        iconEmojiMap = new HashMap<>();
        for (int i = 0; i < iconText.length; ++i) {
            iconEmojiMap.put(iconText[i], emoji[i]);
        }
    }

    public static void convertToSystemEmoticons(String text, StringBuffer outBuffer) {
        Matcher matcher = faceCharPattern.matcher(text);
        String group;
        String emojiCode;
        while (matcher.find()) {
            group = matcher.group();
            //Log.i(TAG, "convertToSystemEmoticons: matcher1.group()=" + group);
            emojiCode = iconEmojiMap.get(group);
            if (emojiCode != null) {
                matcher.appendReplacement(outBuffer, emojiCode);
            } else {
                matcher.appendReplacement(outBuffer, group);
            }
        }
        matcher.appendTail(outBuffer);
    }
}
