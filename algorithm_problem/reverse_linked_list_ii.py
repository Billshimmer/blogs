#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 92

class ListNode(object):
    def __init__(self, x):
        self.val = x
        self.next = None

    def to_list(self):
        stack = [self.val]
        cur = self.next
        while cur:
            stack.append(cur.val)
            cur = cur.next
        return stack

class Solution(object):
    def reverseLinkedList(self, head, m, n):

        if head == None or head.next == None:
            return head
            
        dummy = ListNode(0)
        dummy.next = head
        stack, index = [], 1
        cur, pre = ListNode(0), ListNode(0)
        cur, pre = dummy.next, dummy.next

        while index < m:
            index += 1
            cur, pre = cur.next, pre.next
        while index <= n:
            stack.append(ListNode(cur.val))
            index += 1
            cur = cur.next
        while len(stack) > 0:
            pre.val = stack.pop().val
            pre = pre.next

        return dummy.next



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

    print(Solution().reverseLinkedList(n1, 2, 5).to_list())