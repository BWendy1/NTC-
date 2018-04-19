#coding=utf-8

# 删除用户

import cgi,cgitb
import json
import pymysql.cursors

form=cgi.FieldStorage()

userId = form.getvalue('id')

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
sql = "DELETE FROM test.users WHERE id='%s';"
cur.execute(sql % (userId))
conn.commit()

print("Content-Type: text/html\n" )
print

res = {
    "data": 1,
    "success": 1,
}
print(json.dumps(res))

cur.close()
conn.close()



# print (res)




