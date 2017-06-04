#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 90


class Solution(object):
    def subsetsWithDup(self, nums):
        if len(nums) == 0:
            return None

        res = [[]]
        nums.sort()
        for item in nums:
            res = res + [ [item] + i for i in res if  [item] + i not in res ]

        return res


if __name__ == "__main__":
    print(Solution().subsetsWithDup([4,4,4,1,4]))