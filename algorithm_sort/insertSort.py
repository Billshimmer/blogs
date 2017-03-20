
def insertSort(alist):
  for i in range(1, len(alist), 1):
    j = i - 1
    current = alist[i]
    while j>=0 and alist[j] >= current:
      alist[j+1] = alist[j]
      j = j - 1
    alist[j+1] = current


array = [121,65,12,2,1,6,56,3,54,4,4]
insertSort(array)
print array