#!/usr/bin/python
# -*- coding: latin-1 -*-
V = [1,2,3,4,5,5]
W = [1,2,3,45,6,7]

def backPack(n, c ,v, w):
  d = [[0 for j in range(c+1)] for i in range(n+1)]
  for i in range(0, n+1, 1):
    for j in range(0, c+1, 1):
      d[i][j] = 0 if i==0 else d[i-1][j]

      if i>0 and j>=v[i-1]:
        d[i][j] = max(d[i-1][j], d[i-1][j-v[i-1]]+w[i-1])

  return d

def show(n,c,v,res):  
    print('maxProfit:',res[n][c])  
    x=[False for i in range(n)]  
    j=c  
    for i in range(n,1,-1):  
        if res[i][j]>res[i-1][j]:  
            x[i-1]=True  
            j-=v[i-1]  
    print('choosed:')  
    for i in range(n):  
        if x[i]:  
            print("bone's index is ",i + 1,' !,')  
    print('')

result = backPack(6, 10, V, W)

print result
print result[6][10]
show(6, 10, V, result)