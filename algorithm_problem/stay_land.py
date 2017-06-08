#!/usr/bin/python
# -*- coding: latin-1 -*-

# 三个小岛，编号1、2、3，老王第0天在1号岛上。这些岛有一些奇怪的规则，
# 每过1天，1号岛上的人必须进入2、3号岛；
#         2号岛上的人必须进入1号岛；
#         3号岛上的人可以前往1、2或留在3号岛。
# 问第n(n <= Math.pow(10, 9))天老王在到达1号岛的行走方案，由于数据比较大，只需要输出 ans MOD 100000007的值即可

class Solution(object):
    def stayLand(self, day):
        dp = [[ 0 for i in range(4)] for __ in range(day+1)]
        dp[0][1] = 1
        for i in range(1, day+1):
            for j in range(1, 4):
                if j == 1:
                    dp[i][j] = dp[i-1][2] + dp[i-1][3]
                elif j == 2:
                    dp[i][j] = dp[i-1][1] + dp[i-1][3]
                elif j == 3:
                    dp[i][j] = dp[i-1][1] + dp[i-1][3] 

        print dp
        return dp[day][1]

if __name__ == "__main__":
    print(Solution().stayLand(100))
