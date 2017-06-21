#-*- coding:utf-8 -*-

# leetcode 32

class Solution(object):
    def longestValidParentheses(self, s):
        if len(s) == 1 or len(s) == 0:return 0
        length = len(s)
        start = 0
        stack = []
        result = 0
        for i in range(length):
            if s[i] == '(':
                stack.append(i)
            elif len(stack) > 0:
                stack.pop(-1)
            else:
                curLength = i - start
                result = max(result, curLength)
                start = i + 1
        
        if len(stack) == 0 and start == length:
            return result
        else:
            stack.insert(0, start)
            stack.append(length)
            for i in range(1, len(stack)):
                result = max(result, ((stack[i] - stack[i-1]) >> 1) << 1 )
    
        return result

    def otherSolution(self, s):
        """
        :type s: str
        :rtype: int
        """
        if not s:
            return 0
        length = len(s)
        dp = [0 for __ in range(length)]
        for i in range(1, length):
            if s[i] == ")":
                j = i - 1 - dp[i - 1]
                if j >= 0 and s[j] == "(":
                    dp[i] = dp[i - 1] + 2
                    if j - 1 >= 0:
                        dp[i] += dp[j - 1]
        return max(dp)
    def anotherSolution(self, s):
        if not s:
            return 0
        length = len(s)
        result = 0 
        dp = [0 for __ in range(length)]
        for i in range(length):
            if s[i] == ')':
                if i-1 >= 0 and s[i-1] == '(':
                    dp[i] = dp[i-2] + 2 if i-2 >= 0 else 2
                elif i-dp[i-1] > 0 and s[i-dp[i-1]-1] == '(':
                    dp[i] = dp[i-1] + (dp[i-dp[i-1]-2]if i-dp[i-1]-2 >= 0 else 0) + 2
                result = max(result, dp[i])

        return result

if __name__ == "__main__":
    # print Solution().otherSolution('()')
    # print Solution().otherSolution(')(')
    print Solution().otherSolution('(()))())(')
    print Solution().anotherSolution("(()))())(")
    # print Solution().otherSolution('))))()()()')