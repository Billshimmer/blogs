#-*- coding:utf-8 -*-

# leetcode 633

class Solution(object):
    def judgeSquare(self, n):
        num_sqrt = int(n ** 0.5)
        nums_pow = [ i*i for i in range(num_sqrt+1) ]

        left, right = 0, num_sqrt
        while left <= right:
            if nums_pow[left] + nums_pow[right] == n:
                return True
            elif nums_pow[left] + nums_pow[right] > n:
                right -= 1
            else:
                left += 1
                    
        return False



if __name__ == "__main__":
    print Solution().judgeSquare(5)
    print Solution().judgeSquare(4)
    print Solution().judgeSquare(2)