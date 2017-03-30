#!/usr/bin/python
# -*- coding: latin-1 -*-

# 最小生成树prime算法
# 点为1，2，3，4，5，6
# grah记录点之间的距离

MAX_NUM = 10000
v_num = 6

grah = [
    [0, 6, 1, 5, MAX_NUM, MAX_NUM],
    [6, 0, 5, MAX_NUM, 3, MAX_NUM],
    [1, 5, 0, 5, 5, 4],
    [5, MAX_NUM, 5, 0, MAX_NUM, 2],
    [MAX_NUM, 3, 6, MAX_NUM, 0, 6],
    [MAX_NUM, MAX_NUM, 4, 2, 6, 0],
]

# 暂存已经被遍历到的点
U = []
# 存储没有被遍历到的点
V = [i for i in range(1, v_num + 1, 1)]
# 被选中使用的最短边
T = []


def prim(start):
    U.append(start)
    V.remove(start)

    while len(V) > 0:
        min_val, indexI, indexJ = MAX_NUM, 0, 0
        for i in U:
            for j in V:
                if grah[i - 1][j - 1] < min_val:
                    min_val = grah[i - 1][j - 1]
                    indexI, indexJ = i, j

        U.append(indexJ)
        V.remove(indexJ)
        T.append((indexI, indexJ))


def printCost(T):
    sum_cost = 0
    for (i, j) in T:
        sum_cost += grah[i - 1][j - 1]
        print "边: %d<=>%d,值为%d" % (i, j, grah[i - 1][j - 1])

    print "总权重为: %d" % (sum_cost)


prim(1)
printCost(T)
