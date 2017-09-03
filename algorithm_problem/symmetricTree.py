#-*- coding:utf-8 -*-

# leetcode 101
class TreeNode(object):
    def __init__(self, x, left, right):
        self.val = x
        self.left = left or None
        self.right = right or None

class Solution(object):
    def symmetricTree(self, root):
        if root is None: return True
        self.stackl, self.stackr = [], []
        self.aftOrder(root.left)
        self.inOrder(root.right)
        if len(self.stackl) != len(self.stackr): return False
        print self.stackl, self.stackr
        for x, y in zip(self.stackl, self.stackr):
            if x != y:return False
        return True

    def inOrder(self, node):
        if node is None:
            self.stackr.append(node)
            return
        self.inOrder(node.left)
        self.stackr.append(node.val)
        self.inOrder(node.right)

    def aftOrder(self, node):
        if node is None:
            self.stackl.append(node)
            return
        self.aftOrder(node.right)
        self.stackl.append(node.val)
        self.aftOrder(node.left)


if __name__ == "__main__":
    node5 = TreeNode(2, None, None)
    node1 = TreeNode(3, node5, None)
    node4 = TreeNode(3, None, None)
    node3 = TreeNode(2, node4, None)
    node2 = TreeNode(1, node3, node1)
    print(Solution().symmetricTree(node2))