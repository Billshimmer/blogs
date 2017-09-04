package com.lightappbuilder.lab4.lablibrary.startpagemgr;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v4.view.PagerAdapter;
import android.support.v4.view.ViewPager;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.ImageView;

import com.lightappbuilder.lab4.lablibrary.R;
import com.rd.PageIndicatorView;

/**
 * Created by yinhf on 16/1/8.
 */
public class LABGuideFragment extends Fragment {
    private static final String TAG = "LABGuideFragment";

    public interface OnHideListener {
        void onHideGuide();
    }

    public static LABGuideFragment newInstance(YDPage ydPage) {
        LABGuideFragment frag = new LABGuideFragment();
        frag.ydPage = ydPage;
        return frag;
    }

    private YDPage ydPage;
    private ViewPager viewPager;
//    private PageIndicator mIndicator;

    private OnHideListener mOnHideListener;

    public void setOnHideListener(OnHideListener onHideListener) {
        this.mOnHideListener = onHideListener;
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_lab_guide, container, false);
    }

    @Override
    public void onViewCreated(View view, @Nullable Bundle savedInstanceState) {
        if (ydPage.bgImgResId > 0) {
            FrameLayout container = (FrameLayout) view.findViewById(R.id.guide_container);
            container.setBackgroundResource(ydPage.bgImgResId);
        }
        viewPager = (ViewPager) view.findViewById(R.id.pager);
        viewPager.setOffscreenPageLimit(3);
        MyAdapter adapter = new MyAdapter();
        viewPager.setAdapter(adapter);

//        PageIndicatorView indicator = (PageIndicator) view.findViewById(R.id.indicator);
//        indicator.setViewPager(viewPager);

        PageIndicatorView indicator = (PageIndicatorView) view.findViewById(R.id.indicator);
        indicator.setCount(adapter.getCount());
        indicator.setViewPager(viewPager);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        //picasso.cancelTag(this);
    }

    private class MyAdapter extends PagerAdapter implements View.OnClickListener {

        @Override
        public int getCount() {
            return ydPage.imgResIds != null ? ydPage.imgResIds.length : ydPage.imgUris.length;
        }

        @Override
        public boolean isViewFromObject(View view, Object object) {
            return view == object;
        }

        @Override
        public Object instantiateItem(ViewGroup container, int position) {
            ImageView imageView = new ImageView(getActivity());
            if(position == getCount() - 1) {
                imageView.setOnClickListener(this);
            }
            imageView.setScaleType(ImageView.ScaleType.CENTER_CROP);
            imageView.setImageResource(ydPage.imgResIds[position]);
//            RequestCreator requestCreator;
//            if(ydPage.imgResIds != null) {
//                requestCreator = picasso.load(ydPage.imgResIds[position]);
//            } else {
//                requestCreator = picasso.load(ydPage.imgUris[position]);
//            }
//            requestCreator.memoryPolicy(MemoryPolicy.NO_STORE).tag(LABGuideFragment.this).into(imageView);
            container.addView(imageView, -1, -1);
            return imageView;
        }

        @Override
        public void destroyItem(ViewGroup container, int position, Object object) {
            container.removeView((View) object);
        }

        @Override
        public void onClick(View v) {
            if(mOnHideListener != null) {
                mOnHideListener.onHideGuide();
            }
        }
    }

}
