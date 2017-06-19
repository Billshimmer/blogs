#-*- coding:utf-8 -*-
# 给定一个数组找出第一个missing的正整数，例如[1,2,0] return 3 ; [-1,2,3] return 1

class Solution(object):
    def firstMissingPositive(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        length = len(nums)
        if length == 0: return 1
        for i in range(length):
            target = nums[i]
            while target <= length and target-1 >= 0 and nums[target-1] != target:
                new_target = nums[target-1]
                nums[target-1] = target
                target = new_target
                print target
        print nums
        for i in range(length):
            if nums[i] != i + 1:
                return i + 1
        return length + 1

s = Solution().firstMissingPositive([2, 1])
print s