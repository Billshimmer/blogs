#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 17

class Solution(object):
    def letterCombinations(self, digits):
        self.digit2letters = {
            '2': "abc",
            '3': "def",
            '4': "ghi",
            '5': "jkl",
            '6': "mno",
            '7': "pqrs",
            '8': "tuv",
            '9': "wxyz",
        }
        if not digits: return []
        res = []
        self.dfs(digits, '', res)
        return res
    
    def dfs(self, digits, curStr, res):
        if not digits:
            res.append(curStr)
            return None
        for char in self.digit2letters[digits[0]]:
            self.dfs(digits[1:], curStr + char, res)

if __name__ == "__main__":
    print(Solution().letterCombinations('23'))