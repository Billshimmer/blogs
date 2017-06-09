#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 58

class Solution(object):
    def lengthOfLastWord(self, s):
        length = len(s)
        if length == 0:
            return 0
        sindex, eindex, i = 0, 0, 0
        while i < length:
            sindex, eindex = i, i
            while i < length and s[i].isalpha():
                eindex = i
                i += 1 

            while i < length and s[i] == ' ':
                i += 1   
        print sindex, eindex
        return eindex - sindex + 1

if __name__ == "__main__":
    print(Solution().lengthOfLastWord("Hello World"))