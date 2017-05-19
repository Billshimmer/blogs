#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 67

class Solution(object):
    def addBinary(self, a, b):
        if len(a) < len(b):
            a, b = b, a
        size = len(a)
        add = 0
        result = []

        for i in range(1, size + 1, 1):
            curValue = int(a[-i])
            if add == 1:
                curValue = curValue + 1
                add = 0
            if i <= len(b):
                curValue = curValue + int(b[-i])

            add, value = curValue//2, curValue%2
            result = [str(value)] + result

        if add == 1:
            result = [str(add)] + result
        return ''.join(result)

print Solution().addBinary('11111111', '1')
