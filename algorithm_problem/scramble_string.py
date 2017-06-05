#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 87


class Solution(object):
    def isScramble(self, s1, s2):

        if len(s1) != len(s2):
            return False
        if s1 == s2:
            return True
        if len(s1) == 0:
            return True

        
        return False