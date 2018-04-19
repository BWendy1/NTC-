#coding=utf-8

import cgi,cgitb
import json
from ntcVisualize import NTCGraph
form=cgi.FieldStorage()
g_json = form.getvalue('g', None)
a_json = form.getvalue('a', None)
g = NTCGraph.fromJSONs(g_json)
g.action(a_json)

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
    