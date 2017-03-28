#!/usr/bin/evn python
# coding:utf-8

from collections import namedtuple
from sys import stdout

Node = namedtuple('Node', 'data, left, right')

tree = Node(1,
            Node(2,
                 Node(4,
                      Node(7, None, None),
                      None),
                 Node(5, None, None)),
            Node(3,
                 Node(6,
                      Node(8, None, None),
                      Node(9, None, None)),
                 None))

#前序遍历
def preorder(node):
    if node is not None:
       print node.data
       preorder(node.left)
       preorder(node.right)
#中序遍历
def inorder(node):
    if node is not None:
       inorder(node.left)
       print node.data
       inorder(node.right)  
#后序遍历
def postorder(node):
    if node is not None:
        postorder(node.left)
        postorder(node.right)
        print node.data

#层级遍历
def levelorder(node):
    stack = []
    if node is not None:
      stack.append(node)
    
    while len(stack) > 0:
        cur = stack.pop(0)
        print cur.data
        if cur.left is not None:
           stack.append(cur.left)
        if cur.right is not None:
           stack.append(cur.right)

levelorder(tree)

      
    




