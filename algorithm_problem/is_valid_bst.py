#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 98

class TreeNode(object):
    def __init__(self, x, left, right):
        self.val = x
        self.left = left or None
        self.right = right or None

class Solution(object):
    def isValidBst(self, root):
        if root == None:
            return True
        self.stack = []
        self.inOrder(root)
        for i in range(1, len(self.stack)):
            if self.stack[i] <= self.stack[i-1]:
                return False
        return True

    def inOrder(self, node):
        if node.left: self.inOrder(node.left)
        self.stack.append(node.val)
        if node.right: self.inOrder(node.right)

if __name__ == "__main__":
    node1 = TreeNode(3, None, None)
    node3 = TreeNode(1, None, None)
    node2 = TreeNode(2, node3, node1)
    print(Solution().isValidBst(node2))
