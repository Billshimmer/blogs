#!/usr/bin/python
# -*- coding: latin-1 -*-

# 给定一个字符串,至少插入多少个字符才能使之成为一个回文字符
# 在这个问题中需要理解dp[i][j]代表的是第i个字符到第j个字符成为回文字符的最少插入操作数
# 状态可以转移为dp[i+1][j]和dp[i][j-1]的比较，即i+1=>j字符前插入s[j] 或者i=>j-1字符后插入s[i]

class Solution(object):

    def insertChar(self, s):
        length = len(s)
        if length == 0 or length == 1: return 0
        dp = [[0 for __ in range(length + 1)] for __ in range(length + 1)]
        for i in range(length+1):
            dp[i][0] = 0
        for j in range(1, length+1, 1):
            for i in range(length, 0, -1):
                print i, j
                if i >= j:
                    dp[i][j] = 0
                else:
                    dp[i][j] = dp[i+1][j-1] if s[i-1] == s[j-1] else min(dp[i+1][j], dp[i][j-1]) + 1

        return dp[1][length]

if __name__ == "__main__":
    print(Solution().insertChar('aabbba'))
