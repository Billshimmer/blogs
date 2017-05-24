#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 69


class Solution(object):
    def sqrt(self, x):
        exp = 0.1
        result = 1.0
        while abs(result * result - x) > exp:
            result = result / 2 + x / result / 2
        return int(result)


print Solution().sqrt(10)
