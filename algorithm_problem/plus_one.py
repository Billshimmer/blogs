#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 66


class Solution(object):
    def plusOne(self, digits):

        size = len(digits)
        if size == 0: return [1]
        Index = size - 1
        add = True

        while Index >= 0:
            if add == True:
                digits[Index] += 1
                add = False
                if digits[Index] == 10:
                    add = True
                    digits[Index] = 0
            Index -= 1
            
        if add == True:
            digits = [1] + digits

        return digits


print Solution().plusOne([2, 9, 9, 9, 9])
