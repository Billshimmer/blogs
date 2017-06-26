#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 94

class TreeNode(object):
    def __init__(self, x, left, right):
        self.val = x
        self.left = left or None
        self.right = right or None

class Solution(object):
    def binaryTreeInorderTraversal(self, root):
        res = []
        stack = []
        cur = root
        while cur or len(stack)>0:
            while cur:
                stack.append(cur)
                cur = cur.left
            if len(stack) > 0:
                cur = stack.pop()
                res.append(cur.val)
                cur = cur.right
        return res



if __name__ == "__main__":
    node1 = TreeNode(3, None, None)
    node2 = TreeNode(2, node1, node2)
    node3 = TreeNode(1, None, None)
    print(Solution().binaryTreeInorderTraversal(node3))
