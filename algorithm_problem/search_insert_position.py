#-*- coding:utf-8 -*-

# leetcode 34

class Solution(object):
    def searchInsert(self, nums, target):
        """
        :type nums: List[int]
        :type target: int
        :rtype: int
        """
        length = len(nums)
        if length == 0: return 0
        left, right = 0, length - 1
        mid = (left + right)/2
        while left <= right:
            mid = (left + right)/2
            if nums[mid] == target:
                return mid
            elif nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        return mid+1 if target > nums[mid] else mid

if __name__ == "__main__":
    print Solution().searchInsert([1], 0)