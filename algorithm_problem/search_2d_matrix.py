#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 74


class Solution(object):
    def searchMatrix(self, target, matrix):

        if len(matrix) == 0:
            return False
        if len(matrix[0]) == 0:
            return False

        m, n = len(matrix), len(matrix[0])
        l, h = 0, m * n - 1

        while l <= h:
            mid = l + (h - l) // 2
            if matrix[mid // n][mid % n] == target:
                return True
            elif matrix[mid // n][mid % n] < target:
                l = mid + 1
            else:
                h = mid - 1
        return False


print Solution().searchMatrix(
    0,
    [[1, 1]]
)
