#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 81


class Solution(object):
    def searchSortedArray(self, nums, target):
        if len(nums) == 0:
            return False
        
        length = len(nums)
        left, right = 0, length-1

        while left <= right:
            mid = left + (right-left) // 2
            print left, right
            if nums[mid] == target :
                return True
            if nums[mid] > nums[left]:
                if nums[left] <= target and nums[mid] >= target:
                    right = mid - 1
                else:
                    left = mid + 1
            elif nums[mid] < nums[left]:
                if nums[right] >= target and nums[mid] <= target:
                    left = mid + 1
                else:
                    right = mid - 1
            else:
                left += 1

                
        return False

print Solution().searchSortedArray([1,3,1,1,1], 3)