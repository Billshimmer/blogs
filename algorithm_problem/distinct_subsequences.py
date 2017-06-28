#-*- coding:utf-8 -*-

# leetcode 115

class Solution(object):
    def numDistinct(self, s, t):
        n, m = len(s), len(t)
        dp = [ [0 for __ in range(m+1)] for __ in range(n+1) ]
        for i in range(n+1): dp[i][0] = 1
        for i in range(1, n+1):
            for j in range(1, m+1):
                if i >= j:
                    if s[i-1] == t[j-1]:
                        dp[i][j] = dp[i-1][j-1] + dp[i-1][j]
                    else:
                        dp[i][j] = dp[i-1][j]
        
        return dp[n][m]
    
if __name__ == "__main__":
    print Solution().numDistinct('c', 'c')