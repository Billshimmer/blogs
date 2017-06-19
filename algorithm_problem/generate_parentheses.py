#-*- coding:utf-8 -*-

# leetcode 22


class Solution(object):
    def generateParentheses(self, n):
        res = []
        self.addCharDfs(n, n, '', res)
        return res

    def addCharDfs(self, left, right, s, res):
        if left == 0 and right == 0:
            res.append(s)
            return None
        if left > 0:
            self.addCharDfs(left-1, right, s + '(', res)
        if right > left:
            self.addCharDfs(left, right-1, s + ')', res)



if __name__ == "__main__":
    print(Solution().generateParentheses(4))