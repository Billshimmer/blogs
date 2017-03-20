#!/usr/bin/python
# -*- coding: latin-1 -*-
from collections import deque

def mergeSort(alist):
  if(len(alist) <= 1):
    return alist

  def merge(left, right):
    total = []
    
    while left and right:
      total.append(left.pop(0) if left[0]<= right[0] else right.pop(0))
    
    if left:
      total.extend(left)
    elif right:
      total.extend(right)
    
    return total


  mid = int(len(alist)//2)
  left = mergeSort(alist[:mid])
  right = mergeSort(alist[mid:])

  return merge(left, right)

array = [121,65,12,2,1,6,56,3,54,4]
array1 = mergeSort(array)
print array1