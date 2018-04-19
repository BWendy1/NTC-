#coding=utf-8
import time

#登录
import cgi,cgitb
import json
import pymysql.cursors
import connection

form=cgi.FieldStorage()
name = form.getvalue('name')
pwd = form.getvalue('password')

name = 'cry'
password = 'qweqwe'

conn=connection.conn
cur=connection.cur

sql = "SELECT * FROM test.users WHERE name='%s';"
cur.execute(sql % name)
conn.commit()

print("Content-Type: text/html\n" )
print


if (len(cur._result.rows)):
    item = cur._rows[0]
    if (pwd == item["password"]): 
        data = {}
        data['userId'] = item["id"]
        data['name'] = item["name"]
        data['password'] = item["password"]
        data['root'] = item["root"]
        res = {
            "data": data,
            "success": 1,
        }
        print(json.dumps(res))
    else:
        res = {
            "data": None,
            "message": u"密码错误",
            "success": 0,
        }
        print(json.dumps(res))
else:
    res = {
        "data": None,
        "message": u"用户名不存在",
        "success": 0,
    }
    print(json.dumps(res))

# cur.close()
# conn.close()



# print (res)




