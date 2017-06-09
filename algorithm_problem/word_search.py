#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 79


class Solution(object):
    def wordSearch(self, board, word):

        count = 0
        m, n = len(board), len(board[0])
        visited = [[0 for __ in range(n)] for __ in range(m)]

        for i in range(m):
            for j in range(n):
                if word[0] == board[i][j]:
                    if self.dfs(board, word, count, i, j, visited):
                        return True
        return False

    def dfs(self, board, word, count, i, j, visited):
        if count == len(word) - 1:
            return True
        
        visited[i][j] = 1
        m, n = len(board), len(board[0])
        if i - 1 >= 0 and visited[i - 1][j] == 0 and board[i - 1][j] == word[count + 1]:
            if self.dfs(board, word, count+1, i-1, j, visited):
                return True
        if j - 1 >= 0 and visited[i][j-1] == 0 and board[i][j-1] == word[count+1]:
            if self.dfs(board, word, count+1, i, j-1, visited):
                return True
        if i + 1 < m and visited[i+1][j] == 0 and board[i+1][j] == word[count+1]:
            if self.dfs(board, word, count+1, i+1, j, visited):
                return True
        if j + 1 < n and visited[i][j+1] == 0 and board[i][j+1] == word[count+1]:
            if self.dfs(board, word, count+1, i, j+1, visited):
                return True

        visited[i][j] = 0
        return False


if __name__ == "__main__":
    print Solution().wordSearch([
        ['A', 'B', 'C', 'E'],
        ['S', 'F', 'C', 'S'],
        ['A', 'D', 'E', 'E']
    ], "ABCCED")
    print Solution().wordSearch([
        ['A', 'B', 'C', 'E'],
        ['S', 'F', 'C', 'S'],
        ['A', 'D', 'E', 'E']
    ], "SEE")
    print Solution().wordSearch([
        ['A', 'B', 'C', 'E'],
        ['S', 'F', 'C', 'S'],
        ['A', 'D', 'E', 'E']
    ], "ABCE")

    print Solution().wordSearch([
        'aa'
    ], 'aaa')
    
    print Solution().wordSearch([
        "CAA","AAA","BCD"
    ], "AAB")
    