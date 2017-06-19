#-*- coding:utf-8 -*-

# leetcode 21

class ListNode(object):
    def __init__(self, x):
        self.val = x
        self.next = None

    def to_list(self):
        return [self.val] + self.next.to_list() if self.next else [self.val]

class Solution(object):
    def mergeSortedList(self, l1, l2):
        head = ListNode(0)
        dummy = head
        while l1 and l2:
            if l1.val < l2.val:
                dummy.next = l1
                l1 = l1.next
                dummy = dummy.next
            else:
                dummy.next = l2
                l2 = l2.next
                dummy = dummy.next
        if  l1: dummy.next = l1
        if  l2: dummy.next = l2

        return head.next

if __name__ == "__main__":
    n1 = ListNode(1)
    n2 = ListNode(4)
    n3 = ListNode(5)
    n4 = ListNode(2)
    n5 = ListNode(3)
    n6 = ListNode(6)
    n1.next = n2
    n2.next = n3
    n3.next = None
    n4.next = n5
    n5.next = n6
    r = Solution().mergeSortedList(n1, n4)
    print(r.to_list())