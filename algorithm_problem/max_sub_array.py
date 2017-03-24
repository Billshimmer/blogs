
# 连续子序列的最大值

def maxSubArray(alist):
  curSum = 0 
  maxSum = 0 
  start_index, end_index, maxSum_start, maxSum_end = 0, 0, 0, 0

  for i in range(0, len(alist), 1):
    curSum += alist[i]

    if curSum < 0:
      curSum = 0
      start_index = i + 1
      end_index = i + 1
    if curSum > maxSum:
      maxSum = curSum
      end_index = i
      ## remember the max index
      maxSum_start = start_index
      maxSum_end = end_index
  
  print maxSum_start, maxSum_end

  return maxSum


alist = [1, -2, 3, 10, -4, 7, 2, -100]

print maxSubArray(alist)