#!/usr/bin/python
# -*- coding: latin-1 -*-

def selectSort(alist):
  for i in range(0, len(alist), 1):
    min = alist[i]
    index = i
    for j in range(i, len(alist), 1):
      if(alist[j]<min):
        min = alist[j]
        index = j
    tmp = alist[index]
    alist[index] = alist[i] 
    alist[i] = tmp


array = [121,65,12,2,1,6,56,3,54,4]
selectSort(array)
print array