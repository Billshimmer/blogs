#!/usr/bin/python
# -*- coding: latin-1 -*-

# 活动选择问题
# 活动按照结束时间的早晚排序
s = [1, 3, 0, 5, 3, 5, 6, 8, 8, 2, 12]
f = [4, 5, 6, 7, 9, 9, 10, 11, 12, 14, 16]

def activity_select(slist, flist):
    result = []
    start, end = 0, 0
    
    for i in range(0, len(slist), 1):
      if s[i] >= end:
        start, end = slist[i], flist[i]
        result.append([start, end])
        print [start, end]

    return result

result = activity_select(s, f)

print result