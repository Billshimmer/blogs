#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 80

class Solution(object):
    def removeDuplicates(self, nums):
        count = 0
        for i in range(len(nums)):
            if count < 2 or nums[count-2] != nums[i]:
                nums[count] = nums[i]
                count += 1
        return count

print Solution().removeDuplicates([1,1,1,2,2,3])