#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 91


class Solution(object):
    def decodeWays(self, s):
        length = len(s)
        dp = [ 0 for i in range(length+1)]
        dp[length] = 1
        dp[length-1] = 1 if s[length-1] != '0' else 0

        for i in range(length-2, -1, -1):
            if s[i] != '0':
                dp[i] = dp[i+1] + dp[i+2] if int(s[i:i+2]) <= 26 else dp[i+1]
            print dp
        return dp[0]


if __name__ == "__main__":
    print(Solution().decodeWays('110111'))