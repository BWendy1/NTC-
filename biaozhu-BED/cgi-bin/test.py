#coding=utf-8

# 查询语料列表
import cgi,cgitb
import json
import pymysql.cursors
from ntcVisualize import NTCGraph
import connection

# def connDB():               #连接数据库 
#     conn = pymysql.connect(
#                 host='localhost',
#                 port=3306,
#                 user='root',
#                 passwd='zsddddbmm',
#                 db='test',
#                 charset='utf8',
#                 cursorclass=pymysql.cursors.DictCursor
#             )
#     cur = conn.cursor()
#     return (conn,cur)

# def connClose(conn,cur):          #关闭连接，释放资源 
#   cur.close()
#   conn.close()

conn=connection.conn
cur=connection.cur

sql = "SELECT * FROM test.graphdata where id<25;" # id小于25的为文章数据
cur.execute(sql)
conn.commit()
print("Content-Type: text/html\n" )
print
data = []
for item in cur:
    data.append(item)
res = {
    "data": data,
    "success": 1
}
print (json.dumps(res))
# cur.close()
# conn.close()

