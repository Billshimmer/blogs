#!/usr/bin/python
# -*- coding: latin-1 -*-

# 一只母牛，第二年底生一只母牛和一只公牛，第三年底生一只母牛 ，第五年开始母牛会死。
# 公牛也只能活四年。请问一个农场开始只有一只刚出生的母牛，N年后一共有多少只牛。

class Solution(object):
    def numOfCow(self, num):
        print self.cowrecursion(num)


    def cowrecursion(self, num):
        if num == 1:
            return 1
        elif num == 2:
            return 2 + self.cowrecursion(1)
        elif num == 3:
            return 2 + self.cowrecursion(2) + self.cowrecursion(1)
        elif num == 4:
            return 2 + self.cowrecursion(3) + self.cowrecursion(2)
        elif num == 5:
            return self.cowrecursion(4) + self.cowrecursion(3)
        elif num > 5:
            return self.cowrecursion(num-1) + self.cowrecursion(num-2)



Solution().numOfCow(5)