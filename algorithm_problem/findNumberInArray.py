#-*- coding:utf-8 -*-

# 有这样一个数组A，大小为n，相邻元素差的绝对值都是1。如：A={4,5,6,5,6,7,8,9,10,9}。
# 现在，给定A和目标整数t，请找到t在A中的位置。除了依次遍历，还有更好的方法么？


def findNumberInArray(alist, target):
    
    index = 0 
    curNumber = alist[index]

    while curNumber != target:
      if curNumber < target:
        n = target - curNumber
        index = index + n
        curNumber = alist[index]
    
    return index

A = [4, 5, 6, 5, 6, 7, 8, 9, 10, 9]
target = 10

print findNumberInArray(A, target)
