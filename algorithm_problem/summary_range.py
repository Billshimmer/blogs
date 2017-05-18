#-*- coding:utf-8 -*-
# [0,1,2,4,5,7] return ["0->2","4->5","7"]


class Solution(object):
    def summaryRanges(self, nums):
        """
        :type nums: List[int]
        :rtype: List[str]
        """
        if len(nums) == 0:
            return []
        if len(nums) == 1:
            return [str(nums[0])]

        start, end, result = 0, 0, []
        while end < len(nums):
            while end < len(nums) and end - start == nums[end] - nums[start]:
                end += 1

            if start == end - 1:
                cur = str(nums[start])
            else:
                cur = str(nums[start]) + "->" + str(nums[end - 1])

            result.append(cur)
            start = end

        return result


s = Solution()
print s.summaryRanges([0, 1, 2, 4, 5, 7])
