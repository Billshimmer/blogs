#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 51

class Solution(object):
    def solveQueen(self, n):
        xy_dif, xy_sum, queens = [], [], []
        res = []
        self.dfs(queens, xy_dif, xy_sum, res, n)
        res = [ [ '.'*i + 'Q' + '.'*(n-i-1) for i in sol ] for sol in res ]
        return res

    def dfs(self, queens, xy_dif, xy_sum, res, n):
        j = len(queens)
        if j == n:
            res.append(queens)
            return None
        for i in range(n):
            if i - j not in xy_dif and i + j not in xy_sum and i not in queens:
                self.dfs(queens+[i], xy_dif+[i-j], xy_sum+[i+j], res, n)

if __name__ == "__main__":
    print(Solution().solveQueen(8))
