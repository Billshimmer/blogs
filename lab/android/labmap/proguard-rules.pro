# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /Users/yinhf/Library/Android/sdk/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

#http://lbsyun.baidu.com/index.php?title=androidsdk/guide/buildproject

#百度地图

-keep class com.baidu.** {*;}
-keep class vi.com.** {*;}
-dontwarn com.baidu.**

# 如果要混淆百度地图 则要确保BitmapDescriptor 不被混淆，因为ViewMarkerOptionsHelper中使用了反射