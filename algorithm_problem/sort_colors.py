#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 75

class Solution(object):
    def sortColor(self, nums):  
        left, mid = 0, 0
        right = len(nums) - 1

        while mid <= right:
            if nums[mid] == 0:
                nums[left], nums[mid] = nums[mid], nums[left]
                left += 1
                mid += 1
            elif nums[mid] == 1:
                mid += 1
            elif nums[mid] == 2:
                nums[right], nums[mid] = nums[mid], nums[right]
                right -= 1
            
            print nums, left, mid, right


nums = [1, 2, 1, 2, 0, 2, 1, 0, 2, 0, 0, 2]

Solution().sortColor(nums)

print nums