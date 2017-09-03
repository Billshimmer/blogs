#-*- coding:utf-8 -*-

# leetcode 99
class TreeNode(object):
    def __init__(self, x, left, right):
        self.val = x
        self.left = left or None
        self.right = right or None

class Solution(object):
    def recoverBinaryTree(self, root):
        self.pre = None
        self.node1, self.node2 = None, None
        self.inorder(root)
        self.node1.val, self.node2.val = self.node2.val, self.node1.val

    def inorder(self, node):
        if not node: return
        self.inorder(node.left)
        if self.pre is not None:
            if self.pre.val > node.val:
                if self.node1 is None:
                    self.node1 = self.pre
                    self.node2 = node
                else:
                    self.node2 = node
        self.pre = node
        self.inorder(node.right)

    def otherRecover(self, root):
        stack = []
        self.node1, self.node2 = None, None
        self.dfs(root, stack)
        for i in range(len(stack)-1):
            if stack[i].val > stack[i+1].val:
                if self.node2 is None:
                    self.node1, self.node2 = stack[i].val, stack[i+1].val
                else:
                    self.node2 = stack[i+1].val
        self.node1, self.node2 = self.node2, self.node1

    def dfs(self, node, stack):
        if node.left: self.dfs(node.left)
        stack.append(node)
        if node.right: self.dfs(node.right)


if __name__ == "__main__":
    node1 = TreeNode(3, None, None)
    node2 = TreeNode(2, node1, node2)
    node3 = TreeNode(1, None, None)
    print(Solution().recoverBinaryTree(node2))