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
        left = root.left
        right = root.right
        self.aftOrder(root.right)
        self.preOrder(root.left)
        if len(self.stackl) != len(self.stackr):
            return False
        else:
            for x, y in zip(self.stackl, self.stackr):
                if x != y: return False
        return True

    def aftOrder(self, node):
        if node is None: 
            self.stackl.append(node)
            return 
        self.aftOrder(node.right)
        self.stackl.append(node.val)
        self.aftOrder(node.left)    

    def preOrder(self, node):
        if node is None: 
            self.stackr.append(node)
            return 
        self.preOrder(node.left)
        self.stackr.append(node.val)
        self.preOrder(node.right)       


if __name__ == "__main__":
    node1 = TreeNode(3, None, None)
    node3 = TreeNode(1, None, None)
    node2 = TreeNode(2, node1, node3)
    print(Solution().symmetricTree(node2))