#-*- coding:utf-8 -*-

# leetcode 42
class Solution(object):
    def trapRainWater(self, height):
        if not height: return 0
        length = len(height)
        result = 0
        h = [ 0 for __ in range(length)]
        h[length-1] = height[length-1]
        for i in range(length-2, -1, -1):
            maxR = h[i+1]
            h[i] = max(maxR, height[i])
        
        curL = height[0]
        for i in range(1, length-1):
            maxL = curL
            curL = max(maxL, height[i])
            result = result + min(h[i], curL) - height[i]
        
        return result



if __name__ == "__main__":
    print Solution().trapRainWater([2, 0, 2])