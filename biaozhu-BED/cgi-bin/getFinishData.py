#coding=utf-8

#获取标注语句详情
import cgi,cgitb
import json
import pymysql.cursors
from ntcVisualize import NTCGraph

form=cgi.FieldStorage()
id = form.getvalue('originId')
userId = form.getvalue('userId')
# id = 25
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

conn,cur=connDB()
sql = "SELECT * FROM test.finishdata WHERE originId=%d;"
cur.execute(sql % (int(id)))
conn.commit()

if (len(cur._rows)):
    item = cur._rows[0]

print("Content-Type: text/html\n" )
print
if (item):
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
else:
    print('error')
cur.close()
conn.close()








