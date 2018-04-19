#coding=utf-8

# 进入文章句子列表前判断是否可以进入
import cgi,cgitb
import json
import pymysql.cursors
from ntcVisualize import NTCGraph

form=cgi.FieldStorage()
essayId = form.getvalue('essayId')
userId = form.getvalue('userId')
essayId = int(essayId)
# userId = 5
# essayId = 1

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
sql = "SELECT * FROM test.graphdata WHERE id=%d;"
cur.execute(sql % (essayId))
conn.commit()

item = cur._rows[0]
print("Content-Type: text/html\n" )
print

if (item["currentUserId"] > 0 and item["currentUserId"] != userId): 
    res = {
        "data": None,
        "message": u'该语料被其他用户锁定了，请重新选择任务！',
        "success": 0,
    }
    print(json.dumps(res))
elif (item["currentUserId"] == userId):
    res = {
        "data": 1,
        "message": u'操作成功',
        "success": 1,
    }
    print(json.dumps(res))
else: 
    # 更新数据中的当前标注人
    sql = "UPDATE test.graphdata SET currentUserId='%s' WHERE id=%d;"
    cur.execute(sql % (userId, essayId))
    conn.commit()

    res = {
        "data": 1,
        "message": u'操作成功',
        "success": 1,
    }
    print(json.dumps(res))
cur.close()
conn.close()








