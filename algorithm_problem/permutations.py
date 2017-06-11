#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 46


class Solution(object):
    def getPermutation(self, nums):
        length = len(nums)
        if length == 0:
            return [[]]
        if length == 1:
            return [nums]

        nums.sort()
        stack = nums[1:length]
        res = [[nums[0]]]
        while len(stack) > 0:
            insertNum = stack.pop(0)
            newRes = []
            for item in res:
                for i in range(0, len(item)+1, 1):
                    curArray = item[:i] + [insertNum] + item[i:]
                    newRes.append(curArray)
            res = newRes

        return res



if __name__ == "__main__":
    print(Solution().getPermutation(
        [1, 2, 3]
    ))