#-*- coding:utf-8 -*-

# leetcode 18

class ListNode(object):
    def __init__(self, x):
        self.val = x
        self.next = None

    def myprint(self):
        print(self.val)
        if self.next:
            self.next.myprint()


class Solution(object):
    def removeNodeFromEnd(self, head, n):
        pre, cur = ListNode(0), ListNode(0)
        pre.next, cur.next = head, head
        curIndex, preIndex = 0, 0
        while cur.next:
            cur = cur.next
            curIndex += 1
        while preIndex < curIndex-n:
            pre = pre.next
            preIndex += 1
        
        if pre.next != head:
            pre.next = pre.next.next
        else:
            head = head.next
            
        return head





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
    result = Solution().removeNodeFromEnd(l1, 2)
    result.myprint()