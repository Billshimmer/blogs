#!/usr/bin/python
# -*- coding: latin-1 -*-

# 部分背包问题

# 体积
V = [1, 2, 3, 4, 5, 5]
# 价值
W = [1, 2, 3, 45, 6, 7]
# 限制个数
N = [10, 10, 10, 10, 10, 10]

# 时间复杂度O(nck) 
def part_back_part_nck(n, c, v, w):
    d = [[0 for j in range(c+1)]for i in range(n+1)]

    for i in range(0, n+1, 1):
      for j in range(0, c+1, 1):
        d[i][j] = 0 if i==0 else d[i-1][j]
        k = 0 
        while k<=N[i-1] and k*v[i-1]<=j:
          d[i][j] = max(d[i-1][j], d[i-1][j-k*v[i-1]]+k*w[i-1])
          k += 1  
    return d

def part_back_part_nck_l(n, c, v, w):
    d = [0 for j in range(c+1)]
    for i in range(0, n+1, 1):
      for j in range(c, 0, -1):
        k = 0
        while k<=N[i-1] and k*v[i-1]<=j:
          d[j] = max(d[j], d[j-k*v[i-1]]+k*w[i-1])
          k += 1
    return d

result1 = part_back_part_nck(5, 10, V, W)

print result1[5][10]

result2 = part_back_part_nck_l(5, 10, V, W)

print result2[10]