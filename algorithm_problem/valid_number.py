#!/usr/bin/python
# -*- coding: latin-1 -*-


class Solution(object):
    def isNumber(self, s):

        is_number = False
        is_exp = True
        s = s.strip()
        length = len(s)
        index = 0

        if index < length and (s[index] == '+' or s[index] == '-'):
            index += 1

        while index < length and s[index].isdigit():
            index += 1
            is_number = True

        if index < length and s[index] == '.':
            index += 1
            while index < length and s[index].isdigit():
                index += 1
                is_number = True

        if index < length and (s[index] == 'e' or s[index] == 'E'):
            is_exp = False
            index += 1
            if index < length and (s[index] == '+' or s[index] == '-'):
                index += 1
            while index < length and s[index].isdigit():
                index += 1
                is_exp = True

        return is_number and is_exp and index == length


if __name__ == "__main__":
    a = Solution()

    print(a.isNumber('-3.2e-23'))
    print(a.isNumber('1223123'))
    print(a.isNumber('qwdkjhqwjd'))
    print(a.isNumber('3.223535'))
    print(a.isNumber('3.2e32'))