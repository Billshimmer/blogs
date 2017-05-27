#!/usr/bin/python
# -*- coding: latin-1 -*-
from collections import defaultdict

# leetcode 77


class Solution(object):
    def combinations(self, n, k):
        if k == 1:
            return [[i + 1] for i in range(n)]
        result = []
        if n > k:
            result = [
                r + [n] for r in self.combinations(n - 1, k - 1)] + self.combinations(n - 1, k)
        else:
            result = [r + [n] for r in self.combinations(n - 1, k - 1)]
        return result


print Solution().combinations(4, 2)
