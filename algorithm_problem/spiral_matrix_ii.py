#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 59

class Solution(object):
    def spiralMatrix(self, n):
        if n == 0:
            return []
        if n == 1:
            return [[1]]
        
        self.Array = [ [ 0 for __ in range(n)] for __ in range(n) ]
        self.Array[0][0] = 1
        self.runInMatrix(0, -1, n-1, 1)
        return self.Array

    def runInMatrix(self, i, j, le, step):
        self.Array[i][j+step] = self.Array[i][j] + 1
        x, y = 0, 0
        if le == 0:
            return 
        while x < le+1:
            x += 1
            j += step
            self.Array[i][j] = self.Array[i][j-step] + 1
        while y < le:
            y += 1
            i += step
            self.Array[i][j] = self.Array[i-step][j] + 1
        self.runInMatrix(i, j, le-1, step*-1)
        
if __name__ == "__main__":
    print(Solution().spiralMatrix(4))