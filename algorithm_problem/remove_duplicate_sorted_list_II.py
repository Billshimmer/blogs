#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 82

class ListNode(object):
    def __init__(self, x):
        self.val = x
        self.next = None

class Solution(object):
    def removeDuplicatedSorted(self, head):
        if head == None or head.next == None:
            return head
        
        result = ListNode(0)
        result.next = head

        pre = result
        cur = result.next

        while cur:
            while cur.next and cur.next.val == pre.next.val:
                cur = cur.next
            if pre.next == cur.next:
                pre = pre.next
            else:
                pre.next = cur.next    
            cur = cur.next
        
        return result
        
        

        return result