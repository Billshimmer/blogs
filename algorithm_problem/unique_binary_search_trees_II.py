class TreeNode(object):
    def __init__(self, x):
        self.val = x
        self.left = None
        self.right = None


class Solution(object):
    roots = []
    def generateTrees(self, n):
        """
        :type n: int
        :rtype: List[TreeNode]
        """
        if n == 0:
            return []
        self.cache = {}
        return self._generateTrees(1, n)

    def _generateTrees(self, start, end):
        if (start, end) not in self.cache:
            roots = []
            for root in range(start, end + 1):
                for left in self._generateTrees(start, root - 1):
                    for right in self._generateTrees(root + 1, end):
                        node = TreeNode(root)
                        node.left = left
                        node.right = right
                        roots.append(node)
            self.cache[(start, end)] = roots
        return self.cache[(start, end)] or [None]
    def Inordersf(self, root):
        if root == None:
            return
        self.roots.append(root.val)
        if root.left:
            self.Inordersf(root.left)
        if root.right:
            self.Inordersf(root.right)

if __name__ == "__main__":
    a = Solution()
    for item in a.generateTrees(2):
        a.Inordersf(item)
        print(a.roots)
        a.roots = []
    print(len(a.generateTrees(2)))
    # for item in a.cache.keys():
    #     a.Inordersf(a[item])
    #     print(a.roots)
    #     a.roots = []