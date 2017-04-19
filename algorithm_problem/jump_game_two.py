#-*- coding:utf-8 -*-
# [2,3,1,1,4] 例如一个数组第一个数为2，那么第一个数可以到达的距离为2(即可以达到3或者1)
# 那么给定一个非负数组到达最后一个数组最少的步数是多少

class Solution(object):
    def jump(self, nums):
        last, cur, steps, tail = 0, 0, 0, []
        for i, v in enumerate(nums):
            if i > last:
                last = cur
                steps += 1
            if cur < i+v:
                cur = i + v
                tail.append(i)
        
        print "jump route"
        for i in range(0, len(tail), 1):
            print "%s =>" % (tail[i]),
        print "%s" %(len(nums)-1)
        return steps


s = Solution()
print "一共%s步即可" %(s.jump([2, 3, 1, 1]))
