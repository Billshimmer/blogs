#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 56

# Definition for an interval.
class Interval(object):
    def __init__(self, s=0, e=0):
        self.start = s
        self.end = e
    def to_list(self):
        print(self.start, self.end)

class Solution(object):
    def merge(self, Intervals):
        Intervals = sorted(Intervals, key=lambda d:d.start)
        pre, cur = 0, 1
        while cur < len(Intervals):
            preItem = Intervals[pre]
            curItem = Intervals[cur]
            if preItem.end >= curItem.start:
                Intervals.pop(cur)
                preItem.end = curItem.end if preItem.end <= curItem.end else preItem.end 
            else:
                pre += 1
                cur += 1
        return Intervals

if __name__ == "__main__":
    print(Solution().merge([
        Interval(1,3),
        Interval(2,6),
        Interval(8,10),
        Interval(10,18),
        Interval(19,25)
    ]))