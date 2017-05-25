#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 73

class Solution(object):
    def setMatrixZeroes(self, matrix):

        m = len(matrix)
        n = len(matrix[0])
        checked_m = [True for __ in range(m)]
        checked_n = [True for __ in range(n)]

        for i in range(m):
            for j in range(n):
                if matrix[i][j] == 0:
                    checked_m[i], checked_n[j] = False, False
                    break

        for i in range(0, m, 1):
            for j in range(0, n, 1):
                if checked_m[i] == False or checked_n[j] == False:
                    matrix[i][j] = 0

        return matrix

print Solution().setMatrixZeroes(
    [
        [1, 0, 1, 1],
        [1, 1, 0, 1],
        [1, 1, 1, 0],
        [1, 1, 1, 1]
    ]
)