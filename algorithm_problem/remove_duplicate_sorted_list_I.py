#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 83

class ListNode(object):
    def __init__(self, x):
        self.val = x
        self.next = None

class Solution(object):
    def removeDuplicatedSorted(self, head):
        if head == None or head.next == None:
            return head
        
        cur = head

        while cur:
            while cur.next and cur.val == cur.next.val:
                cur.next = cur.next.next
            cur = cur.next
        
        return head