#-*- coding:utf-8 -*-

# leetcode 18

class Solution(object):
    def fourSum(self, nums, target):
        res = []
        nums.sort()
        length = len(nums)
        twoNums = {}
        if length < 4: return []
        for i in range(length):
            for j in range(i+1, length):
                if nums[i]+nums[j] in twoNums:
                    twoNums[nums[i]+nums[j]].append([i, j])
                else:
                    twoNums[nums[i]+nums[j]] = [[i, j]]

                remind = target - nums[i] - nums[j]
                if remind in twoNums:
                    for each in twoNums[remind]:
                        if i != each[0] and each[1] > j and [nums[i], nums[j], nums[each[0]], nums[each[1]]] not in res:
                            res.append([nums[i], nums[j], nums[each[0]], nums[each[1]]])
                       
        return res
if __name__ == "__main__":
    print(Solution().fourSum([-5,5,4,-3,0,0,4,-2], 4))
