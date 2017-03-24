#!/usr/bin/python
# -*- coding: latin-1 -*-
# 最长上升子序列

def lengthOfLIS(nums):
    tails = [0] * len(nums)
    size = 0
    for x in nums:
        i , j = 0, size
        while i != j:
            mid = (i+j)/2
            if(x>tails[mid]):
                i = mid + 1
            else:
                j = mid
        tails[i] = x
        if i == size:
            size += 1
    return size
    
array = [10, 9, 2, 4,5, 3, 7, 101, 18,19]
print lengthOfLIS(array)