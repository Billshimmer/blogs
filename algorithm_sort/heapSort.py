#-*- coding:utf-8 -*-


def heapSort(alist):

    def sift_down(start, end):
        root = start

        while True:
            child = root * 2 + 1
            if child > end:
                break
            if alist[child + 1] < alist[child] and child + 1 <= end:
                child += 1
            if alist[child] < alist[root]:
                alist[child], alist[root] = alist[root], alist[child]
                root = child
            else:
                break

    def sift_up(start, end):
        cur = end
        while True:
            parent = int((cur-1)/2)
            if parent < start:
                break
            if alist[cur] < alist[parent]:
                alist[cur], alist[parent] = alist[parent], alist[cur]
                cur = parent
            else:
                break
    # 建立最小堆
    for end in range(0, len(alist), 1):
        sift_up(0, end)

    for end in range(len(alist) - 1, -1, -1):
        alist[end], alist[0] = alist[0], alist[end]
        sift_down(0, end-1)
    # print alist
    # result = []
    # for end in range(len(alist)-1, -1, -1):
    #     alist[end], alist[0] = alist[0], alist[end]
    #     sift_up(0, end-1)
    #     result.append(alist[end])
    # # print result
    # 建立最大堆
    # result = []
    # for start in range(len(alist) - 2, -1, -1):
    #     sift_down(start, len(alist) - 1)

    # for end in range(len(alist) - 1, -1, -1):
    #     alist[end], alist[0] = alist[0], alist[end]
    #     sift_down(0, end-1)
    #     result.append(alist[end])
    # print result

array = [121, 65, 12, 2, 1, 6, 56, 3, 54, 4, 4]
heapSort(array)
print array
