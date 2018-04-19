#coding=utf-8
import pymysql.cursors
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
f = open("graph.json", "r")
while True:
    line = f.readline()
    if line:
        #处理每行\n
        line = line.strip('\n')
        #line = line.split(" ")
        print line
        graph = line
        sql = "INSERT INTO `graphData` (`graphJson`) VALUES (%s)"
        cur.execute(sql, [graph])
    else:
        break
f.close()
cur.close()
conn.commit()
conn.close()