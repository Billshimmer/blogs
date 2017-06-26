#-*- coding:utf-8 -*-

# leetcode 34

class Solution(object):
    def searchRange(self, nums, target):
        length = len(nums)
        if length == 0: return [-1, -1]
        left, right = 0, length - 1
        mid = (left+right)/2
        while left <= right:
            mid = (left+right)/2
            if nums[mid] == target:
                break;
            elif nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        
        if nums[mid] == target:
            s, e = mid, mid
            while s > 0 and nums[s-1] == target:
                s -= 1
            while e < length-1 and nums[e+1] == target:
                e += 1
            return [s, e]
        return [-1, -1]
    
if __name__ == "__main__":
    print Solution().searchRange([1, 3, 5], 5)