#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 49

class Solution(object):
    def groupAnagrams(self, strs):
        length = len(strs)
        if length == 0:
            return []
        if length == 1:
            return [strs]
        map = {}
        tail = []
        for i, v in enumerate(strs):
            sortStr = ''.join(sorted(v))
            if sortStr not in map:
                map[sortStr]=[v]
            else:
                map[sortStr].append(v)

        for value in map.values():
            tail.append(value)

        return tail



if __name__ == "__main__":
    print(Solution().groupAnagrams(
        ['eat','ate','tan','nat','bat','tea']
    ))