

def maxSubArray(alist):

    curSum = 0
    maxSum = 0

    for i in range(0, len(alist), 1):
        curSum += alist[i]
        if curSum < 0:
            curSum = 0
        if curSum > maxSum:
            maxSum = curSum
    
    return maxSum

alist = [1, -2, 3, 10, -4, 7, 2, -5]

print maxSubArray(alist)