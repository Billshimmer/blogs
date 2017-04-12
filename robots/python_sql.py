#-*- coding:utf-8 -*-

import sqlite3

conn = sqlite3.connect('test.db')
cursor = conn.cursor()

cursor.execute('insert into user (id, name) values (\'1\', \'Michael\')')
cursor.execute('select * from user where id=?', ('1',))
values = cursor.fetchall()
print values

cursor.close()
conn.commit()
conn.close()

