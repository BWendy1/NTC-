#coding=utf-8

#获取标注语句详情
import cgi,cgitb
import json
import pymysql.cursors
from ntcVisualize import NTCGraph

form=cgi.FieldStorage()
essayId = form.getvalue('essayId')
id = form.getvalue('id')
userId = form.getvalue('userId')

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
cur.execute(sql % (int(id)))
conn.commit()

item = cur._rows[0]
print("Content-Type: text/html\n" )
print

# # 更新数据中的当前标注人
# sql = "UPDATE test.graphdata SET currentUserId=%d WHERE id=%d;"
# cur.execute(sql % (int(userId), int(id)))
# conn.commit()

# # 更新用户标注信息
# sql = "UPDATE test.users SET currentTaskId=%d WHERE id=%d;"
# cur.execute(sql % (int(id), int(userId)))
# conn.commit()

linshi = json.dumps(json.loads(item['data']))
g = NTCGraph.fromJSONs(linshi)
data = {}
data['g'] = g.toJSONs()
data['text'] = g.text
data['is'] = u'\n'.join(g.toIndentedString())
data['cs'] = u'\n'.join(g.toNTClauses())
res = {
    "data": data,
    "success": 1,
}
if (g):
    print(json.dumps(res))
else:
    print('error')
cur.close()
conn.close()








