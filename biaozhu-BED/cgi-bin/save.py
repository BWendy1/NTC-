#coding=utf-8

#获取标注语句详情
import cgi,cgitb
import json
import pymysql.cursors
import sys
reload(sys)
sys.setdefaultencoding('utf-8')

form=cgi.FieldStorage()
id = form.getvalue('originId')
userId = form.getvalue('lastUserId')
parentId = form.getvalue('parentId')
data = form.getvalue('data')
# data = '\u2342'
data = data.decode('unicode-escape')
# id = 25
# parentId = 1
# userId = 5
# data = u'\u1231'

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

sql = "SELECT * FROM test.finishdata WHERE originId=%d;"
cur.execute(sql % (int(id)))
conn.commit()

if (len(cur._rows)):
    sql = "UPDATE `test`.`finishdata` SET `data`='%s', `lastUserId`='%s' WHERE `originId`=%d;"
    cur.execute(sql % (data, userId, int(id)))
    conn.commit()
else:
    sql = "INSERT INTO `test`.`finishdata` (`data`, `lastUserId`, `originId`, `parentId`) VALUES ('%s', '%s', %d, %d);"
    cur.execute(sql % (data, userId, int(id), int(parentId)))
    conn.commit()
sql = "UPDATE `test`.`graphdata` SET `isFinished`=%d WHERE `id`=%d;"
cur.execute(sql % (1, int(id)))
conn.commit()



print("Content-Type: text/html\n" )
print

res = {
    "success": data
}
print(json.dumps(res))


