#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 51


class Solution(object):
    def cardMatch(self, s, p):
        ls, lp = len(s), len(p)
        dp = [[False for __ in range(lp+1)] for __ in range(ls+1)]
        dp[0][0] =  True
        for j in range(2, lp+1):
            if p[j-1] == '*':
                dp[0][j] = dp[0][j-2]
            
        for i in range(1, ls+1):
            for j in range(1, lp+1):
                if p[j-1] == '?':
                    dp[i][j] = dp[i-1][j-1]
                elif p[j-1] == '*':
                    if dp[i][j-1] or dp[i][j-2] or ( (p[j-2] == '?' or p[j-2] == s[i-1]) and dp[i-1][j]):
                        dp[i][j] = True
                elif p[j-1] == s[i-1]:
                    dp[i][j] = dp[i-1][j-1]
        
        return dp[ls][lp]

if __name__ == "__main__":
    print(Solution().cardMatch('aa', 'a'))
    print(Solution().cardMatch('aa', 'aa'))
    print(Solution().cardMatch('aa', 'aaa'))
    print(Solution().cardMatch('aa', 'a*'))
    print(Solution().cardMatch('aa', '?*'))
    print(Solution().cardMatch('aab', 'a*b'))
    print(Solution().cardMatch('aab', 'c*a*b'))
