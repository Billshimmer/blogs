#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 88


class Solution(object):
    def margeSortedArray(self, nums1, m, nums2, n):
        if m == 0:
            for i in range(n):
                nums1[i] = nums2[i]
            return
        if n == 0:
            return

        index = m + n -1
        m -= 1
        n -= 1
        while m >= 0 and n >= 0:
            if nums1[m] > nums2[n]:
               nums1[index] = nums1[m]
               m -= 1
            else:
               nums1[index] = nums2[n]
               n -= 1
            index -= 1
        if m < 0:
            nums1[:n+1] = nums2[:n+1] 




nums1 = [1, 0]
nums2 = [2]

Solution().margeSortedArray(nums1, 1, nums2, 1)

print nums1
