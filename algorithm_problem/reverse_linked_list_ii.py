#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 92

 class ListNode(object):
    def __init__(self, x):
        self.val = x
        self.next = None
class Solution(object):
    def reverseLinkedList(self, head, m, n):

        dummy = ListNode(0)
        dummy.next = head

        stack = []
        index = 1
        cur, pre = ListNode(0), ListNode(0)
        cur, pre = dummy.next, dummy.next
        while index < m:
            index += 1
            cur = cur.next
        while index <= n:
            stack.append(cur)
            index += 1
            cur = cur.next
        while stack[-1]:
            pre.next = stack.pop()
            pre = pre.next

        pre.next = cur

        return dummy



if __name__ == "__main__":
    print(Solution().reverseLinkedList(2, 4))