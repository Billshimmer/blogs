#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 60

class Solution(object):
    def getPermutation(self, n, k):
        k -= 1
        string = ''
        factori = self.fac(n-1)
        array = [ i for i in range(1, n+1)]
        print array
        for i in range(n-1, 0, -1):
            curVal = k // factori
            string += str(array[curVal])
            array = array[:curVal] + array[curVal+1:]
            factori, k = factori // i, k % factori
        
        return string + str(array[0])
    
    
    def fac(self, n):
        fac = 1
        while n > 1:
            fac *= n
            n -= 1
        return fac
        


if __name__ == "__main__":
    print(Solution().getPermutation(
        2, 1
    ))