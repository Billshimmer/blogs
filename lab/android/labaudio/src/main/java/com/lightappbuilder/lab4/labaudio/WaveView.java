package com.lightappbuilder.lab4.labaudio;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.util.AttributeSet;
import android.view.View;
import android.view.ViewTreeObserver;

import java.util.LinkedList;

/**
 * Created by tygzx on 16/12/19.
 */

public class WaveView extends View implements ViewTreeObserver.OnGlobalLayoutListener{


    //画柱状图的画笔
    private Paint mBarPaint;

    int barWidth = 100;

    int startBarX = 200;

    int barDivide = 75;

    int maxLevel = 7;

    int maxBarNum =10;

    LinkedList<Integer> barHeightList=new LinkedList<Integer>();

    //测量值 宽度
    private int width;

    //测量值 高度
    private int height;


    public WaveView(Context context) {
        this(context,null);
    }

    public WaveView(Context context, AttributeSet attrs) {
        this(context, attrs,0);
    }

    public WaveView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init(context);
        getViewTreeObserver().addOnGlobalLayoutListener(this);
    }

    private void init(Context context){
        //初始化柱状图画笔
        mBarPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        mBarPaint.setColor(getResources().getColor(android.R.color.white));
        mBarPaint.setStyle(Paint.Style.FILL);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        barWidth=barDivide=(int)(width/maxBarNum/2);
        //画矩形 及 矩形的文字
        for(int i = 0 ; i < barHeightList.size() ; i++){
            canvas.drawRect(
                    startBarX+i*(barWidth + barDivide),
                    height/2 - barHeightList.get(i)/2 ,
                    startBarX+barWidth + i*(barWidth + barDivide),
                    height/2 + barHeightList.get(i)/2 ,
                    mBarPaint);
        }

    }

    public void updateBarHeight(int level){
        if (barHeightList==null){
            barHeightList=new LinkedList<Integer>();
        }
        if (barHeightList.size()==maxBarNum){
            barHeightList.removeFirst();
        }

        int temp=height/maxLevel;
        if (level==0){
            level=1;
        }
        barHeightList.addLast(temp*level);

        postInvalidate();
    }


    public void setMaxBarNum(int maxBarNum) {
        this.maxBarNum = maxBarNum;
    }

    public void setMaxlevel(int maxLevel){
        this.maxLevel=maxLevel;
    }


    @Override
    public void onGlobalLayout() {
        height=getMeasuredHeight()-getPaddingTop()-getPaddingBottom();
        width=getMeasuredWidth()-getPaddingLeft()-getPaddingRight();
        startBarX=getPaddingLeft();
        getViewTreeObserver().removeOnGlobalLayoutListener(this);
    }

}
