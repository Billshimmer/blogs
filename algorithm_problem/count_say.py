#-*- coding:utf-8 -*-

# leetcode 38

class Solution(object):
    def countAndSay(self, n):
        if n == 1: return '1'
        result = '1'
        for __ in range(1, n):
            result = self.getNextCount(result)
        
        return result
    
    def getNextCount(self, s):
        result = ''
        length = len(s)
        pre, cur = 0, 0
        while cur < length:
            while cur < length and s[pre] == s[cur]:
                cur += 1
            result = result + str(cur-pre) + s[pre]
            pre = cur
        
        return result 

if __name__ == "__main__":
    print Solution().countAndSay(5)