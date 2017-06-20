#-*- coding:utf-8 -*-

# leetcode 25

class ListNode(object):
    def __init__(self, x):
        self.val = x
        self.next = None

    def to_list(self):
        return [self.val] + self.next.to_list() if self.next else [self.val]

class Solution(object):
    def reverseKGroup(self, head, k):
        pre, cur = head, head
        stack = []
        while cur:
            while cur and k > 0:
                stack.append(cur.val)
                cur = cur.next
                k -= 1
            
            if k > 0: return head
            
            while len(stack) > 0:
                pre.val = stack.pop(-1)
                pre = pre.next
                k += 1
        
        return head

if __name__ == "__main__":
    n1 = ListNode(1)
    n2 = ListNode(4)
    n3 = ListNode(5)
    n4 = ListNode(2)
    n5 = ListNode(3)
    n6 = ListNode(6)
    n1.next = n2
    n2.next = n3
    n3.next = n4
    n4.next = n5
    n5.next = n6
    print n1.to_list()
    r = Solution().reverseKGroup(n1, 2)
    print r.to_list()
