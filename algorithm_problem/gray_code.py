#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 89


class Solution(object):
    def grayCode(self, n):
        if n == 0:
            return [0]
        if n == 1:
            return [0, 1]
        res = [0, 1]
        for i in range(1, n):
            res = res + [ __ + (1<<i) for __ in range(len(res)-1, -1, -1)]
        return res

    def otherGrayCode(self, n):
        size = 1 << n
        res = []
        for i in range(size):
            res.append(i>>1 ^ i)
        return res


print(Solution().grayCode(4))
print(Solution().otherGrayCode(4))