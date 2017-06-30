#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 576
import time

class Solution(object):
    def findPaths(self, m, n, N, i, j):
        self.m, self.n = m, n
        self.result = 0
        self.runInMatrix(N, i, j)
        return self.result

    def runInMatrix(self, n, i, j):
        if n>=1:
            if i == 0: self.result += 1
            if i == self.m-1: self.result += 1
            if j == 0: self.result += 1
            if j == self.n-1: self.result += 1
            
            if i-1 >= 0:
                self.runInMatrix(n-1, i-1, j)
            if i+1 <= self.m-1:
                self.runInMatrix(n-1, i+1, j)
            if j-1 >= 0:
                self.runInMatrix(n-1, i, j-1)
            if j+1 <= self.n-1:
                self.runInMatrix(n-1, i, j+1)
        else:
            return
        

if __name__ == "__main__":
    t = time.time()
    print Solution().findPaths(10, 10, 11, 5, 5)
    print time.time() - t