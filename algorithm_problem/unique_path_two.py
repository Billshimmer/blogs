#!/usr/bin/python
# -*- coding: latin-1 -*-

# robot 只能向下或
# 向右走，向右走m步和向下走n步到达终点，有多少种不同的路径
# 棋盘大小为 n+1 * m+1
# 中间存在比如数字为1的位置就是有障碍物不能走
# [
#   [0,0,0],
#   [0,1,0],
#   [0,0,0],
# ]


class Solution(object):
    def uniquePaths(self, obstacleGrid):
        """
        :type m: int
        :type n: int
        :rtype: int
        """
        if obstacleGrid[0][0] == 1:
            return 0
        m = len(obstacleGrid)
        n = len(obstacleGrid[0])

        dp = [[0 for i in range(n)] for j in range(m)]
        dp[0][0] = 1
        for i in range(1, n):
            dp[0][i] = dp[0][i - 1] if obstacleGrid[0][i] == 0 else 0

        for j in range(1, m):
            dp[j][0] = dp[j - 1][0] if obstacleGrid[j][0] == 0 else 0

        for j in range(1, m):
            for i in range(1, n):
                if obstacleGrid[j][i] == 1:
                    dp[j][i] = 0
                else:
                    dp[j][i] = dp[j - 1][i] + dp[j][i - 1]

        return dp[m - 1][n - 1]


a = Solution()
print a.uniquePaths([
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0]
])
