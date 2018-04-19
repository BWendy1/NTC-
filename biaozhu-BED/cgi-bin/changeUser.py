
#coding=utf-8

# 修改用户

import cgi,cgitb
import json
import pymysql.cursors

form=cgi.FieldStorage()

userId = form.getvalue('id')
name = form.getvalue('name')
password = form.getvalue('password')
root = form.getvalue('root')
root = int(root)

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

sql = "SELECT * FROM test.users WHERE name='%s';"
cur.execute(sql % name)
conn.commit()


print("Content-Type: text/html\n" )
print

if (len(cur._result.rows) > 0 and cur._rows[0]["id"] != userId):
    data = {
        "message": u'用户名已存在',
    }
    res = {
        "data": data,
        "success": 0,
    }
    print(json.dumps(res))
else:
    sql = "UPDATE `test`.`users` SET `name`='%s', `password`='%s', `root`=%d WHERE `id`='%s';"
    cur.execute(sql % (name, password, root, userId))
    conn.commit()
    res = {
        "data": 1,
        "success": 1,
    }
    print(json.dumps(res))

cur.close()
conn.close()



# print (res)




