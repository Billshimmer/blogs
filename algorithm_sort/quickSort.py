#!/usr/bin/python
# -*- coding: latin-1 -*-

def partitions(alist, p, r):
  i = p - 1
  pivot = alist[r]

  for j in range(p, r, 1):
    if(alist[j]<pivot):
      i = i + 1
      tmp = alist[i]
      alist[i] = alist[j]
      alist[j] = tmp
  tmp = alist[r]
  alist[r] = alist[i+1]
  alist[i+1] = tmp

  return i + 1

def quickSort(alist, p, r):
  if p < r:
    q = partitions(alist, p, r)
    quickSort(alist, p, q-1)
    quickSort(alist, q+1, r)


array = [121,65,12,2,1,6,56,3,54,4]
quickSort(array, 0, len(array)-1)
print array