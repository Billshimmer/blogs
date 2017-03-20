import math

def shellSort(alist):
    length = len(alist)
    gap = int(math.floor(length/2))

    while gap > 0:
      for i in range(gap, length, 1):
        for j in range(i, -1, -gap):
          if j-gap >= 0 and alist[j-gap] > alist[j]:
            alist[j-gap], alist[j] = alist[j], alist[j-gap]    
          else:
            break
      
      gap = int(math.floor(gap/2))




array = [121,65,12,2,1,6,56,3,54,4]
shellSort(array)
print array
