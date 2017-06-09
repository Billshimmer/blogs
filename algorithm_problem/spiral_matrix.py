#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 54

class Solution(object):
    def spiralMatrix(self, matrix):
        if len(matrix) == 0:
            return []
        if len(matrix) == 1:
            return matrix[0]
        res = []
        self.runInMatrix(matrix, res, 1)
        
        return res
        
    def runInMatrix(self, matrix, res, step):
        if len(matrix) == 0: return
        if step == 1:
            curArray = matrix.pop(0)
            for i in range(len(curArray)):
                res.append(curArray[i])
            for j in range(len(matrix)):
                res.append(matrix[j].pop(-1))
        else:
            curArray = matrix.pop(-1)
            for i in range(len(curArray)-1, -1, -1):
                res.append(curArray[i])
            for j in range(len(matrix)-1, -1, -1):
                res.append(matrix[j].pop(0))
        self.runInMatrix(matrix, res, step*-1)


if __name__ == "__main__":
    print(Solution().spiralMatrix(
        [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]]
    ))