#-*- coding:utf-8 -*-

# leetcode 20

class Solution(object):
    def isValid(self, s):
        length = len(s)
        if length == 0 or length == 1: return False
        index = 0
        stack = []
        while index < length:
            if s[index] == '(' or s[index] == '[' or s[index] == '{':
                stack.append(s[index])
                index += 1
            else:
                if len(stack) == 0: return False
                curChar = stack.pop(-1)
                if curChar == '(' and s[index] != ')':
                    return False
                if curChar == '[' and s[index] != ']':
                    return False
                if curChar == '{' and s[index] != '}':
                    return False
                index += 1
        if len(stack) > 0: return False
        return True



if __name__ == "__main__":
    print(Solution().isValid("([)]"))