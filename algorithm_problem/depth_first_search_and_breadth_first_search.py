#-*- coding:utf-8 -*-

# 深度优先搜索
# 广度优先搜素

class Graph(object):
    def __init__(self, *args, **kwargs):
        self.node_neighbors = {}
        self.visited = {}
    def add_nodes(self, nodelist):
        for node in nodelist:
            self.add_node(node)
    def add_node(self, node):
        if not node in self.nodes():
            self.node_neighbors[node] = []
    def add_edge(self, edge):
        x, y = edge
        if x not in self.node_neighbors[y] and y not in self.node_neighbors[x]:
            self.node_neighbors[x].append(y)
            if x!=y:
                self.node_neighbors[y].append(x)
    def nodes(self):
        return self.node_neighbors.keys()
    def clear_visit(self):
        self.visited.clear()

    def depth_first_search(self, root=None):
        order = []

        def dfs(node):
            self.visited[node] = True
            order.append(node)
            for nextNode in self.node_neighbors[node]:
                if nextNode not in self.visited:
                    dfs(nextNode)      
        if root:
            dfs(root)      
        for n in self.nodes():
            if n not in self.visited:
                dfs(n)

        print order
        return order

    def breadth_first_search(self, root=None):
        queue = []
        order = []
        def bfs():
            if len(queue) > 0:
                node = queue.pop(0)
                order.append(node)
                self.visited[node] = True

                for nextNode in self.node_neighbors[node]:
                    if nextNode not in self.visited and nextNode not in queue:
                        queue.append(nextNode)
                bfs()

        if root:
            queue.append(root)
            bfs()     
        
        for n in self.nodes():
            if n not in self.visited:
                queue.append(n)
                bfs()
        print order
        return order



g = Graph()
g.add_nodes([i+1 for i in range(8)])
g.add_edge((1, 2))
g.add_edge((1, 3))
g.add_edge((2, 4))
g.add_edge((2, 5))
g.add_edge((4, 8))
g.add_edge((5, 8))
g.add_edge((3, 6))
g.add_edge((3, 7))
g.add_edge((6, 7))
print "nodes:", g.nodes()


g.breadth_first_search(1)
g.clear_visit()
g.depth_first_search(1)            

