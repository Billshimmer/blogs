//package com.lightappbuilder.lab4.labimlibrary;
//
//import android.content.Context;
//import android.os.AsyncTask;
//
//import com.facebook.react.modules.network.OkHttpClientProvider;
//import com.hyphenate.easeui.domain.EaseUser;
//
//import org.json.JSONObject;
//
//import java.io.IOException;
//import java.util.ArrayList;
//import java.util.List;
//
//import okhttp3.OkHttpClient;
//import okhttp3.Request;
//import okhttp3.Response;
//
///**
// * Created by vice on 2016/7/28.
// */
//public class NetRequest {
//    private final OkHttpClient client;
//    private UserDao userDao;
//
//    interface UserInfoInfoCallback{
//        void getUserInfo(List<EaseUser> easeUserList);
//    }
//
//    public NetRequest() {
//        client = OkHttpClientProvider.getOkHttpClient();
//    }
//
//
//    public void getContactInfo(final String[] chat_uids, final Context context, final UserInfoInfoCallback userInfoInfoCallback) throws IOException {
//
//
//        String url =Constant.BASE_URL+"IM/Index/contactInfo"+"?chat_uids=";
//
//        for (int i=0;i<chat_uids.length;i++){
//            if (i==chat_uids.length-1){
//                url+=chat_uids[i];
//            }else{
//                url+=chat_uids[i]+",";
//            }
//        }
//        url+="&LAB_JSON=1";
//
//        System.out.println("url=="+url);
//
//
//
////       String url=Constant.BASE_URL+"IM/Index/contactInfo"+"?chat_uids="+"181,246"+"&LAB_JSON=1";
//
//        final List<EaseUser> easeUserList=new ArrayList<>();
//
//        final Request request = new Request.Builder().url(url).build();
//
//        new AsyncTask<Void, Void, Void>() {
//
//            @Override
//            protected Void doInBackground(Void... params) {
//                Response response=null;
//                try {
//                    response = client.newCall(request).execute();
//                    if (response.isSuccessful()){
//                        String json = response.body().string();
//                        JSONObject jsonObject=new JSONObject(json);
//                        System.out.println("json"+json);
//                        if (jsonObject.getString("CODE").equals("ok")){
//                            JSONObject data = jsonObject.getJSONObject("DATA");
//                            JSONObject contact_info = data.getJSONObject("contact_info");
//                            easeUserList.clear();
//                            for (int i=0;i<chat_uids.length;i++){
//                                JSONObject info = contact_info.getJSONObject(chat_uids[i]);
//                                String avatar = info.getString("avatar");
//                                String nickname = info.getString("nickname");
//                                EaseUser easeUser=new EaseUser(chat_uids[i]);
//                                easeUser.setAvatar(avatar==null?"":avatar);
//                                easeUser.setNick(nickname==null?chat_uids[i]:nickname);
//                                System.out.println("avator==="+avatar);
//                                System.out.println("nickName==="+avatar);
//                                easeUserList.add(easeUser);
//                            }
//                            if (userInfoInfoCallback!=null){
//                                userInfoInfoCallback.getUserInfo(easeUserList);
//                            }
//                            userDao = new UserDao(context);
//                            userDao.saveContactList(easeUserList);
//                        }else{
//                            if (userInfoInfoCallback!=null){
//                                userInfoInfoCallback.getUserInfo(null);
//                            }
//                            System.out.println("CODE不是ok");
//                        }
//
//                    }else{
//                        System.out.println("请求失败");
//                    }
//                } catch (Exception e) {
//                    e.printStackTrace();
//                }
//                return null;
//            }
//        }.execute();
//    }
//
//}
