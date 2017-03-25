#!/usr/bin/python
# -*- coding: latin-1 -*-
# 单源最短路径

import copy

distance = {
    (1, 2): 2,
    (1, 3): 1,
    (2, 3): 2,
    (2, 4): 1,
    (2, 5): 3,
    (3, 4): 4,
    (4, 5): 1,
    (3, 6): 3,
    (5, 7): 1
}
maxCount = 7
stack = []
dist = dict()
path = dict()


def probe(snode, enode):
    if snode == enode: return
    stack.append(snode)

    for i in range(1, maxCount+1, 1):
        if (snode, i) in distance.keys() and i not in stack:
            if dist.get(snode, 0)+distance[(snode, i)]<dist.get(i,1000):
                dist[i] = dist.get(snode, 0)+distance[(snode, i)]
                path[i] = snode

    if snode in dist.keys(): del dist[snode]
    if not len(dist.keys()): return True

    item = sorted(dist.items(), key=lambda d:d[1])[0][0]
    probe(item, enode)


def searchPath(snode, enode):
    if snode == enode:
        return
    if enode in path.keys():
        searchPath(snode, path[enode])
        print "path %d=>%d" %(path[enode], enode)

probe(2, 7)
print(dist)
print(path)
searchPath(2, 7)






