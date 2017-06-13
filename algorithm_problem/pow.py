#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 50

class Solution(object):
    def myPow(self, x, n):
        flag = -1 if n < 0 else 1
        n = abs(n)
        res = 1
        while n > 0:
            if n & 1 == 1:
                res *= x
            n >>= 1
            x *= x
        
        print 1/res, res
        res = res if flag == 1 else 1/res
        
        return res

if __name__ == "__main__":
    print(Solution().myPow(2, 3))