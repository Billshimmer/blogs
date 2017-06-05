#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 86
import time

class ListNode(object):
    def __init__(self, x):
        self.val = x
        self.next = None

    def to_list(self):
        return [self.val] + self.next.to_list() if self.next else [self.val]

class Solution(object):
    def partitionList(self, head, x):
        # [1, 2, 2, 4, 3, 5]

        if head == None or head.next == None:
            return head
        
        t0 = time.clock()
        dummy = ListNode(0)
        dummy.next = head
        small, large = ListNode(0), ListNode(0)
        small_cur, large_cur = small, large
        cur = dummy

        while cur.next:
            handler = cur.next
            if handler.val < x:
                small_cur.next = handler
                small_cur = small_cur.next
            else:
                large_cur.next = handler
                large_cur = large_cur.next
            print small.to_list(), large.to_list()
            cur = cur.next

        large_cur.next = None
        small_cur.next = large.next
        small = small.next

        print time.clock() - t0, "seconds process time"
        return small





if __name__ == "__main__":
    n1 = ListNode(1)
    n2 = ListNode(4)
    n3 = ListNode(3)
    n4 = ListNode(2)
    n5 = ListNode(5)
    n6 = ListNode(2)
    n1.next = n2
    n2.next = n3
    n3.next = n4
    n4.next = n5
    n5.next = n6
    r = Solution().partitionList(n1, 3)
    print r.to_list()
    # assert r.to_list() == [1, 2, 2, 4, 3, 5]