#!/usr/bin/env python
# -*- coding: gbk -*-

def BinarySearch(array,t):
  left = 0
  right = len(array) - 1
  while left != right:
    mid = (left + right)/2
    if(t>array[mid]): 
      left = mid + 1
      print ("midNums:", array[mid])
      print ("left:",left)
    else:
      right = mid
      print ("midNums:", array[mid])
      print ("right:",right)
      
  return [left, right]

print (BinarySearch([1,2,3,34,56,57,78,87],58))