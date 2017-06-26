#-*- coding:utf-8 -*-

# leetcode 33

class Solution(object):
    def searchInRotatedArray(self, nums, target):
        if len(nums) == 0:return -1
        length = len(nums)
        left, right = 0, length - 1
        mid = 0
        while left <= right:
            mid = (left + right) /2 
            if nums[mid] == target:
                return mid;
            if nums[mid] > nums[left]:
                if nums[left] <= target and nums[mid] >= target:
                    right = mid - 1
                else:
                    left = mid + 1
            elif nums[mid] < nums[right]:
                if nums[right] >= target and nums[mid] <= target:
                    left = mid + 1
                else:
                    right = mid - 1
            else:
                left += 1
            
        return -1

if __name__ == "__main__":
    print Solution().searchInRotatedArray([5, 1, 3], 5)