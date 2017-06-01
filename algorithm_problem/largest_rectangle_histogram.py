#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 84


class Solution(object):
    def largestRectangleArea(self, heights):
        """
        :type heights: List[int]
        :rtype: int
        """
        stack = [-1]
        heights.append(0)
        result = 0

        for i in range(len(heights)):
            while heights[i] < heights[stack[-1]]:
                h = heights[stack.pop()]
                w = i - stack[-1] - 1
                result = max(result, w * h)
            stack.append(i)
        
        return result


print Solution().largestRectangleArea([2,1,1,3])
