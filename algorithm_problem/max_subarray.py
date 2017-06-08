#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 53

class Solution(object):
    def maxSubarray(self, nums):
        length = len(nums)

        if length == 1:
            return nums[0]
        sum = [ 0 for __ in range(length) ]
        sum[0] = nums[0]
        for i in range(1, length, 1):
            if sum[i-1] <= 0:
                sum[i] = nums[i]
            else:
                sum[i] = nums[i] + sum[i-1]
            
        sum.sort()

        return sum[length-1]
    
if __name__ == "__main__":
    print(Solution().maxSubarray([-2,1,-3,4,-1,2,1,-5,4]))