#!/usr/bin/python
# -*- coding: latin-1 -*-

# 二进制码变换

# 在一个夜黑风高的晚上，有n（n <= 50）个小朋友在桥的这边
# 现在他们需要过桥，但是由于桥很窄，每次只允许不大于两人通过，
# 他们只有一个手电筒，所以每次过桥的两个人需要把手电筒带回来，
# i号小朋友过桥的时间为T[i]，两个人过桥的总时间为二者中时间长者。
# 问所有小朋友过桥的总时间最短是多少。

class Solution(object):
    def TotalTime(self, times):
        if len(times) == 1:
            return times[0]
        if len(times) == 2:
            return max(times[0], times[1])
        times.sort()
        length = len(times)
        dp = [ times[0] for __ in range(length) ]
        dp[1] = times[1]
        for i in range(2, length, 1):
            dp[i] = min(dp[i-1] + times[0] + times[i], dp[i-2] + 2*times[1] + times[0] + times[i])
        
        print dp
        return dp[length-1]


if __name__ == "__main__":
    print(Solution().TotalTime(
        [1,2,5,10,15,16,17]
    ))
    print(Solution().TotalTime(
        [1,2,5,10]
    ))