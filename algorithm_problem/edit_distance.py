#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 72


class Solution(object):
    def editDistance(self, word1, word2):

        m = len(word1)
        n = len(word2)

        dp = [[0 for __ in range(m + 1)] for __ in range(n + 1)]

        for i in range(m + 1):
            dp[0][i] = i
        for j in range(n + 1):
            dp[j][0] = j

        if word1 == '': return dp[len(word2)][0]
        if word2 == '': return dp[0][len(word1)]

        for i in range(1, n + 1):
            for j in range(1, m + 1):
                add = 1 if word2[i - 1] != word1[j - 1] else 0

                dp[i][j] = min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + add)
            

        return dp[n][m]


print Solution().editDistance("faf", "efef") == 2
print Solution().editDistance("", "a") == 1
print Solution().editDistance("a", "") == 1

print Solution().editDistance("sea", "ate")
print Solution().editDistance("a", "b")