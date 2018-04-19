#coding=utf-8

# 标注语句列表请求

import cgi,cgitb
import json
import pymysql.cursors

form=cgi.FieldStorage()
id = form.getvalue('id')
userId = form.getvalue('userId')
# id = 1
# userId = 5
pageNo = form.getvalue('pageNo')
pageSize = form.getvalue('pageSize')

def connDB():               #连接数据库 
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

# sql = "SELECT currentTaskId FROM test.users WHERE id=%d;"
#     cur.execute(sql % (int(id)))
#     conn.commit()
#     curTaskList = cur._rows[0]
#     curTaskList = json.loads(curTaskList)
#     print curTaskList
#     if (curTaskList.len > 0):
#         for task in curTaskList:
#             if (task.essayId == essayId): # 当前文章存在正在标注中的句子
#                 print task.id

conn,cur=connDB()

pageNo = int(pageNo)
pageSize = int(pageSize)
start = pageNo * pageSize - pageSize
end = pageSize  
sql = "SELECT * FROM test.graphdata WHERE parentId=%d LIMIT %d, %d;"
cur.execute(sql % (int(id), start, end))
conn.commit()

data = {
    "totalPage": 0,
    "currentPage": pageNo,
    "sentenceList": []
}

list = []
for item in cur:
    list.append(item)

sql = "SELECT COUNT(*) FROM test.graphdata WHERE parentId=%d;"
cur.execute(sql % (int(id)))
conn.commit()
len = cur._result.rows[0][0]

data["sentenceList"] = list
data["totalPage"] = len / pageSize
    
print("Content-Type: text/html\n" )
print

res = {
    "data": data,
    "success": 1,
}
print (json.dumps(res))
cur.close()
conn.close()



# print (json.dumps(ret))


# ret = {}
# ret['g'] = g.toJSONs()
# ret['text'] = g.text
# ret['is'] = u'\n'.join(g.toIndentedString())
# ret['cs'] = u'\n'.join(g.toNTClauses())
# if (g):
#     print(json.dumps(ret))
# else:
#     print('error')


