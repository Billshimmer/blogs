#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 600

class Solution(object):
    def findIntegers(self, num):
        if num == 0: return 1
        if num == 1: return 2
        dp = [ 0 for i in range(num+1)]
        dp[0], dp[1]= 1, 2
        for i in range(2, num+1):
            dp[i] = dp[i-1] + self.isValid(i)
        
        return dp[num]

    def isValid(self, num):
        pre = 0
        cur = num
        while cur != 0:
            if cur & pre == 1:
                return 0
            pre = cur & 1
            cur = cur >> 1
        
        return 1
    
    def answer(self, num):
        dp = [1, 2]
        for i in range(2, 32):
            dp.append(dp[i-1]+dp[i-2])
        
        bnum = bin(num)[2:]
        size = len(bnum)
        result = dp[size]
        for bitx in range(1, size):
            if bnum[bitx] == bnum[bitx-1] == '1':
                break
            if bnum[bitx] == bnum[bitx-1] == '0':
                result -= dp[size-bitx] - dp[size-bitx-1]
        return result
        
if __name__ == "__main__":
    print(Solution().answer(21))