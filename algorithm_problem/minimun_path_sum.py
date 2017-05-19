#!/usr/bin/python
# -*- coding: latin-1 -*-

# robot 只能向下或
# 向右走，求各个路径的最小数字之和
# 输入: [ [1, 2, 4], [2, 4, 1], [3, 2, 1] ]
# 输出: 9


class Solution(object):
    def minPathSum(self, numberGrid):
        m = len(numberGrid)
        n = len(numberGrid[0])

        sp = [[0 for i in range(n)]for j in range(m)]
        sp[0][0] = numberGrid[0][0]

        for i in range(1, m):
            sp[i][0] = sp[i - 1][0] + numberGrid[i][0]
        for j in range(1, n):
            sp[0][j] = sp[0][j - 1] + numberGrid[0][j]

        for j in range(1, m):
            for i in range(1, n):
                sp[j][i] = min(sp[j - 1][i], sp[j][i - 1]) + numberGrid[j][i]

        return sp[m - 1][n - 1]


a = Solution()
print a.minPathSum(
    [
        [1,2],
        [5,6],
        [1,1]
    ]
)
