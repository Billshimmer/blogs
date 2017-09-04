#-*- coding:utf-8 -*-

# leetcode 634


class Solution():
    def findDerangement(self, n):
        MOD = 1000000000 + 7;
        dp = [0, 0, 1]
        if n<=2: return dp[n]
        for i in range(3, n+1):
            cur = (dp[i-1]+dp[i-2])%MOD
            cur = (cur * (i-1))%MOD
            dp.append(cur)
        return dp[-1]

if __name__ == "__main__":
    print Solution().findDerangement(4)