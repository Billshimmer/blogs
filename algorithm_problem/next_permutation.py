#-*- coding:utf-8 -*-

# leetcode 31

class Solution(object):
    def nextPermutation(self, nums):
        if len(nums) == 1: return None
        length = len(nums)
        target, change = 0, 0
        for i in range(length-1, 0, -1):
            if nums[i] > nums[i-1]:
                target = i - 1
                break
        
        for i in range(length-1, -1, -1):
            if nums[i] > nums[target]:
                change = i
                break
        
        nums[target], nums[change] = nums[change], nums[target]
        if change == 0 and target == 0:
            nums.reverse()
        else:
            nums[target+1:] = reversed(nums[target+1:])

if __name__ == "__main__":
    nums1 = [1, 3, 5, 4, 2, 9, 8, 7, 6]
    nums2 = [1, 1, 5]
    nums3 = [3, 2, 1]
    Solution().nextPermutation(nums1)
    Solution().nextPermutation(nums2)
    Solution().nextPermutation(nums3)
    print nums1
    print nums2
    print nums3