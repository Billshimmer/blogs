#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 60


class ListNode(object):
    def __init__(self, x):
        self.val = x
        self.next = None

    def myprint(self):
        print(self.val)
        if self.next:
            self.next.myprint()


class Solution(object):
    def rotateRight(self, head, k):
        stack = []
        pre, cur = ListNode(0), ListNode(0)
        pre.next, cur.next = head, head
        length = 0
        while cur.next:
            length += 1
            cur = cur.next
        shift = length - k%length
        if shift == length: return head
        while shift > 0:
            shift -= 1
            pre = pre.next
        
        cur.next = head
        res = pre.next
        pre.next = None
        return res


if __name__ == "__main__":
    l1 = ListNode(1)
    l2 = ListNode(2)
    l3 = ListNode(3)
    l4 = ListNode(4)
    l5 = ListNode(5)
    l1.next = l2
    l2.next = l3
    l3.next = l4
    l4.next = l5
    result = Solution().rotateRight(l1, 2)
    result.myprint()