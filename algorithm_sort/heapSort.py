#-*- coding:utf-8 -*-


def heapSort(alist):

    def sift_down(start, end):
        root = start

        while True:
            child = root * 2 + 1

            if child > end:
                break
            if alist[child + 1] > alist[child] and child + 1 <= end:
                child += 1
            if alist[child] > alist[root]:
                alist[child], alist[root] = alist[root], alist[child]
                root = child
            else:
                break

    # 建立最大堆
    for start in range(len(alist) - 2, -1, -1):
        sift_down(start, len(alist) - 1)

    for end in range(len(alist) - 1, -1, -1):
        alist[end], alist[0] = alist[0], alist[end]
        sift_down(0, end-1)


array = [121, 65, 12, 2, 1, 6, 56, 3, 54, 4, 4]
heapSort(array)
print array
