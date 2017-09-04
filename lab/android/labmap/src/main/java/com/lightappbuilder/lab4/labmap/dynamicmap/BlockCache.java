package com.lightappbuilder.lab4.labmap.dynamicmap;

import android.util.LruCache;

/**
 * Created by yinhf on 2016/12/27.
 */

public class BlockCache {
    private static final String TAG = "BlockCache";

    private static final int MAX_CACHE_SIZE = 2048;
    private LruCache<Integer, BlockData> blockDataCache = new LruCache<Integer, BlockData>(MAX_CACHE_SIZE) {
        @Override
        protected int sizeOf(Integer key, BlockData value) {
            return value.count() + 1;
        }
    };

    public BlockCache() {

    }

    public void put(BlockData blockData) {
        blockDataCache.put(blockData.id, blockData);
    }

    public BlockData get(int blockId) {
        return blockDataCache.get(blockId);
    }

    public void clear() {
        blockDataCache.evictAll();
    }

}
