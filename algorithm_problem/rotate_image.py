#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 48

class Solution(object):
    def rotate(self, matrix):
        """
        :type matrix: List[List[int]]
        :rtype: void Do not return anything, modify matrix in-place instead.
        """
        length = len(matrix)
        if length == 0 or length == 1:
            return matrix
        newMatrix = [ [ 0 for __ in range(length) ] for __ in range(length) ]
        for i in range(length):
            for j in range(length):
                newMatrix[j][length-i-1] = matrix[i][j]

        for i in range(length):
            for j in range(length):
                matrix[i][j] = newMatrix[i][j]

        return matrix

if __name__ == "__main__":
    print(Solution().rotate(
        [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
    ))