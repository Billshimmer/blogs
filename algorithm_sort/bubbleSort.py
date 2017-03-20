#!/usr/bin/python
# -*- coding: latin-1 -*-

def bubbleSort(alist):
  for i in range(0, len(alist)-1, 1):
    for j in range(0, len(alist)-i-1, 1):
      if(alist[j]>alist[j+1]):
        tmp = alist[j]
        alist[j] = alist[j+1]
        alist[j+1] = tmp

array = [121,65,12,2,1,6,56,3,54,4]
bubbleSort(array)
print array
