#-*- coding:utf-8 -*-

# leetcode 29

class Solution():
    def divideTwoIntegers(self, dividend, divisor):
        MAX_INT = 2147483647
        flag = 1
        if (dividend<0 and divisor>0) or (dividend>0 and divisor<0): flag = -1
        
        divisor = abs(divisor)
        dividend = abs(dividend)
        if dividend == 0: return 0
        if divisor > dividend: return 0

        result = 0
        cur = divisor
        curRes = 1
        while cur <= dividend:
            cur += cur
            curRes += curRes
        
        while divisor <= dividend:
            cur >>= 1
            curRes >>= 1
            if cur <= dividend:
                dividend -= cur
                result += curRes

        return min(result*flag, MAX_INT)


if __name__ == "__main__":
    print Solution().divideTwoIntegers(5, -1)
    print Solution().divideTwoIntegers(5, -2) 