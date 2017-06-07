#!/usr/bin/python
# -*- coding: latin-1 -*-

# 给定一个字符串,至少插入多少个字符才能使之成为一个回文字符

class Solution(object):

    def insertChar(self, s):
        length = len(s)
        if length == 0 or length == 1: return 0
        dp = [[0 for __ in range(length + 1)] for __ in range(length + 1)]

        for j in range(length+1):
            dp[j][0] = 1
        for j in range(2, length+1):
            for i in range(0, length+1):
                if i+1 > j-1:
                    dp[i][j] = 0
                elif i+1 <= length and j-1 >= 0:
                    dp[i][j] = dp[i+1][j-1] if s[i] == s[j] else min(dp[i+1][j], dp[i][j-1]) + 1

        return dp[1][length]

if __name__ == "__main__":
    print(Solution().insertChar('aaaabbbbb'))
