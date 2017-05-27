#!/usr/bin/python
# -*- coding: latin-1 -*-
import copy
# leetcode 78


class Solution(object):
    result = [[]]

    def subsets(self, nums):
        """
        :type nums: List[int]
        :rtype: List[List[int]]
        """
        result = [[]]
        for num in sorted(nums):
            result += [item + [num] for item in result]
        return result


print Solution().subsets([1, 2, 3])
