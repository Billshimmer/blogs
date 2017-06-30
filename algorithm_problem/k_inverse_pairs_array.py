#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 629


class Solution(object):
    def inverse_pairs_array(self, n, k):
        # dp[n][k] 由1～n组成的数组有k对inverse_pairs的值
        mo = 1000000007
        if k == 0: return 1
        dp = [[0 for __ in range(k + 1)] for __ in range(n + 1)]
        dp[1][0] = 1

        for i in range(2, n + 1):
            dp[i][0] = 1
            for j in range(1, k + 1):
                dp[i][j] = (dp[i-1][j] + dp[i][j-1])%mo
                if j>=i:
                    dp[i][j] = (dp[i][j] - dp[i-1][j]+mo)%mo
        print dp
        return dp[n][k]


if __name__ == "__main__":
    print Solution().inverse_pairs_array(3, 2)