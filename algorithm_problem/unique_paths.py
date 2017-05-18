#!/usr/bin/python
# -*- coding: latin-1 -*-

# robot 只能向下或
# 向右走，向右走m步和向下走n步到达终点，有多少种不同的路径
# 棋盘大小为 n+1 * m+1

class Solution(object):
    def uniquePaths(self, m, n):
        """
        :type m: int
        :type n: int
        :rtype: int
        """
        small, large = min(m, n), max(m, n)
        allFac = self.fac(m + n - small, m + n)
        smallFac = self.fac(1, small)

        return allFac / smallFac

    def fac(self, l, r):
        num, result = r, 1
        while num > l:
            result = result * num
            num -= 1
        
        return result


a = Solution()
print a.uniquePaths(1, 2)
