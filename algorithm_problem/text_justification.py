#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 68


class Solution(object):
    words = []
    maxWidth = 0

    def textJustification(self, words, maxWidth):
        self.words = words
        self.maxWidth = maxWidth

        if len(words) == 0:
            return words
        if maxWidth == 0:
            return [ '' for __ in range(0, len(words), 1)]

        index, l, r = 0, 0, 0
        resultWords = []
        curLineTextLength = 0

        for i in range(0, len(words), 1):
            if curLineTextLength + len(words[i]) <= maxWidth:
                curLineTextLength = curLineTextLength + len(words[i]) + 1
                r = i
            else:
                text = self.fixSpaceBetweenText(l, r + 1, False)
                resultWords.append(text)
                l, r = i, i
                curLineTextLength = 0 + len(words[i]) + 1

        if curLineTextLength > 0:
            text = self.fixSpaceBetweenText(l, r + 1, True)
            resultWords.append(text)

        return resultWords

    def fixSpaceBetweenText(self, l, r, isLast):
        text, allWordsLength, spaceLength = '', 0, 0

        if isLast == True:
            for i in range(l, r, 1):
                text = text + self.words[i] + ' ' if i != r-1 else text + self.words[i]
            text = text + ' ' * (self.maxWidth - len(text))
        elif isLast == False:
            for i in range(l, r, 1):
                allWordsLength += len(self.words[i])
            divide = r - l - 1
            
            if divide == 0:
                text = self.words[l] + (self.maxWidth - len(self.words)) * ' '
                return text
            
            num, remain = (
                self.maxWidth - allWordsLength) // divide, (self.maxWidth - allWordsLength) % divide

            for i in range(l, r, 1):
                text += self.words[i]
                text = text + ' ' if remain >= 1 else text
                remain -= 1
                text = text + ' ' * num if i != r - 1 else text
        return text


text = Solution().textJustification(
    ["a"],
    1
)

print text

for i in text:
    print len(i)
