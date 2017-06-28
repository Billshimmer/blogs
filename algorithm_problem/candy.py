#-*- coding:utf-8 -*-

# leetcode 135

class Solution(object):
    def candy(self, ratings):
        length = len(ratings)
        if length == 0:return 0
        if length == 1:return 1
        stack = [ 1 for __ in range(len(ratings))]
        
        for i in range(1, length, 1):
            if ratings[i] > ratings[i-1]:
                stack[i] = stack[i-1] + 1
        
        for i in range(length-2, -1, -1):
            if ratings[i] > ratings[i+1]:
                stack[i] = max(stack[i], stack[i+1]+1)
                
        return sum(stack)


if __name__ == "__main__":
    print Solution().candy([1, 2])