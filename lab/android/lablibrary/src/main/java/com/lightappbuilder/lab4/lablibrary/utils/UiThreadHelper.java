package com.lightappbuilder.lab4.lablibrary.utils;

import android.os.Handler;
import android.os.Looper;

import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;
import java.util.concurrent.FutureTask;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

/**
 * Created by yhf on 2015/6/17.
 */
public class UiThreadHelper {

    private static final Thread uiThread;
    private static final Handler uiHandler;

    static {
        Looper mainLooper = Looper.getMainLooper();
        uiThread = mainLooper.getThread();
        uiHandler = new Handler(mainLooper);
    }

    private UiThreadHelper() {

    }

    public static boolean isUiThread() {
        return Thread.currentThread() == uiThread;
    }

    public static void runOnUiThread(Runnable action) {
        if (Thread.currentThread() != uiThread) {
            uiHandler.post(action);
        } else {
            action.run();
        }
    }

    public static void postOnUiThread(Runnable action) {
        uiHandler.post(action);
    }

    public static void postDelayedOnUiThread(Runnable action, long delayMillis) {
        uiHandler.postDelayed(action, delayMillis);
    }

    public static void removeUiHandlerCallbacks(Runnable runnable) {
        uiHandler.removeCallbacks(runnable);
    }

    public static Handler getUiHandler() {
        return uiHandler;
    }

    /**
     * 将任务发送给UI线程执行，并可等待任务执行返回
     * <pre> {@code
     * Future<String> future = UiThreadHelper.runOnUiThreadFuture(new Callable<String>() {
     *      public String call() throws Exception {
     *          // do something ...
     *          return "example";
     *      }
     * });
     * try {
     *      String result = future.get();
     *      // do something ...
     * } catch(Exception e) {
     *      // do something ...
     * }
     * }</pre>
     */
    public static <V> Future<V> runOnUiThreadFuture(Callable<V> callable) {
        if (Thread.currentThread() != uiThread) {
            FutureTask<V> future = new FutureTask<>(callable);
            uiHandler.post(future);
            return future;
        } else {
            try {
                return new FakeFuture<>(callable.call());
            } catch(Exception e) {
                if(e instanceof RuntimeException) {
                    throw (RuntimeException) e;
                }
                throw new RuntimeException(e);
            }
        }
    }

    private static class FakeFuture<V> implements Future<V> {

        private V result;

        public FakeFuture(V result) {
            this.result = result;
        }

        @Override
        public boolean cancel(boolean mayInterruptIfRunning) {
            return false;
        }

        @Override
        public boolean isCancelled() {
            return false;
        }

        @Override
        public boolean isDone() {
            return true;
        }

        @Override
        public V get() throws InterruptedException, ExecutionException {
            return result;
        }

        @Override
        public V get(long timeout, TimeUnit unit) throws InterruptedException, ExecutionException, TimeoutException {
            return result;
        }
    }
}
