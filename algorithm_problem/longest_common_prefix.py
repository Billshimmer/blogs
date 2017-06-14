#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 14

class Solution(object):
    def longestCommonPrefix(self, strs):
        length = len(strs)
        if length == 0: return ''
        prefix = strs[0]
        for i in range(1, length):
            j = 0
            while j < len(strs[i]) and j < len(prefix) and prefix[j] == strs[i][j]:
                j += 1
            prefix = prefix[:j]
            
        return prefix

if __name__ == "__main__":
    print(Solution().longestCommonPrefix(["hello", "heabc", "hewww"] ))