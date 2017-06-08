#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 55


class Solution(object):
    def jumpGame(self, nums):
        length = len(nums)
        if length == 0:
            return False
        reachIndex = 0
        for i in range(length):
            if i > reachIndex:
                break;
            reachIndex = max(i+nums[i], reachIndex)
        
        return reachIndex >= length-1

if __name__ == "__main__":
    print(Solution().jumpGame([3,2,2,0,4]))
    print(Solution().jumpGame([2,3,1,1,4]))
    print(Solution().jumpGame([2,0,0]))