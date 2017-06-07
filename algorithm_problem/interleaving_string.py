#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 97


class Solution(object):
    def isInterleave(self, s1, s2, s3):
        m, n = len(s1), len(s2)
        if len(s3) != m + n:
            return False
        dp = [[False for _ in range(n + 1)] for _ in range(m + 1)]

        for i in range(m+1):
            for j in range(n+1):
                if i==0 and j==0:
                    dp[i][j] = True
                elif i==0:
                    dp[i][j] = dp[i][j-1] and s2[j-1] == s3[i+j-1]
                elif j==0:
                    dp[i][j] = dp[i-1][j] and s1[i-1] == s3[i+j-1]
                else:
                    dp[i][j] = (dp[i-1][j] and s1[i-1] == s3[i+j-1]) or (dp[i][j-1] and s2[j-1] == s3[i+j-1])
        print dp
        return dp[m][n]


if __name__ == "__main__":
    print(Solution().isInterleave('aa', 'bb', 'aabb'))