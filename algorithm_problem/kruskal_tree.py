#!/usr/bin/python
# -*- coding: latin-1 -*-

# 最小生成树kruskal算法
# 算法关键在于判断新添加进来的边会不会形成环路
# 点为1，2，3，4，5，6
# grah记录点之间的距离

import copy

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

edges_choosed = []


def kruskal():
    # 按照权重整理边
    edge = dict()
    for i in range(0, v_num, 1):
        for j in range(0, v_num, 1):
            if i < j and grah[i][j] != MAX_NUM:
                edge[(i + 1, j + 1)] = grah[i][j]
    edge_sorted = sorted(edge.items(), key=lambda d: d[1])

    for i in range(0, len(edge_sorted), 1):
        # 如果边不会构成环路就把边加入，直到加入了v_num-1条边
        if checkUnion(edge_sorted[i][0]) != True:
            edges_choosed.append(edge_sorted[i])
        if len(edges_choosed) == v_num - 1:
            break


def checkUnion(edge):
    src, dest = edge[0], edge[1]
    stack = [edge[0]]
    index = 0
    
    while index != len(stack):
        cur_src = stack[index]
        for ((i, j), w) in edges_choosed:
            if cur_src == i and j not in stack: stack.append(j)
            if cur_src == j and i not in stack: stack.append(i)
        if dest in stack: return True
        index += 1
    return False


kruskal()
for ((i,j), w) in edges_choosed:
    print "(%d,%d)边被选中, 权重为%d" %(i, j, w)


    