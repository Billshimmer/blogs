#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 85


class Solution(object):
    def maxRectangle(self, matrix):
        if len(matrix) == 0 or len(matrix[0]) == 0:
            return 0

        n = len(matrix[0])
        heights = [0 for __ in range(n + 1)]
        result = 0

        for row in matrix:
            for i in range(n):
                heights[i] = heights[i] + 1 if row[i] == '1' else 0

            stack = [-1]
            for i in range(n + 1):
                while heights[i] < heights[stack[-1]]:
                    h = heights[stack.pop()]
                    w = i - stack[-1] - 1
                    result = max(result, w * h)
                stack.append(i)

        return result


print Solution().maxRectangle(
    [
        "10100",
        "10111",
        "11111",
        "10010"
    ]
)
