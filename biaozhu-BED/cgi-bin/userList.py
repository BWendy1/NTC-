#coding=utf-8

# 用户列表

import cgi,cgitb
import json
import pymysql.cursors


form=cgi.FieldStorage()

def connDB():  #连接数据库 
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
    return (conn,cur)

def connClose(conn,cur):          #关闭连接，释放资源 
  cur.close()
  conn.close()


conn,cur=connDB()
sql = "SELECT * FROM test.users;"
cur.execute(sql)
conn.commit()

print("Content-Type: text/html\n" )
print

list = []
for item in cur:
    list.append(item)

data = {}
data["userList"] = list

res = {
    "data": data,
    "success": 1,
}
print(json.dumps(res))

cur.close()
conn.close()



# print (res)




