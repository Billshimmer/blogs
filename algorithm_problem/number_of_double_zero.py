#!/usr/bin/python
# -*- coding: latin-1 -*-

# 二进制码变换

# 对一个“01”串进行一次μ变换被定义为：
# 将其中的”0″变成”10″，”1″变成”01″，初始串为”1″，
# 求经过N(N <= 1000)次μ变换后的串中有多少对”00″
# （有没有人会纠结会不会出现”000″的情况？这个请放心，由于问题的特殊性，不会出现”000″的情况）
# 。图一 -1-7表示经过小于4次变换时串的情况


class Solution(object):
    def numberOfDoubleZero(self, n):
        A = [0]
        B = [0]
        for i in range(1, n+1):
            curA = A[i-1] + B[i-1]
            curB = A[i-1] + B[i-1] + i%2
            A.append(curA)
            B.append(curB)
        
        return B[n-1]

if __name__ == "__main__":
    print(Solution().numberOfDoubleZero(100))
 