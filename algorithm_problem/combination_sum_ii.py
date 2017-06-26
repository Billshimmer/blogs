#-*- coding:utf-8 -*-

# leetcode 40

class Solution(object):
    def combinationSum(self, nums, target):
        nums.sort()
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
                if i > 0 and nums[i] == nums[i-1]: continue
                self.addNum(total + nums[i], nums[i+1:], curNums + [nums[i]])        


if __name__ == "__main__":
    print Solution().combinationSum([10,1,2,7,6,1,5],8)