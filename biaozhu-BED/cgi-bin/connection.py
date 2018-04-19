#coding=utf-8

import pymysql.cursors

# def connDB():  #连接数据库 
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

conn = pymysql.connect(
    host='localhost',
    port=3306,
    user='root',
    passwd='zsddddbmm',
    db='test',
    charset='utf8',
    cursorclass=pymysql.cursors.DictCursor
)
cur = conn.cursor()

# conn,cur=connDB()
