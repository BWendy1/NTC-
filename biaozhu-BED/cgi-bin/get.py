#coding=utf-8

import cgi,cgitb
import json
from ntcVisualize import NTCGraph

# text = u'女学生像苏小姐才算替中国争面子，人又美，又是博士，这样的人到哪里去找呢？'
# text = u'由于干旱少雨，日照时间长，积温高（２８００度），非常有利于霜期保护性农业的发展，从而建构了朝阳“四季农业”的新格局。'
# text=u'白起利用赵括只善≮纸上谈兵≯，缺乏作战经验的弱点。'
text = u'她说，世界妇女大会是一个重要的会议，将有许多致力于妇女问题研究的人发表讲话或论文。'
g = NTCGraph(0, len(text), text)
print("Content-Type: text/html\n" )
print
ret = {}
ret['g'] = g.toJSONs()
ret['text'] = g.text
ret['is'] = u'\n'.join(g.toIndentedString())
ret['cs'] = u'\n'.join(g.toNTClauses())
if (g):
    print(json.dumps(ret))
else:
    print('error')
