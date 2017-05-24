#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 71

class Solution(object):
    def simplifyPath(self, path):
        paths = path.split('/')
        stack = []
        for i in paths:
            if i is '':
                continue
            if i in ('.', '..'):
                len(stack) > 0 and stack.pop(0)
            else:
                stack.append(i)
            print stack
        
        return '/' + '/'.join(stack)



print Solution().simplifyPath('/a/./b/../../c/')

print Solution().simplifyPath('/home/')

print Solution().simplifyPath('/../')

print Solution().simplifyPath('/home//foo/')