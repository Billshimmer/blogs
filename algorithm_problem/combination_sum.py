#-*- coding:utf-8 -*-

# leetcode 39

class Solution(object):
    def combinationSum(self, nums, target):
        self.result = []
        self.target = target
        self.addNum(0, nums, [])

        return self.result

    def addNum(self, total, nums, curNums):
        if total == self.target:
            self.result.append(curNums)
            return 
        if total > self.target:
            return 
        else:
            for i, v in enumerate(nums):
                self.addNum(total + nums[i], nums[i:], curNums + [nums[i]])

if __name__ == "__main__":
    print Solution().combinationSum([2,3,6,7], 7)