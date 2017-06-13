#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 10


class Solution(object):
    def isMatch(self, s, p):
        ls, lp = len(s), len(p)
        dp = [[False for __ in range(lp + 1)] for __ in range(ls + 1)]
        dp[0][0] = True
        for j in range(2, lp):
            if p[j-1] == '*':
                dp[0][j] = dp[0][j-2]
        
        for i in range(1, ls+1):
            for j in range(1, lp+1):
                if p[j-1] == '.':
                    dp[i][j] = dp[i-1][j-1]
                elif p[j-1] == '*':
                    if dp[i][j-2] or dp[i][j-1] or ( ( p[i-2] == '.' or p[i-2] == s[i-1] ) and dp[i-1][j]):
                        dp[i][j] = True
                elif p[j-1] == s[i-1]:
                    dp[i][j] = dp[i-1][j-1]
        return dp[i][j]


if __name__ == "__main__":
    print(Solution().isMatch('aa', 'ab'))