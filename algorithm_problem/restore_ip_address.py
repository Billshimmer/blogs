#!/usr/bin/python
# -*- coding: latin-1 -*-

# leetcode 93


class Solution(object):
    def restoreIpAddress(self, s): 
        res = []
        self._restoreIpAddress(0, s, [], res)
        return res

    def _restoreIpAddress(self, length, s, ips, res):
        if not s:
            if length == 4:
                res.append('.'.join(ips))
                return 
        elif length == 4:
            return 
        self._restoreIpAddress(length+1, s[1:], ips+[s[:1]], res)

        if s[0] != 0:
            if len(s) >= 2:
                self._restoreIpAddress(length+1, s[2:], ips+[s[:2]], res)
            if len(s) >= 3 and int(s[:3]) <= 255:
                self._restoreIpAddress(length+1, s[3:], ips+[s[:3]], res)
        


if __name__ == "__main__":
    print(Solution().restoreIpAddress('2225111111'))


