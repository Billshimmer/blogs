#-*- coding:utf-8 -*-
# 给定一个数组找出第一个missing的正整数，例如[1,2,0] return 3 ; [-1,2,3] return 1

class Solution(object):
    def firstMissingPositive(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        nums = [nums[i] for i in range(len(nums)) if nums[i] > 0]
        if len(nums) == 0 : return 1
        nums = list(set(nums))
        nums.sort()
        for i in range(0, len(nums), 1):
            if nums[i] != i+1: return i+1
        return len(nums) + 1

s = Solution().firstMissingPositive([0,2,2,1,1])
print s