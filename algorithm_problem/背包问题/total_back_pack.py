#!/usr/bin/python
# -*- coding: latin-1 -*-

# 完全背包问题

# 体积
V = [1, 2, 3, 4, 5, 5]
# 价值
W = [1, 2, 3, 45, 6, 7]

# 复杂度为O(NCK)
def total_back_pack_nck(n, c, v, w):
    d = [[0 for j in range(c+1)] for i in range(n+1)]
    for i in range(0, n+1, 1):
      for j in range(0, c+1, 1):
        d[i][j] = 0 if i ==0 else d[i-1][j]
        k = 0
        while k * v[i-1]<=j:
          d[i][j] = max(d[i-1][j], d[i-1][j-k*v[i-1]]+k*w[i-1])
          k += 1
    
    return d

# 复杂度为O(NC)
def total_back_pack_nc(n, c, v, w):
    d = [[0 for j in range(c+1)] for i in range(n+1)]
    for i in range(0, n+1, 1):
      for j in range(0, c+1, 1):
        d[i][j] = 0 if i == 0 else d[i-1][j]
        if j<v[i-1]:
          d[i][j] = d[i-1][j]
        else:
          d[i][j] = max(d[i-1][j], d[i][j-v[i-1]]+w[i-1])
    return d

# 复杂度为O(NC) 空间复杂度为O(C) 滚动数组
def total_back_pack_ncl(n, c, v, w):
    d = [0 for i in range(c+1)]
    for i in range(0, n+1, 1):
      for j in range(v[i-1], c+1, 1):
        d[j] = max(d[j], d[j-v[i-1]]+w[i-1])
    return d


result1 = total_back_pack_nck(5, 10, V, W)
print result1[5][10]

result2 = total_back_pack_nc(5, 10, V, W)
print result2[5][10]

result3 = total_back_pack_ncl(5, 10, V, W)
print result3[10]