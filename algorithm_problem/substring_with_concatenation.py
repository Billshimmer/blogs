#-*- coding:utf-8 -*-

# leetcode 30

class Solution(object):
    def substringWithConeatenation(self, s, words):
        if len(s) < len(words[0])*len(words): return []
        wordDict = {}
        wordLength = len(words[0])
        wordsLength = len(words[0])*len(words)
        for i in words: wordDict[i] = wordDict[i] + 1 if i in wordDict else 1

        result = []
        for i in range(wordLength):
            left, right = i, i
            curDict = {}
            while right + wordLength <= len(s):
                word = s[right: right+wordLength]
                right += wordLength
                if word in wordDict:
                    curDict[word] = curDict[word] + 1 if word in curDict else 1
                    while curDict[word] > wordDict[word]:
                        curDict[s[left:left + wordLength]] -= 1
                        left += wordLength
                    if right - left == wordsLength:
                        result.append(left)
                else:
                    curDict.clear()
                    left = right

        return result



if __name__ == "__main__":
    print Solution().substringWithConeatenation(
       "barfoothefoobarman", ["foo", "bar"]
    )