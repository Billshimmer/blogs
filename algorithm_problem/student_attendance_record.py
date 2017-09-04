#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 552


class Solution(object):
    def studentRecord(self, n):
        if n == 1: return 3
        poss = [1, 2, 4]
        result = 0

        for i in range(2, n):
            poss.append((poss[i] + poss[i-1] + poss[i-2]) % 1000000007 )
        result = poss[n]
        for i in range(n):
            result = (result + poss[i]*poss[n-i-1]) % 1000000007
        
        return result


if __name__ == "__main__":
    print Solution().studentRecord(2)