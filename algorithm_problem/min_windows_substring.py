#!/usr/bin/python
# -*- coding: latin-1 -*-
from collections import defaultdict
# leetcode 76


class Solution(object):
    def minWindow(self, s, t):
        """
        :type s: str
        :type t: str
        :rtype: str
        """
        MAX_INT = 2147483647
        start, end = 0, 0
        min_length = MAX_INT
        min_start = 0
        count_need = len(t)
        char_need = defaultdict(int)

        for i in t :
            char_need[i] -= 1

        while end < len(s):
            if s[end] in t and char_need[s[end]] < 0:
                count_need -= 1
            char_need[s[end]] += 1
            end += 1

            while count_need == 0:

                min_start = start if end - start < min_length else min_start
                min_length = end - start if end - start < min_length else min_length
                
                char_need[s[start]] -= 1
                if s[start] in t and char_need[s[start]] < 0:
                    count_need += 1
                start += 1

        return '' if min_length == MAX_INT else s[min_start:min_start + min_length]

print Solution().minWindow("ADOBECODEBANC", 'ABC')
