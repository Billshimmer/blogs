#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 70

class Solution(object):
    def climbStairs(self, n):
        if n == 1:
            return 1
        if n == 2:
            return 2
        
        dp = [ 0 for __ in range(n) ]
        dp[0] = 1
        dp[1] = 2

        for i in range(2, n, 1):
            dp[i] = dp[i-1] + dp[i-2]
        
        return dp[n-1]


print Solution().climbStairs(19)